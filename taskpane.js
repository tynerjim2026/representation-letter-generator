
/* Letter Generator — Word for Mac
   Automatically detects the open Word template.
   No Letter Type dropdown.
*/

const $ = id => document.getElementById(id);

let activeLetterType = null;
let detectedDocument = null;

const titleCase = s =>
  String(s || '')
    .trim()
    .toLowerCase()
    .replace(/\b[a-z]/g, c => c.toUpperCase());

const dateText = value =>
  new Date(value + 'T12:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

/* Detect which Word template is open */

async function detectLetterType() {
  activeLetterType = null;
  detectedDocument = null;

  $('detectedType').textContent =
    'Checking open Word document...';

  $('trafficFields').style.display = 'none';
  $('preview').style.display = 'none';
  $('status').textContent = '';

  try {
    const result = await Word.run(async context => {
      const markers = [
        '{{LETTER_DATE}}',
        '{{COURT_NAME}}',
        '{{COURT_STREET}}',
        '{{COURT_CITY_STATE_ZIP}}',
        '{{DEFENDANT_CAPTION}}',
        '{{DEFENDANT_NAME}}',
        '{{COUNTY}}',
        '{{UTT_LABEL}}',
        '{{UTT_NUMBERS}}'
      ];

      const searches = markers.map(marker => {
        const result = context.document.body.search(marker, {
          matchCase: true,
          matchWholeWord: false
        });

        result.load('items');
        return result;
      });

      const properties = context.document.properties;
      properties.load('title');

      await context.sync();

      const found = {};

      markers.forEach((marker, index) => {
        found[marker] = searches[index].items.length > 0;
      });

      return {
        found,
        title: properties.title || ''
      };
    });

    const found = result.found;

    const commonMarkers = [
      '{{LETTER_DATE}}',
      '{{COURT_NAME}}',
      '{{COURT_STREET}}',
      '{{COURT_CITY_STATE_ZIP}}',
      '{{DEFENDANT_CAPTION}}',
      '{{DEFENDANT_NAME}}'
    ];

    const commonComplete =
      commonMarkers.every(marker => found[marker]);

    const trafficLabel = found['{{UTT_LABEL}}'];
    const trafficNumbers = found['{{UTT_NUMBERS}}'];

    if (commonComplete && trafficLabel && trafficNumbers) {
      activeLetterType = 'traffic';

    } else if (
      commonComplete &&
      found['{{COUNTY}}'] &&
      !trafficLabel &&
      !trafficNumbers
    ) {
      activeLetterType = 'representation';
    }

    if (activeLetterType === 'traffic') {
      $('detectedType').textContent =
        'Traffic Representation Letter';

      $('trafficFields').style.display = 'block';

      $('status').textContent =
        'Traffic template detected. Enter court, defendant, and UTT information.';

    } else if (activeLetterType === 'representation') {
      $('detectedType').textContent =
        'Representation Letter';

      $('trafficFields').style.display = 'none';

      $('status').textContent =
        'Representation template detected. Enter court and defendant information.';

    } else {
      $('detectedType').textContent =
        'Letter template not recognized';

      $('status').textContent =
        'Open a fresh copy of your original Representation Letter or Traffic Letter template, then click Check Open Document. The template must contain its original placeholders.';
    }

    detectedDocument = result.title;

  } catch (error) {
    $('detectedType').textContent =
      'Unable to check document';

    $('status').textContent =
      'Word could not inspect the open document: ' +
      (error.message || String(error));

    console.error('Template detection error', error);
  }
}

/* Search the existing court directory */

function allCourts() {
  if (typeof COURT_DIRECTORY === 'undefined') {
    return [];
  }

  return Object.keys(COURT_DIRECTORY).flatMap(county =>
    (COURT_DIRECTORY[county] || []).map(court => ({
      ...court,
      county: court.county || county
    }))
  );
}

function searchCourts() {
  const query = $('courtSearch').value.trim().toLowerCase();
  const matchesBox = $('courtMatches');

  matchesBox.replaceChildren();
  matchesBox.style.display = 'none';

  if (!query) return;

  const matches = allCourts()
    .filter(court =>
      court.name.toLowerCase().includes(query) ||
      court.county.toLowerCase().includes(query)
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 30);

  if (!matches.length) {
    const message = document.createElement('p');
    message.className = 'note';
    message.style.padding = '10px';
    message.textContent =
      'No matching court found. Enter the court information manually.';
    matchesBox.appendChild(message);
  } else {
    matches.forEach(court => {
      const button = document.createElement('button');
      button.type = 'button';

      button.textContent =
        `${court.name} — ${court.county} County`;

      button.addEventListener('click', () => {
        chooseCourt(court);
      });

      matchesBox.appendChild(button);
    });
  }

  matchesBox.style.display = 'block';
}

function chooseCourt(court) {
  $('courtSearch').value = court.name;
  $('court').value = court.name;
  $('county').value = court.county;

  const address = String(court.address || '').trim();
  $('address').value = address;

  $('courtMatches').style.display = 'none';

  if (!address) {
    $('addressNote').textContent =
      'No address stored. Enter the verified mailing address manually.';

  } else if (court.addressStatus === 'mailing-listed') {
    $('addressNote').textContent =
      'Listed mailing address loaded. Confirm before sending.';

  } else if (
    court.addressStatus ===
    'conflicting-address-confirm-before-use'
  ) {
    $('addressNote').textContent =
      'WARNING: Conflicting court addresses. Verify before sending.';

  } else {
    $('addressNote').textContent =
      'Listed court address loaded. Mailing address has NOT been verified. Confirm before sending.';
  }
}

function clearCourtSelection() {
  $('court').value = '';
  $('county').value = '';
  $('address').value = '';

  $('addressNote').textContent =
    'Select a court from the results, or enter the court information manually.';
}

/* Multiple UTT numbers */

function addTicket(value = '') {
  const row = document.createElement('div');
  row.className = 'ticketRow';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'ticketInput';
  input.placeholder = 'Enter UTT number';
  input.value = value;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'removeTicket';
  removeButton.textContent = 'Remove';

  removeButton.addEventListener('click', () => {
    row.remove();

    if ($('ticketList').children.length === 0) {
      addTicket();
    }
  });

  row.appendChild(input);
  row.appendChild(removeButton);
  $('ticketList').appendChild(row);
}

function getTickets() {
  return Array.from(
    document.querySelectorAll('.ticketInput')
  )
    .map(input => input.value.trim())
    .filter(Boolean);
}

/* Questionnaire data */

function data() {
  return {
    letterType: activeLetterType,
    date: $('date').value,
    court: $('court').value.trim(),
    address: $('address').value.trim(),
    county: $('county').value.trim(),
    defendant: titleCase($('defendant').value),
    tickets: getTickets()
  };
}

function validate(d) {
  if (!d.letterType) {
    return 'Open a fresh letter template and click Check Open Document.';
  }

  if (!d.date) return 'Enter a letter date.';
  if (!d.court) return 'Select or enter a court name.';
  if (!d.county) return 'Select or enter a county.';
  if (!d.address) return 'Enter the verified mailing address.';
  if (!d.defendant) return "Enter the defendant's full name.";

  if (
    d.letterType === 'traffic' &&
    d.tickets.length === 0
  ) {
    return 'Enter at least one UTT number.';
  }

  return '';
}

function ticketCaption(tickets) {
  return `UTT No. ${tickets.join(', ')}`;
}

/* Letter previews */

function representationPreview(d) {
  return `${dateText(d.date)}

Clerk, ${d.court}
${d.address}

PEOPLE V. ${d.defendant.toUpperCase()}

Dear Clerk:

Please be advised that I have been retained to represent ${d.defendant} with regard to the above referenced matter.

Very truly yours,

LAW OFFICE OF JAMES E. TYNER, PLLC

By: _______________________________
    James E. Tyner

JET/aed
cc: ${titleCase(d.county)} County District Attorney’s Office
    ${d.defendant}`;
}

function trafficPreview(d) {
  return `${dateText(d.date)}

Clerk, ${d.court}
${d.address}

    PEOPLE V. ${d.defendant.toUpperCase()}
    ${ticketCaption(d.tickets)}

Dear Clerk:

Please be advised that this firm has been retained to represent ${d.defendant} with regard to the above referenced matter.

Please enter a plea of “not guilty” on behalf of ${d.defendant} and schedule this matter for a pre-trial conference.

Finally, kindly provide my office with information on how to handle this matter by mail, if appropriate.

Very truly yours,

LAW OFFICE OF JAMES E. TYNER, PLLC

By: _______________________________
    James E. Tyner

JET/aed`;
}

function preview(d) {
  return d.letterType === 'traffic'
    ? trafficPreview(d)
    : representationPreview(d);
}

function getData() {
  const d = data();
  const error = validate(d);

  $('status').textContent = error;
  return error ? null : d;
}

function doPreview() {
  const d = getData();
  if (!d) return;

  $('preview').style.display = 'block';
  $('preview').textContent = preview(d);

  $('status').textContent =
    'Preview is plain text. Word template controls formatting.';
}

/* Preserve working sequential Word replacements */

async function replaceAll(
  context,
  marker,
  value,
  required = true
) {
  let count = 0;

  while (count < 30) {
    const matches = context.document.body.search(marker, {
      matchCase: true,
      matchWholeWord: false
    });

    matches.load('items');
    await context.sync();

    if (matches.items.length === 0) break;

    matches.items[0].insertText(
      String(value),
      Word.InsertLocation.replace
    );

    await context.sync();
    count++;
  }

  if (count === 0 && required) {
    throw new Error(`Template field not found: ${marker}`);
  }

  if (count === 30) {
    throw new Error(`Too many replacements for ${marker}`);
  }

  return count;
}

/* Fill the appropriate Word letter */

async function fillLetter() {
  const d = getData();
  if (!d) return;

  $('status').textContent = 'Checking Word template...';

  let field = 'starting';

  try {
    await Word.run(async context => {
      const checkMarkers = [
        '{{LETTER_DATE}}',
        '{{COURT_NAME}}',
        '{{COURT_STREET}}',
        '{{COURT_CITY_STATE_ZIP}}',
        '{{DEFENDANT_CAPTION}}',
        '{{DEFENDANT_NAME}}',
        d.letterType === 'traffic'
          ? '{{UTT_LABEL}}'
          : '{{COUNTY}}'
      ];

      if (d.letterType === 'traffic') {
        checkMarkers.push('{{UTT_NUMBERS}}');
      }

      const checks = checkMarkers.map(marker => {
        const result = context.document.body.search(marker, {
          matchCase: true,
          matchWholeWord: false
        });

        result.load('items');
        return result;
      });

      await context.sync();

      for (let i = 0; i < checks.length; i++) {
        if (!checks[i].items.length) {
          throw new Error(
            'The current document is not a fresh ' +
            d.letterType +
            ' template. Missing: ' +
            checkMarkers[i]
          );
        }
      }

      const lines = d.address
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);

      const fields = [
        ['{{LETTER_DATE}}', dateText(d.date)],
        ['{{COURT_NAME}}', d.court],
        ['{{COURT_STREET}}', lines[0] || ''],
        [
          '{{COURT_CITY_STATE_ZIP}}',
          lines.slice(1).join(', ')
        ],
        ['{{DEFENDANT_CAPTION}}', d.defendant],
        ['{{DEFENDANT_NAME}}', d.defendant]
      ];

      if (d.letterType === 'representation') {
        fields.push([
          '{{COUNTY}}',
          titleCase(d.county)
        ]);
      } else {
        fields.push([
          '{{UTT_LABEL}}',
          'UTT No.'
        ]);

        fields.push([
          '{{UTT_NUMBERS}}',
          d.tickets.join(', ')
        ]);
      }

      $('status').textContent = 'Filling Word letter...';

      for (const [marker, value] of fields) {
        field = marker;
        await replaceAll(context, marker, value, true);
      }
    });

    $('status').textContent =
      'Letter filled successfully. Review the court mailing address and formatting, then use File > Save As.';

  } catch (error) {
    $('status').textContent =
      `Unable to fill letter while processing ${field}: ` +
      `${error.message || String(error)}. ` +
      'Open a fresh copy of the correct template before retrying.';

    console.error('Word letter fill error', field, error);
  }
}

/* Initialize */

function initialize() {
  const today = new Date();

  $('date').value =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, '0')}-` +
    `${String(today.getDate()).padStart(2, '0')}`;

  $('courtSearch').addEventListener('input', () => {
    clearCourtSelection();
    searchCourts();
  });

  $('detectButton').addEventListener(
    'click',
    detectLetterType
  );

  $('addTicketButton').addEventListener(
    'click',
    () => addTicket()
  );

  $('previewButton').addEventListener(
    'click',
    doPreview
  );

  $('generateButton').addEventListener(
    'click',
    fillLetter
  );

  addTicket();

  if (typeof COURT_DIRECTORY === 'undefined') {
    $('status').textContent =
      'WARNING: Court directory did not load.';
  }

  detectLetterType();
}

Office.onReady(initialize);

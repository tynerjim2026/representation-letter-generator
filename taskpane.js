
/* Representation Letter Generator — Word for Mac
   Supports:
   - Original Representation Letter
   - Traffic Representation Letter
   - Searchable court directory
   - Automatic county and address
   - Multiple UTT numbers
*/

const $ = id => document.getElementById(id);

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

/* Court directory search */

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

  if (matches.length === 0) {
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
      'No address is stored for this court. Enter a verified mailing address manually.';
  } else if (
    court.addressStatus === 'mailing-listed'
  ) {
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

/* Letter type */

function updateLetterType() {
  const isTraffic = $('letterType').value === 'traffic';

  $('trafficFields').style.display =
    isTraffic ? 'block' : 'none';

  $('templateNote').textContent = isTraffic
    ? 'Open a fresh copy of your Traffic Representation Letter template in Word before filling it.'
    : 'Open a fresh copy of your Representation Letter template in Word before filling it.';

  $('preview').style.display = 'none';
  $('status').textContent = '';
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

/* Letter data */

function data() {
  return {
    letterType: $('letterType').value,
    date: $('date').value,
    court: $('court').value.trim(),
    address: $('address').value.trim(),
    county: $('county').value.trim(),
    defendant: titleCase($('defendant').value),
    tickets: getTickets()
  };
}

function validate(d) {
  if (!d.date) {
    return 'Enter a letter date.';
  }

  if (!d.court) {
    return 'Select or enter a court name.';
  }

  if (!d.county) {
    return 'Select or enter a county.';
  }

  if (!d.address) {
    return 'Enter the verified court mailing address.';
  }

  if (!d.defendant) {
    return "Enter the defendant's full name.";
  }

  if (
    d.letterType === 'traffic' &&
    d.tickets.length === 0
  ) {
    return 'Enter at least one UTT number.';
  }

  return '';
}

function ticketCaption(tickets) {
  if (tickets.length === 0) return '';

  return tickets.length === 1
    ? `UTT NO.: ${tickets[0]}`
    : `UTT NOS.: ${tickets.join(', ')}`;
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
    'Preview is plain text. The Word template controls formatting.';
}

/* Word template replacements */

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
    throw new Error(
      `Template field not found: ${marker}`
    );
  }

  if (count === 30) {
    throw new Error(
      `Too many replacements for ${marker}`
    );
  }

  return count;
}

/* Generate the selected Word letter */

async function fillLetter() {
  const d = getData();
  if (!d) return;

  $('status').textContent = 'Filling Word letter…';

  let field = 'starting';

  try {
    await Word.run(async context => {
      const lines = d.address
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);

      const fields = [
        ['{{LETTER_DATE}}', dateText(d.date), true],
        ['{{COURT_NAME}}', d.court, true],
        ['{{COURT_STREET}}', lines[0] || '', true],
        [
          '{{COURT_CITY_STATE_ZIP}}',
          lines.slice(1).join(', '),
          true
        ],
        ['{{DEFENDANT_CAPTION}}', d.defendant, true],
        ['{{DEFENDANT_NAME}}', d.defendant, true]
      ];

      if (d.letterType === 'representation') {
        fields.push([
          '{{COUNTY}}',
          titleCase(d.county),
          true
        ]);
      } else {
        fields.push([
          '{{UTT_LABEL}}',
          d.tickets.length === 1
            ? 'UTT NO.'
            : 'UTT NOS.',
          true
        ]);

        fields.push([
          '{{UTT_NUMBERS}}',
          d.tickets.join(', '),
          true
        ]);
      }

      for (const [marker, value, required] of fields) {
        field = marker;

        await replaceAll(
          context,
          marker,
          value,
          required
        );
      }
    });

    $('status').textContent =
      'Letter filled successfully. Review the court mailing address and letter formatting, then use File > Save As in Word.';

  } catch (error) {
    $('status').textContent =
      `Unable to fill letter while processing ${field}: ` +
      `${error.message || String(error)} ` +
      `(${error.code || 'no error code'}). ` +
      'Open a fresh copy of the correct template before retrying.';

    console.error(
      'Word letter fill error',
      field,
      error
    );
  }
}

/* Initialize */

function initialize() {
  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  $('date').value = `${yyyy}-${mm}-${dd}`;

  $('courtSearch').addEventListener(
    'input',
    () => {
      clearCourtSelection();
      searchCourts();
    }
  );

  $('letterType').addEventListener(
    'change',
    updateLetterType
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
  updateLetterType();

  if (typeof COURT_DIRECTORY === 'undefined') {
    $('status').textContent =
      'WARNING: Court directory did not load. Check courts.js.';
  } else {
    $('status').textContent =
      'Open a fresh copy of the appropriate letter template in Word.';
  }
}

Office.onReady(initialize);

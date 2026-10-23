
/* Representation Letter Generator — Word for Mac */

const $ = id => document.getElementById(id);

const titleCase = s =>
  s.trim().toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());

const dateText = value =>
  new Date(value + 'T12:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

/* County and court selection */

function populateCourts() {
  const county = $('county').value;
  const select = $('courtSelect');

  select.replaceChildren();

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = county
    ? 'Select a court'
    : 'Select a county first';
  select.appendChild(placeholder);

  if (county && typeof COURT_DIRECTORY !== 'undefined') {
    const courts = COURT_DIRECTORY[county] || [];

    courts.slice().sort((a, b) =>
      a.name.localeCompare(b.name)
    ).forEach(court => {
      const option = document.createElement('option');
      option.value = court.name;
      option.textContent = court.name;
      select.appendChild(option);
    });
  }

  if (county) {
    const manual = document.createElement('option');
    manual.value = '__manual__';
    manual.textContent = 'Other court — enter manually';
    select.appendChild(manual);
  }

  $('court').value = '';
  $('address').value = '';
  $('addressNote').textContent =
    'Select a court, then confirm its mailing address.';
}

function selectCourt() {
  const county = $('county').value;
  const selected = $('courtSelect').value;

  if (!selected || selected === '__manual__') {
    $('court').value = '';
    $('address').value = '';
    $('addressNote').textContent =
      'Enter the court name and verified mailing address manually.';
    return;
  }

  const courts = COURT_DIRECTORY[county] || [];
  const court = courts.find(item => item.name === selected);

  if (!court) return;

  $('court').value = court.name;
  $('address').value = court.address || '';

  if (court.addressStatus === 'mailing-listed') {
    $('addressNote').textContent =
      'Official directory lists a mailing address. Confirm before use.';
  } else {
    $('addressNote').textContent =
      'WARNING: This is an official court location, not a verified mailing address. Confirm or correct it before use.';
  }
}

/* Letter data */

const data = () => ({
  date: $('date').value,
  court: $('court').value.trim(),
  address: $('address').value.trim(),
  county: $('county').value.trim(),
  defendant: titleCase($('defendant').value)
});

function validate(d) {
  return !d.date ? 'Enter a date.' :
    !d.county ? 'Select a county.' :
    !d.court ? 'Select or enter a court name.' :
    !d.address ? 'Enter the verified mailing address.' :
    !d.defendant ? 'Enter the defendant.' : '';
}

function preview(d) {
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

function getData() {
  const d = data();
  const err = validate(d);
  $('status').textContent = err;
  return err ? null : d;
}

function doPreview() {
  const d = getData();
  if (!d) return;

  $('preview').style.display = 'block';
  $('preview').textContent = preview(d);

  $('status').textContent =
    'Preview is plain text. The Word template controls Small Caps formatting.';
}

/* Preserve working sequential Word replacements */

async function replaceAll(context, marker, value, required = true) {
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
      value,
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

async function fillLetter() {
  const d = getData();
  if (!d) return;

  $('status').textContent = 'Filling Word letter…';
  let field = 'starting';

  try {
    await Word.run(async context => {
      const lines = d.address
        .split(/\r?\n/)
        .map(s => s.trim())
        .filter(Boolean);

      const fields = [
        ['{{LETTER_DATE}}', dateText(d.date), true],
        ['{{COURT_NAME}}', d.court, true],
        ['{{COURT_STREET}}', lines[0] || '', true],
        ['{{COURT_CITY_STATE_ZIP}}', lines.slice(1).join(', '), true],
        ['{{DEFENDANT_CAPTION}}', d.defendant, true],
        ['{{DEFENDANT_NAME}}', d.defendant, true],
        ['{{COUNTY}}', titleCase(d.county), true]
      ];

      for (const [marker, value, required] of fields) {
        field = marker;
        await replaceAll(context, marker, value, required);
      }
    });

    $('status').textContent =
      'Letter filled. Review the court mailing address and Small Caps caption, then use File > Save As in Word.';

  } catch (e) {
    $('status').textContent =
      `Unable to fill letter while processing ${field}: ` +
      `${e.message || String(e)} (${e.code || 'no error code'}). ` +
      'Open a fresh copy of the template before retrying.';

    console.error('Word letter fill error', field, e);
  }
}

/* Initialize */

$('date').value = new Date().toLocaleDateString('en-CA');

$('county').addEventListener('change', populateCourts);
$('courtSelect').addEventListener('change', selectCourt);
$('previewButton').addEventListener('click', doPreview);
$('generateButton').addEventListener('click', fillLetter);

Office.onReady(() => {
  $('status').textContent =
    'Open a fresh copy of your representation letter template in Word.';
});

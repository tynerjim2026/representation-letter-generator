
/* Representation Letter Generator — Word for Mac */

const $ = id => document.getElementById(id);

const titleCase = s =>
  String(s || '').trim().toLowerCase()
    .replace(/\b[a-z]/g, c => c.toUpperCase());

const dateText = value =>
  new Date(value + 'T12:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

const data = () => ({
  date: $('date').value,
  court: $('court').value.trim(),
  address: $('address').value.trim(),
  county: $('county').value.trim(),
  defendant: titleCase($('defendant').value),
  filename: $('filename').value.trim()
});

function validate(d) {
  return !d.date ? 'Enter a date.'
    : !d.court ? 'Enter a court name.'
    : !d.address ? 'Enter the verified mailing address.'
    : !d.county ? 'Enter the county.'
    : !d.defendant ? 'Enter the defendant.'
    : !d.filename ? 'Enter a filename.'
    : '';
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

let lastPreview = '';

function doPreview() {
  const d = getData();
  if (!d) return;

  $('preview').style.display = 'block';
  $('preview').textContent = preview(d);
  lastPreview = JSON.stringify(d);
  $('status').textContent =
    'Text preview only; inspect the Word document before saving.';
}

async function replaceOne(context, needle, replacement, smallCaps) {
  const found = context.document.body.search(needle, {
    matchCase: true,
    matchWholeWord: false
  });

  found.load('items');
  await context.sync();

  if (!found.items.length) {
    throw new Error(`Template field not found: ${needle}`);
  }

  const range = found.items[0];

  // Replace the placeholder, then synchronize with Word.
  range.insertText(replacement, Word.InsertLocation.replace);
  await context.sync();

  // Apply Small Caps to the caption using the inserted text range.
  if (smallCaps === true) {
    const inserted = context.document.body.search(replacement, {
      matchCase: true,
      matchWholeWord: false
    });

    inserted.load('items');
    await context.sync();

    if (inserted.items.length) {
      inserted.items[0].font.smallCaps = true;
      await context.sync();
    }
  }
}

async function fillLetter() {
  const d = getData();
  if (!d) return;

  if (lastPreview !== JSON.stringify(d)) {
    $('status').textContent =
      'Click Preview Letter first, then Fill Word Letter.';
    return;
  }

  $('status').textContent = 'Filling Word letter…';

  try {
    await Word.run(async context => {
      const addressLines = d.address
        .split(/\r?\n/)
        .map(x => x.trim())
        .filter(Boolean);

      await replaceOne(
        context, '{{LETTER_DATE}}', dateText(d.date)
      );
      await replaceOne(
        context, '{{COURT_NAME}}', d.court
      );
      await replaceOne(
        context, '{{COURT_STREET}}', addressLines[0] || ''
      );
      await replaceOne(
        context, '{{COURT_CITY_STATE_ZIP}}',
        addressLines.slice(1).join(', ')
      );
      await replaceOne(
        context, '{{DEFENDANT_CAPTION}}',
        d.defendant.toUpperCase(), true
      );
      await replaceOne(
        context, '{{DEFENDANT_BODY}}', d.defendant
      );
      await replaceOne(
        context, '{{COUNTY}}', titleCase(d.county)
      );
      await replaceOne(
        context, '{{DEFENDANT_CC}}', d.defendant
      );
    });

    $('status').textContent =
      `Letter filled. Review in Word, then use File > Save As ` +
      `and name it ${d.filename}.docx. ` +
      `The add-in does not save automatically.`;

  } catch (e) {
    console.error(e);
    $('status').textContent =
      'Unable to fill letter: ' +
      (e && e.message ? e.message : String(e));
  }
}

const now = new Date();

$('date').value = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0')
].join('-');

$('previewButton').addEventListener('click', doPreview);
$('generateButton').addEventListener('click', fillLetter);

Office.onReady(() => {
  $('status').textContent =
    'Open the matching starter template in Word to fill its fields.';
});

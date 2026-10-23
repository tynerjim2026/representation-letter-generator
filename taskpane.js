/* Representation Letter Generator - Word task pane starter */
const $ = id => document.getElementById(id);
const titleCase = s => s.trim().toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
const dateText = value => new Date(value + 'T12:00:00').toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
const data = () => ({date:$('date').value,court:$('court').value.trim(),address:$('address').value.trim(),county:$('county').value.trim(),defendant:titleCase($('defendant').value),filename:$('filename').value.trim()});
function validate(d){return !d.date?'Enter a date.':!d.court?'Enter a court name.':!d.address?'Enter the verified mailing address.':!d.county?'Enter the county.':!d.defendant?'Enter the defendant.':!d.filename?'Enter a filename.':''}
function preview(d){return `${dateText(d.date)}\n\nClerk, ${d.court}\n${d.address}\n\nPEOPLE V. ${d.defendant.toUpperCase()}\n\nDear Clerk:\n\nPlease be advised that I have been retained to represent ${d.defendant} with regard to the above referenced matter.\n\nVery truly yours,\n\nLAW OFFICE OF JAMES E. TYNER, PLLC\n\nBy: _______________________________\n    James E. Tyner\n\nJET/aed\ncc: ${titleCase(d.county)} County District Attorney’s Office\n    ${d.defendant}`}
function getData(){const d=data(),err=validate(d);$('status').textContent=err;return err?null:d}
function doPreview(){const d=getData();if(!d)return;$('preview').style.display='block';$('preview').textContent=preview(d);lastPreview=JSON.stringify(d);$('status').textContent='Text preview only; inspect the Word document before saving.'}
async function replaceFirst(context, needle, replacement, smallCaps){const matches=context.document.body.search(needle,{matchCase:true,matchWholeWord:false});matches.load('items');await context.sync();if(!matches.items.length)throw new Error(`Template field not found: ${needle}`);const range=matches.items[0];range.insertText(replacement,Word.InsertLocation.replace);if(smallCaps!==undefined)range.font.smallCaps=smallCaps;}
let lastPreview = '';
async function fillLetter(){const d=getData();if(!d)return;if(lastPreview !== JSON.stringify(d)){$('status').textContent='Click Preview Letter first, then Fill Word Letter.';return;}try{await Word.run(async context=>{
// These literal placeholders must exist in the provided starter template.
await replaceFirst(context,'{{LETTER_DATE}}',dateText(d.date));
await replaceFirst(context,'{{COURT_NAME}}',d.court);
const addressLines=d.address.split(/\r?\n/).filter(Boolean);
await replaceFirst(context,'{{COURT_STREET}}',addressLines[0]||'');
await replaceFirst(context,'{{COURT_CITY_STATE_ZIP}}',addressLines.slice(1).join(', '));
await replaceFirst(context,'{{DEFENDANT_NAME}}',d.defendant.toUpperCase(),true);
await replaceFirst(context,'{{DEFENDANT_NAME}}',d.defendant,false);
await replaceFirst(context,'{{COUNTY}}',titleCase(d.county));
await replaceFirst(context,'{{DEFENDANT_NAME}}',d.defendant,false);
await context.sync();});$('status').textContent=`Letter filled. Review in Word, then use File > Save As and name it ${d.filename}.docx. The add-in does not save automatically.`;}catch(e){$('status').textContent='Unable to fill letter: '+e.message;}}
const now=new Date();$('date').value=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');$('previewButton').addEventListener('click',doPreview);$('generateButton').addEventListener('click',fillLetter);
Office.onReady(()=>{$('status').textContent='Open the matching starter template in Word to fill its fields.'});

/* Representation Letter Generator — corrected Word task pane */
const $ = id => document.getElementById(id);
const titleCase = s => s.trim().toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
const dateText = value => new Date(value + 'T12:00:00').toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
const data = () => ({date:$('date').value,court:$('court').value.trim(),address:$('address').value.trim(),county:$('county').value.trim(),defendant:titleCase($('defendant').value),filename:$('filename').value.trim()});
function validate(d){return !d.date?'Enter a date.':!d.court?'Enter a court name.':!d.address?'Enter the verified mailing address.':!d.county?'Enter the county.':!d.defendant?'Enter the defendant.':!d.filename?'Enter a filename.':''}
function preview(d){return `${dateText(d.date)}\n\nClerk, ${d.court}\n${d.address}\n\nPEOPLE V. ${d.defendant.toUpperCase()}\n\nDear Clerk:\n\nPlease be advised that I have been retained to represent ${d.defendant} with regard to the above referenced matter.\n\nVery truly yours,\n\nLAW OFFICE OF JAMES E. TYNER, PLLC\n\nBy: _______________________________\n    James E. Tyner\n\nJET/aed\ncc: ${titleCase(d.county)} County District Attorney’s Office\n    ${d.defendant}`}
function getData(){const d=data(),err=validate(d);$('status').textContent=err;return err?null:d}
function doPreview(){const d=getData();if(!d)return;$('preview').style.display='block';$('preview').textContent=preview(d);$('status').textContent='Preview is plain text; Word retains the template formatting, including Small Caps.'}
// Search and replace all matches at once. The caption uses its own marker so
// its Small Caps formatting is independent of the body and cc occurrences.
async function replaceAll(context, marker, value, smallCaps, required=true){
  const results=context.document.body.search(marker,{matchCase:true,matchWholeWord:false});
  results.load('items');
  await context.sync();
  if(!results.items.length){if(required)throw new Error(`Template field not found: ${marker}`);return 0;}
  for(const match of results.items){
    const inserted=match.insertText(value,Word.InsertLocation.replace);
    if(smallCaps !== undefined) inserted.font.smallCaps=smallCaps;
  }
  await context.sync();
  return results.items.length;
}
async function fillLetter(){
  const d=getData();if(!d)return;
  $('status').textContent='Filling Word letter…';
  try{
    await Word.run(async context=>{
      const lines=d.address.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
      await replaceAll(context,'{{LETTER_DATE}}',dateText(d.date));
      await replaceAll(context,'{{COURT_NAME}}',d.court);
      await replaceAll(context,'{{COURT_STREET}}',lines[0]||'');
      await replaceAll(context,'{{COURT_CITY_STATE_ZIP}}',lines.slice(1).join(', '));
      await replaceAll(context,'{{DEFENDANT_CAPTION}}',d.defendant,true);
      await replaceAll(context,'{{COUNTY}}',titleCase(d.county));
      // Older templates may use a separate marker for body and cc.
      await replaceAll(context,'{{DEFENDANT_NAME}}',d.defendant,false,false);
      await context.sync();
    });
    $('status').textContent=`Letter filled. Review in Word, then use File > Save As and name it ${d.filename}.docx. The add-in does not save automatically.`;
  }catch(e){$('status').textContent='Unable to fill letter: '+(e.message||String(e));}
}
$('date').value=new Date().toLocaleDateString('en-CA');
$('previewButton').addEventListener('click',doPreview);
$('generateButton').addEventListener('click',fillLetter);
Office.onReady(()=>{$('status').textContent='Open the matching representation letter template in Word to fill its fields.'});

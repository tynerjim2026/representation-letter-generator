/* Representation Letter Generator — Word for Mac, sequential replacement */
const $ = id => document.getElementById(id);
const titleCase = s => s.trim().toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
const dateText = value => new Date(value + 'T12:00:00').toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
const data = () => ({date:$('date').value,court:$('court').value.trim(),address:$('address').value.trim(),county:$('county').value.trim(),defendant:titleCase($('defendant').value),filename:$('filename').value.trim()});
function validate(d){return !d.date?'Enter a date.':!d.court?'Enter a court name.':!d.address?'Enter the verified mailing address.':!d.county?'Enter the county.':!d.defendant?'Enter the defendant.':!d.filename?'Enter a filename.':''}
function preview(d){return `${dateText(d.date)}\n\nClerk, ${d.court}\n${d.address}\n\nPEOPLE V. ${d.defendant.toUpperCase()}\n\nDear Clerk:\n\nPlease be advised that I have been retained to represent ${d.defendant} with regard to the above referenced matter.\n\nVery truly yours,\n\nLAW OFFICE OF JAMES E. TYNER, PLLC\n\nBy: _______________________________\n    James E. Tyner\n\nJET/aed\ncc: ${titleCase(d.county)} County District Attorney’s Office\n    ${d.defendant}`}
function getData(){const d=data(),err=validate(d);$('status').textContent=err;return err?null:d}
function doPreview(){const d=getData();if(!d)return;$('preview').style.display='block';$('preview').textContent=preview(d);$('status').textContent='Preview is plain text. The Word template controls Small Caps formatting.'}
async function replaceAll(context, marker, value, required=true){
  let count=0;
  while(count<30){
    const matches=context.document.body.search(marker,{matchCase:true,matchWholeWord:false});
    matches.load('items');
    await context.sync();
    if(matches.items.length===0)break;
    matches.items[0].insertText(value,Word.InsertLocation.replace);
    await context.sync();
    count++;
  }
  if(count===0 && required)throw new Error(`Template field not found: ${marker}`);
  if(count===30)throw new Error(`Too many replacements for ${marker}`);
  return count;
}
async function fillLetter(){
  const d=getData();if(!d)return;
  $('status').textContent='Filling Word letter…';
  let field='starting';
  try{
    await Word.run(async context=>{
      const lines=d.address.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
      const fields=[
        ['{{LETTER_DATE}}',dateText(d.date),true],
        ['{{COURT_NAME}}',d.court,true],
        ['{{COURT_STREET}}',lines[0]||'',true],
        ['{{COURT_CITY_STATE_ZIP}}',lines.slice(1).join(', '),true],
        ['{{DEFENDANT_CAPTION}}',d.defendant,true],
        ['{{DEFENDANT_NAME}}',d.defendant,true],
        ['{{COUNTY}}',titleCase(d.county),true]
      ];
      for(const [marker,value,required] of fields){
        field=marker;
        await replaceAll(context,marker,value,required);
      }
    });
    $('status').textContent=`Letter filled. Review the caption's Small Caps in Word, then use File > Save As and name it ${d.filename}.docx.`;
  }catch(e){
    $('status').textContent=`Unable to fill letter while processing ${field}: ${e.message||String(e)} (${e.code||'no error code'}). Open a fresh copy of the template before retrying.`;
    console.error('Word letter fill error',field,e);
  }
}
$('date').value=new Date().toLocaleDateString('en-CA');
$('previewButton').addEventListener('click',doPreview);
$('generateButton').addEventListener('click',fillLetter);
Office.onReady(()=>{$('status').textContent='Open a fresh copy of the matching representation letter template in Word to fill its fields.'});

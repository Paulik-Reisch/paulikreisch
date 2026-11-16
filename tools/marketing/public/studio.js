const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let documents=[],current=null,filter='all',csrf='',role='manager',codeState={html:'',css:'',js:''},codeEditor=null,activeLanguage='html';
let pendingConfirmation=null;
function confirmAction(question,label,mount){
  pendingConfirmation?.(false);
  return new Promise(resolve=>{
    const panel=el('section',null,'action-confirmation');panel.setAttribute('role','group');panel.setAttribute('aria-labelledby','confirmation-question');
    const text=el('p',question);text.id='confirmation-question';
    const buttons=el('div'),cancel=el('button','Abbrechen'),accept=el('button',label,'primary');cancel.type=accept.type='button';
    let settled=false;const finish=value=>{if(settled)return;settled=true;panel.remove();pendingConfirmation=null;resolve(value);};
    pendingConfirmation=finish;cancel.onclick=()=>finish(false);accept.onclick=()=>finish(true);
    panel.onkeydown=event=>{if(event.key==='Escape'){event.preventDefault();finish(false);}};
    buttons.append(cancel,accept);panel.append(text,buttons);(mount??$('.editor-actions')).after(panel);cancel.focus();
  });
}
const kindNames={lp:'Landingpage',google:'Google',meta:'Meta',other:'Anzeige',newsletter:'Newsletter'};
function status(message,error=false){$('#status').textContent=message;$('#status').classList.toggle('error',error);}
async function api(path,options={}){const res=await fetch('/api/marketing'+path,{credentials:'same-origin',...options,headers:{'content-type':'application/json','x-csrf-token':csrf,...options.headers}});let data;try{data=await res.json();}catch{throw Error('Der Server antwortet nicht im erwarteten Format.');}if(!res.ok)throw Error(data.error||'Aktion fehlgeschlagen.');return data;}
function view(name){pendingConfirmation?.(false);for(const id of ['login','workspace','editor','files','links'])$('#'+id).hidden=id!==name;for(const b of $$('nav button'))b.disabled=name==='login';$('#logout').hidden=name==='login';$('#logout-mobile').hidden=name==='login';}
function el(tag,text,className){const n=document.createElement(tag);if(text!=null)n.textContent=text;if(className)n.className=className;return n;}
// Read the immutable live snapshot at action time, never unsaved form values.
async function liveDocument(id){
  const record=await api('/documents/'+encodeURIComponent(id));
  const doc=record.published?.document;
  if(!doc||!['lp','google','meta','other'].includes(doc.kind))throw Error('Keine öffentliche Web-Ansicht verfügbar.');
  if(!/^[a-z0-9-]+$/.test(doc.slug))throw Error('Ungültige veröffentlichte URL.');
  return {doc,url:'https://'+(doc.kind==='lp'?'lp.paulikreisch.de':'ads.paulikreisch.de')+'/'+doc.slug};
}
function liveActions(id,mount){
  const copy=el('button','Live-URL kopieren'),track=el('button','Tracking-Kurzlink erstellen');
  copy.type=track.type='button';
  copy.onclick=async()=>{try{const {url}=await liveDocument(id);await copyText(url);}catch(e){status(e.message,true);}};
  track.hidden=role!=='manager';
  track.onclick=async()=>{try{
    const {doc,url}=await liveDocument(id);
    $$('[data-filter]').forEach(b=>b.classList.remove('active'));
    $$('[data-section]').forEach(b=>b.classList.toggle('active',b.dataset.section==='links'));
    view('links');const form=$('#link-form');form.reset();$('#custom-code-label').hidden=true;
    form.elements.label.value=(doc.name||'').slice(0,100);
    form.elements.campaign.value=(doc.campaign||'').slice(0,100);
    form.elements.target.value=url;
    status('Veröffentlichtes Ziel übernommen. Noch kein Kurzlink erstellt.');
    await loadLinks(true);form.scrollIntoView({block:'start'});form.elements.label.focus();
  }catch(e){status(e.message,true);}};
  mount.append(copy,track);
}
function render(){
  const counts={lp:0,ads:0,newsletter:0};for(const d of documents)counts[d.kind==='lp'?'lp':d.kind==='newsletter'?'newsletter':'ads']++;
  for(const k of Object.keys(counts))$('#count-'+k).textContent=counts[k];
  const term=$('#search').value.toLowerCase(),items=documents.filter(d=>(filter==='all'||(filter==='ads'?!['lp','newsletter'].includes(d.kind):d.kind===filter))&&`${d.name} ${d.campaign}`.toLowerCase().includes(term));
  $('#total').textContent=`${items.length} Dokument${items.length===1?'':'e'}`;
  const container=$('#documents');container.replaceChildren();
  if(!items.length){const card=el('div',null,'empty');card.append(el('h3',documents.length?'Keine Treffer':'Noch keine Inhalte'),el('p',documents.length?'Suche oder Format ändern.':'Neue Inhalte bleiben zunächst privat.'));const button=el('button','+ Neu erstellen');button.onclick=()=>edit(null);card.append(button);container.append(card);}
  for(const d of items){const row=el('article',null,'document'),info=el('div');info.append(el('strong',d.name),el('small',`${kindNames[d.kind]} · ${d.campaign||'Ohne Kampagne'} · /${d.slug}`));const button=el('button','Bearbeiten');button.onclick=()=>load(d.id);const actions=el('div',null,'row-actions');actions.append(button);if(d.published&&d.kind!=='newsletter')liveActions(d.id,actions);row.append(info,el('span',d.published?(d.unpublishedChanges?'Live + neue Änderungen':'Veröffentlicht'):'Privater Entwurf','badge'),actions);container.append(row);}
}
async function refresh(){documents=await api('/documents');render();}
function step(data={slug:'start',title:'',body:'',bullets:[]}){const fragment=$('#step-template').content.cloneNode(true),root=fragment.querySelector('fieldset');for(const input of root.querySelectorAll('[data-key]'))input.value=Array.isArray(data[input.dataset.key])?data[input.dataset.key].join('\n'):data[input.dataset.key]??'';root.querySelector('.remove-step').onclick=()=>root.remove();$('#steps').append(fragment);}
function kindChanged(){const kind=$('[name=kind]').value;$('[name=mode] option[value=custom]').disabled=false;for(const b of $$('[data-language]')){if(b.dataset.language==='css')b.textContent=kind==='newsletter'?'Plaintext':'CSS';if(b.dataset.language==='javascript')b.hidden=kind==='newsletter';}const custom=$('[name=mode]').value==='custom';$('#code-fields').hidden=!custom;$('#lp-fields').hidden=kind!=='lp'||custom;$('#ad-fields').hidden=kind==='lp'||custom;$('#google-fields').hidden=kind!=='google';$('#newsletter-fields').hidden=kind!=='newsletter';for(const input of $$('#lp-fields input, #lp-fields textarea'))input.disabled=kind!=='lp'||custom;for(const input of $$('#ad-fields input, #ad-fields textarea'))input.disabled=kind==='lp'||custom;$('[name=title]').parentElement.hidden=kind==='google';$('[name=body]').parentElement.hidden=kind==='google';const nlc=kind==='newsletter'&&custom;if(nlc){$('#ad-fields').hidden=false;for(const c of $('#ad-fields').children)if(c.id!=='newsletter-fields'){c.hidden=true;for(const i of c.querySelectorAll('input,textarea'))i.disabled=true;}for(const i of $$('#newsletter-fields input'))i.disabled=false;}else for(const c of $('#ad-fields').querySelectorAll('.form-grid'))c.hidden=false;$('#publish').hidden=kind==='newsletter'||!current;$('#unpublish').hidden=!current?.published;$('#export').hidden=kind==='lp'||!current;if(custom)setTimeout(()=>mountCode().catch(e=>status(e.message,true)),0);}
function edit(record){$('#send-check').hidden=!(record&&record.draft.kind==='newsletter'&&role==='manager');codeEditor?.dispose();codeEditor=null;codeState={html:record?.draft.code?.html??'',css:record?.draft.code?.text??record?.draft.code?.css??'',js:record?.draft.code?.js??''};activeLanguage='html';$('#file-mappings').replaceChildren();current=record;$('#editor-form').reset();for(const file of record?.draft.files??[])addFile(file);$('#steps').replaceChildren();if(record){for(const [key,value]of Object.entries(record.draft)){const input=$(`[name="${key}"]`);if(input)input.value=Array.isArray(value)?value.join('\n'):value??'';}for(const s of record.draft.steps??[])step(s);}else{if(role==='ads')$('[name=kind]').value='google';step();}$('[name=kind]').disabled=!!record;$('#revision').textContent=record?`VERSION ${record.revision}${record.published?' · LIVE-SNAPSHOT V'+record.published.revision:''}`:'NEUER ENTWURF';$('#delete').hidden=!record;$('#preview').hidden=!record;kindChanged();$('#live-actions')?.remove();if(record?.published&&record.published.document?.kind!=='newsletter'){const actions=el('div',null,'editor-actions');actions.id='live-actions';liveActions(record.id,actions);$('.editor-actions').after(actions);}view('editor');status('');window.scrollTo(0,0);}
async function load(id){try{edit(await api('/documents/'+id));}catch(e){status(e.message,true);}}
function draft(){const form=$('#editor-form'),data=Object.fromEntries(new FormData(form));data.kind=$('[name=kind]').value;data.headlines=(data.headlines??'').split('\n').filter(s=>s.trim());data.descriptions=(data.descriptions??'').split('\n').filter(s=>s.trim());data.steps=$$('.step').map(root=>Object.fromEntries([...root.querySelectorAll('[data-key]')].map(input=>[input.dataset.key,input.dataset.key==='bullets'?input.value.split('\n').filter(s=>s.trim()):input.value])));data.mode=$('[name=mode]').value;data.code={...codeState};data.files=$$('.file-row').map(row=>({path:row.querySelector('[data-file=path]').value,target:row.querySelector('[data-file=target]').value}));return data;}
function download(name,type,body){const url=URL.createObjectURL(new Blob([body],{type})),a=el('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('#editor-form').onsubmit=async event=>{event.preventDefault();try{const result=await api('/documents'+(current?'/'+current.id:''),{method:current?'PUT':'POST',body:JSON.stringify({document:draft(),revision:current?.revision})});edit(result);status('Privater Entwurf gespeichert.');await refresh();}catch(e){status(e.message,true);}};
$('#login-form').onsubmit=async event=>{event.preventDefault();try{const data=Object.fromEntries(new FormData(event.target)),result=await api('/login',{method:'POST',body:JSON.stringify(data)});csrf=result.csrf;event.target.reset();view('workspace');await refresh();status('');}catch(e){status(e.message,true);}};
$('#new').onclick=()=>edit(null);$('#back').onclick=()=>{view('workspace');status('');};$('#add-step').onclick=()=>step({slug:'schritt-'+($$('.step').length+1),bullets:[]});$('[name=kind]').onchange=kindChanged;$('[name=mode]').onchange=kindChanged;$('#search').oninput=render;
for(const button of $$('[data-filter]'))button.onclick=()=>{filter=button.dataset.filter;$$('[data-filter]').forEach(b=>b.classList.toggle('active',b===button));$$('[data-section]').forEach(b=>b.classList.remove('active'));view('workspace');render();};
for(const button of $$('[data-section]'))button.onclick=()=>{const section=button.dataset.section;$$('[data-filter]').forEach(b=>b.classList.remove('active'));$$('[data-section]').forEach(b=>b.classList.toggle('active',b===button));view(section);status('');(section==='files'?loadFiles(true):loadLinks(true)).catch(e=>status(e.message,true));};
$('#preview').onclick=()=>{if(current)window.open('/preview/'+encodeURIComponent(current.id),'_blank','noopener,noreferrer');};
$('#send-check').onclick=async()=>{if(!current||current.draft.kind!=='newsletter')return;try{const p=await api('/documents/'+current.id+'/send-preview',{method:'POST',body:'{}'});const summary=`Betreff: ${p.subject}\nAbsender: ${p.from||'nicht gesetzt'}\nBestätigte Empfänger: ${p.count} (Tageslimit ${p.dailyLimit})`;if(!p.enabled){alert(summary+'\n\nVersand ist serverseitig nicht freigeschaltet. Es wird nichts gesendet.');return;}if(!p.count||p.overDailyLimit||!p.from){alert(summary+'\n\nKein Versand möglich: keine Empfänger, Limit überschritten oder Absender fehlt.');return;}const typed=prompt(summary+'\n\nZum Senden exakt eintippen: '+p.phrase);if(typed===null)return;const r=await api('/documents/'+current.id+'/send',{method:'POST',body:JSON.stringify({digest:p.digest,phrase:typed})});status(`Gesendet: ${r.sent}, fehlgeschlagen: ${r.failed}, nicht versucht: ${r.notAttempted}.`);}catch(e){status(e.message,true);}};
$('#export').onclick=async()=>{if(!current)return;try{const data=await api('/documents/'+current.id+'/export');if(current.draft.kind==='newsletter'){download(current.draft.slug+'.html','text/html;charset=utf-8',data.html);download(current.draft.slug+'.txt','text/plain;charset=utf-8',data.text);download(current.draft.slug+'-requirements.json','application/json',JSON.stringify({subject:data.subject,preheader:data.preheader,sendReady:data.sendReady,requirements:data.requirements},null,2));}else download(current.draft.slug+'.json','application/json',JSON.stringify(data,null,2));status('Export erstellt. Nichts wurde versendet oder als Kampagne geschaltet.');}catch(e){status(e.message,true);}};
for(const action of ['publish','unpublish','delete'])$('#'+action).onclick=async()=>{if(!current)return;const question=action==='publish'?'Diesen gespeicherten Inhalt öffentlich freigeben? Alle Texte, Ziele und Bilder geprüft?':action==='unpublish'?'Veröffentlichung zurückziehen? Die öffentliche URL ist danach nicht mehr verfügbar.':'Diesen unveröffentlichten Entwurf endgültig löschen?';const selected=current;if(!await confirmAction(question,action==='delete'?'Endgültig löschen':action==='publish'?'Öffentlich freigeben':'Zurückziehen'))return;if(current!==selected)return;try{const result=await api('/documents/'+current.id+(action==='delete'?'':'/'+action),{method:action==='delete'?'DELETE':'POST',body:JSON.stringify({revision:current.revision})});await refresh();if(action==='delete')view('workspace');else edit(result);status(action==='publish'?'Gespeicherter Stand veröffentlicht.':action==='unpublish'?'Veröffentlichung zurückgezogen.':'Entwurf gelöscht.');}catch(e){status(e.message,true);}};
const logout=async()=>{try{await api('/logout',{method:'POST',body:'{}'});csrf='';documents=[];current=null;view('login');status('Abgemeldet.');}catch(e){status(e.message,true);}};
async function mountCode(){if($('#code-fields').hidden)return;if(!window.PRCodeEditors){await Promise.race([new Promise(resolve=>window.addEventListener('pr-code-ready',resolve,{once:true})),new Promise((_,reject)=>setTimeout(()=>reject(Error('Codeeditor konnte nicht geladen werden.')),15000))]);}codeEditor?.dispose();const key=activeLanguage==='javascript'?'js':activeLanguage;for(const b of $$('[data-language]'))b.setAttribute('aria-selected',String(b.dataset.language===activeLanguage));codeEditor=window.PRCodeEditors.mount($('#code-editor'),{engine:$('#code-engine').value,language:activeLanguage,value:codeState[key],onChange:value=>{codeState[key]=value;}});}
for(const button of $$('[data-language]'))button.onclick=()=>{activeLanguage=button.dataset.language;mountCode().catch(e=>status(e.message,true));};
$('#code-engine').onchange=()=>mountCode().catch(e=>status(e.message,true));
function addFile(file={path:'',target:''}){const row=el('div',null,'file-row');for(const[key,label,placeholder]of [['path','Virtueller Pfad','/bilder/cover.jpg'],['target','Freigegebener static-Link','https://static.paulikreisch.de/f/…']]){const l=el('label',label),input=el('input');input.dataset.file=key;input.value=file[key];input.placeholder=placeholder;if(key==='target')input.type='url';l.append(input);row.append(l);}const remove=el('button','Entfernen','text-button danger');remove.type='button';remove.onclick=()=>row.remove();row.append(remove);$('#file-mappings').append(row);}
$('#add-file').onclick=()=>addFile();
$('#logout').onclick=logout;$('#logout-mobile').onclick=logout;

// Dateien und Kampagnen-Kurzlinks (nur Manager-Host). Gleiche Bibliothek und
// Linkdaten wie static.*/analytics.*, keine Kopien.
let fileList=[],fileCursor=null,linkList=[],linkCursor=null,pendingDeletions=[];
const FILE_TYPES={'image/png':['png'],'image/jpeg':['jpg','jpeg'],'image/webp':['webp'],'image/gif':['gif'],'application/pdf':['pdf'],'text/plain':['txt']};
async function fileError(file){
  if(!file.name||file.name.length>180||/[\/\\]/.test(file.name))return 'Der Dateiname ist ungültig. Bitte ohne Ordnerpfade hochladen.';
  if(!file.size||file.size>10_000_000)return 'Die Datei muss zwischen 1 Byte und 10 MB groß sein.';
  const extensions=FILE_TYPES[file.type];if(!extensions)return 'Dieser Dateityp ist nicht freigegeben.';
  if(!extensions.includes(file.name.toLowerCase().split('.').at(-1)))return 'Dateiendung und angegebener Dateityp stimmen nicht überein.';
  if(file.type==='text/plain')return '';
  const head=new Uint8Array(await file.slice(0,12).arrayBuffer());
  const prefix=value=>value.every((x,i)=>head[i]===x);
  const ok=file.type==='image/gif'?prefix([71,73,70,56])&&[55,57].includes(head[4])&&head[5]===97:file.type==='image/png'?prefix([137,80,78,71,13,10,26,10]):file.type==='image/jpeg'?prefix([255,216,255]):file.type==='application/pdf'?prefix([37,80,68,70,45]):prefix([82,73,70,70])&&[87,69,66,80].every((x,i)=>head[i+8]===x);
  return ok?'':'Der Dateiinhalt passt nicht zum angegebenen Typ. Nichts wurde hochgeladen.';
}
function renderFiles(){
  $('#count-files').textContent=fileList.length;$('#files-more').hidden=!fileCursor;
  const gone=new Set(pendingDeletions.map(p=>p.id));
  const del=$('#file-deletions');del.replaceChildren();
  for(const p of pendingDeletions.filter(p=>!fileList.some(a=>a.id===p.id))){
    const row=el('article',null,'document'),info=el('div');info.append(el('strong',p.name),el('small',`${p.type} · ${Math.ceil(p.size/1024)} KB`));
    const retry=el('button','Löschung erneut versuchen');retry.onclick=()=>fileRetry(p.id);row.append(info,el('span','Löschung ausstehend','badge'),retry);del.append(row);
  }
  const list=$('#file-list');list.replaceChildren();
  if(!fileList.length){const card=el('div',null,'empty');card.append(el('h3','Noch keine Dateien'),el('p','Privat hochladen, erst nach bestätigter Freigabe öffentlich teilbar.'));list.append(card);return;}
  for(const f of fileList){
    const row=el('article',null,'document'),info=el('div');
    if(f.status==='published'&&f.publicUrl&&f.type.startsWith('image/')){const thumb=el('img',null,'thumb');thumb.src=f.publicUrl;thumb.alt='';thumb.loading='lazy';info.append(thumb);}
    info.append(el('strong',f.name),el('small',`${f.type} · ${Math.ceil(f.size/1024)} KB`));
    if(f.status==='published'&&f.publicUrl){const link=el('small',f.publicUrl);link.className='public-url';info.append(link);}
    const actions=el('div',null,'row-actions');
    if(gone.has(f.id)){
      const retry=el('button','Löschung erneut versuchen');retry.onclick=()=>fileRetry(f.id);actions.append(retry);
      row.append(info,el('span','Löschung ausstehend','badge'),actions);list.append(row);continue;
    }
    if(f.status==='published'&&f.publicUrl){const copy=el('button','Link kopieren');copy.onclick=()=>copyText(f.publicUrl);actions.append(copy);}
    const toggle=el('button',f.status==='private'?'Öffentlich freigeben …':'Freigabe zurückziehen …');
    toggle.onclick=async()=>{
      const publish=f.status==='private';
      const question=publish?'Diese Datei öffentlich freigeben? Jeder mit dem Link darf sie abrufen und weitergeben.':'Neue Abrufe sperren? Bereits heruntergeladene oder extern gecachte Kopien können bleiben.';
      if(!await confirmAction(question,publish?'Jetzt öffentlich freigeben':'Freigabe jetzt zurückziehen',row))return;
      try{const updated=await api('/files/'+f.id+(publish?'/publish':'/withdraw'),{method:'POST',body:JSON.stringify({revision:f.revision,confirmed:true})});fileList=fileList.map(x=>x.id===f.id?updated:x);renderFiles();status(publish?'Freigegeben. Der Link ist jetzt abrufbar.':'Freigabe zurückgezogen.');}catch(e){status(e.message,true);}
    };
    const del2=el('button','Löschen …','danger');
    del2.onclick=async()=>{
      if(!await confirmAction('Diese Datei endgültig löschen? Der öffentliche Link funktioniert danach nicht mehr.','Endgültig löschen',row))return;
      try{const result=await api('/files/'+f.id,{method:'DELETE',body:JSON.stringify({revision:f.revision,confirmed:true})});fileList=fileList.filter(x=>x.id!==f.id);if(result.blobDeleted===false){pendingDeletions=[...pendingDeletions.filter(x=>x.id!==f.id),{id:f.id,name:f.name,size:f.size,type:f.type}];status('Löschung noch nicht abgeschlossen. Der geschützte Bereinigungseintrag bleibt erhalten - bitte später erneut versuchen.');}else status('Datei gelöscht.');renderFiles();}catch(e){status(e.message,true);}
    };
    actions.append(toggle,del2);
    row.append(info,el('span',f.status==='published'?'Öffentlich freigegeben':'Privat','badge'),actions);
    list.append(row);
  }
}
async function loadFiles(reset){
  if(reset){fileList=[];fileCursor=null;}
  const data=await api('/files'+(fileCursor?'?cursor='+encodeURIComponent(fileCursor):''));
  fileList=[...fileList,...data.records.filter(r=>!fileList.some(x=>x.id===r.id))];fileCursor=data.nextCursor??null;
  const del=await api('/files/deletions');pendingDeletions=del.pending??[];
  if(del.incomplete||del.failedIds?.length)status('Hinweis: Ausstehende Löschungen konnten nicht vollständig gelesen werden.',true);
  renderFiles();
}
async function fileRetry(id){try{const result=await api('/files/'+id+'/retry',{method:'POST',body:'{}'});pendingDeletions=pendingDeletions.filter(x=>x.id!==id);renderFiles();status(result.outcome==='completed'?'Löschung abgeschlossen.':'Der Dateiinhalt konnte noch nicht gelöscht werden. Bitte später erneut versuchen.');}catch(e){status(e.message,true);}}
async function copyText(text){try{await navigator.clipboard.writeText(text);status('Link kopiert.');}catch{status(text);}}
$('#upload-form').onsubmit=async event=>{
  event.preventDefault();const file=$('#upload-file').files?.[0];if(!file)return;
  const error=await fileError(file);if(error){status(error,true);return;}
  try{
    const res=await fetch('/api/marketing/files?name='+encodeURIComponent(file.name),{method:'POST',credentials:'same-origin',headers:{'content-type':file.type,'x-csrf-token':csrf},body:file});
    const data=await res.json().catch(()=>({}));if(!res.ok)throw Error(data.error||'Upload fehlgeschlagen.');
    fileList=[data,...fileList];$('#upload-form').reset();renderFiles();status('Privat gespeichert. Noch kein öffentlicher Zugriff.');
  }catch(e){status(e.message,true);}
};
$('#files-more').onclick=()=>loadFiles(false).catch(e=>status(e.message,true));

function renderLinks(){
  $('#count-links').textContent=linkList.length;$('#links-total').textContent=`${linkList.length} KURZLINK${linkList.length===1?'':'S'}`;$('#links-more').hidden=!linkCursor;
  const campaigns=new Map();
  for(const l of linkList){const key=l.campaign||'';const entry=campaigns.get(key)??{count:0,clicks:0};entry.count++;entry.clicks+=l.clicks;campaigns.set(key,entry);}
  const summary=$('#campaign-summary');summary.replaceChildren();
  if(campaigns.size){
    const box=el('div',null,'campaign-box');box.append(el('h2','Kampagnen-Auswertung'));
    for(const [name,entry]of [...campaigns].sort((a,b)=>b[1].clicks-a[1].clicks)){
      const line=el('p',null,'campaign-line');line.append(el('strong',name||'Ohne Kampagne'),el('span',`${entry.clicks} Aufruf${entry.clicks===1?'':'e'} · ${entry.count} Link${entry.count===1?'':'s'}`));box.append(line);
    }
    const hint=el('p','Aufrufe, nicht eindeutige Besucher. Automatisierte Aufrufe können mitgezählt werden.','muted');box.append(hint);summary.append(box);
  }
  const list=$('#link-list');list.replaceChildren();
  if(!linkList.length){const card=el('div',null,'empty');card.append(el('h3','Noch keine Kurzlinks'),el('p','Trackbare Kurzlinks bleiben bis zur Löschung bestehen.'));list.append(card);return;}
  for(const l of linkList){
    const row=el('article',null,'document'),info=el('div');
    info.append(el('strong',l.label),el('small',`${l.url} → ${l.target}`),el('small',`${l.campaign||'Ohne Kampagne'} · ${l.clicks} Aufruf${l.clicks===1?'':'e'}`));
    const actions=el('div',null,'row-actions');
    const copy=el('button','Link kopieren');copy.onclick=()=>copyText(l.url);
    const edit=el('button','Bearbeiten');edit.onclick=()=>editLink(l,row);
    const toggle=el('button',l.active?'Deaktivieren':'Aktivieren');
    toggle.onclick=async()=>{try{await api('/links/'+encodeURIComponent(l.code)+'/active',{method:'POST',body:JSON.stringify({revision:l.revision,active:!l.active})});await loadLinks(true);status(l.active?'Kurzlink deaktiviert. Neue Aufrufe erhalten eine Fehlerseite.':'Kurzlink aktiviert.');}catch(e){status(e.message,true);}};
    const del=el('button','Löschen …','danger');
    del.onclick=async()=>{
      if(!await confirmAction('Diesen Kurzlink endgültig löschen? Der Code bleibt gesperrt und kann nicht erneut vergeben werden.','Endgültig löschen',row))return;
      try{await api('/links/'+encodeURIComponent(l.code),{method:'DELETE',body:JSON.stringify({revision:l.revision,confirmed:true})});linkList=linkList.filter(x=>x.code!==l.code);renderLinks();status('Kurzlink gelöscht. Der Code bleibt gesperrt.');}catch(e){status(e.message,true);}
    };
    actions.append(copy,edit,toggle,del);
    row.append(info,el('span',l.active?'Aktiv':'Deaktiviert','badge'),actions);
    list.append(row);
  }
  refreshCampaignOptions();
}
function editLink(l,row){
  row.replaceChildren();
  const form=el('form',null,'link-edit');
  const label=el('input');label.value=l.label;label.maxLength=100;label.required=true;
  const target=el('input');target.type='url';target.value=l.target;target.required=true;
  const campaign=el('input');campaign.value=l.campaign??'';campaign.maxLength=100;campaign.setAttribute('list','campaign-options');
  const save=el('button','Speichern','primary');save.type='submit';
  const cancel=el('button','Abbrechen');cancel.type='button';cancel.onclick=()=>renderLinks();
  for(const [node,text]of [[label,'Name'],[target,'Zieladresse (HTTPS)'],[campaign,'Kampagne (optional)']]){const l2=el('label',text);l2.append(node);form.append(l2);}
  const buttons=el('div',null,'row-actions');buttons.append(save,cancel);form.append(buttons);
  form.onsubmit=async event=>{event.preventDefault();try{await api('/links/'+encodeURIComponent(l.code),{method:'PUT',body:JSON.stringify({revision:l.revision,label:label.value,target:target.value,campaign:campaign.value})});await loadLinks(true);status('Kurzlink aktualisiert. Die Kurz-URL bleibt unverändert.');}catch(e){status(e.message,true);}};
  row.append(form);
}
async function loadLinks(reset){
  if(reset){linkList=[];linkCursor=null;}
  const data=await api('/links'+(linkCursor?'?cursor='+encodeURIComponent(linkCursor):''));
  linkList=[...linkList,...data.records.filter(r=>!linkList.some(x=>x.code===r.code))];linkCursor=data.nextCursor??null;
  renderLinks();
}
function refreshCampaignOptions(){
  const names=new Set();for(const d of documents)if(d.campaign)names.add(d.campaign);for(const l of linkList)if(l.campaign)names.add(l.campaign);
  const dl=$('#campaign-options');dl.replaceChildren();for(const n of [...names].sort()){const o=el('option');o.value=n;dl.append(o);}
}
$('#link-form').onsubmit=async event=>{
  event.preventDefault();
  const form=event.target,data=Object.fromEntries(new FormData(form));
  if(data.format==='custom'&&!data.customCode){status('Bitte einen Wunschnamen angeben.',true);return;}
  try{
    const created=await api('/links',{method:'POST',body:JSON.stringify({label:data.label,target:data.target,campaign:data.campaign||'',format:data.format,customCode:data.format==='custom'?data.customCode:''})});
    linkList=[created,...linkList];form.reset();$('#custom-code-label').hidden=true;renderLinks();
    status('Kurzlink erstellt: '+created.url);
  }catch(e){status(e.message,true);}
};
$('[name=format]').onchange=event=>{$('#custom-code-label').hidden=event.target.value!=='custom';};
$('#links-more').onclick=()=>loadLinks(false).catch(e=>status(e.message,true));

(async()=>{try{const session=await api('/session');csrf=session.csrf;role=session.role;for(const b of $$('.manager-only'))b.hidden=role!=='manager';for(const option of $$('[name=kind] option'))option.disabled=role==='lp'?option.value!=='lp':role==='ads'?option.value==='lp':false;for(const button of $$('[data-filter]'))button.hidden=role==='lp'? !['all','lp'].includes(button.dataset.filter):role==='ads'?button.dataset.filter==='lp':false;filter=session.role==='lp'?'lp':session.role==='ads'?'ads':'all';view('workspace');await refresh();}catch{view('login');}})();

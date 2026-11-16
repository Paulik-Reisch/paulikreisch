import {MarketingError,HOSTS} from './model.mjs';
import {renderPage,PUBLIC_HEADERS,newsletterExport,adExport} from './render.mjs';
const PRIVATE={'cache-control':'private, no-store','x-robots-tag':'noindex, nofollow, noarchive','x-content-type-options':'nosniff','referrer-policy':'no-referrer'};
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{...PRIVATE,'content-type':'application/json;charset=utf-8'}});
export async function readBody(request){if(!request.headers.get('content-type')?.startsWith('application/json'))throw new MarketingError(415,'JSON erforderlich.');const reader=request.body?.getReader();if(!reader)throw new MarketingError(400,'Daten fehlen.');const chunks=[];let size=0;for(;;){const{value,done}=await reader.read();if(done)break;size+=value.length;if(size>400000){await reader.cancel();throw new MarketingError(413,'Dokument zu groß.');}chunks.push(value);}try{return JSON.parse(Buffer.concat(chunks));}catch{throw new MarketingError(400,'Ungültiges JSON.');}}
/** Authentication is deliberately injected. No insecure development default.
 * auth.session returns {email,csrf}; verifies a server-signed, host-audience
 * scoped HttpOnly session and checks the current account allowlist/status.
 * auth.login/logout return Responses. Hosting adapter handles auth rate limits.
 */
export function createMarketingHandler({service,auth,assets}){
  return async request=>{try{
    const url=new URL(request.url),host=url.hostname,role=Object.entries(HOSTS).find(([,value])=>value===host)?.[0];
    if(!role||url.port)throw new MarketingError(404,'Nicht gefunden.');
    const path=url.pathname,method=request.method,safe=['GET','HEAD'].includes(method);
    if(!safe&&request.headers.get('origin')!==`https://${host}`)throw new MarketingError(403,'Andere Herkunft nicht erlaubt.');
    if(path==='/api/marketing/login'&&method==='POST')return await auth.login(request,host);
    if(path==='/api/marketing/logout'&&method==='POST') {const session=await auth.session(request,host);if(!session||request.headers.get('x-csrf-token')!==session.csrf)throw new MarketingError(403,'Sicherheitsprüfung fehlgeschlagen.');return await auth.logout(request,host);}
    if(safe&&Object.hasOwn(assets,path))return new Response(method==='HEAD'?null:assets[path].body,{headers:{...PRIVATE,'content-type':assets[path].type,'content-security-policy':"default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; font-src 'self' data:; worker-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"}});
    if(safe&&path==='/' )return new Response(method==='HEAD'?null:assets['/'].body,{headers:{...PRIVATE,'content-type':'text/html;charset=utf-8'}});
    if(safe&&!path.startsWith('/api/')&&!path.startsWith('/preview/')) {
      const parts=path.split('/').filter(Boolean);if(role==='manager'||parts.length<1||parts.length>2)throw new MarketingError(404,'Nicht gefunden.');
      const doc=await service.public(parts[0],role==='lp'?'lp':'ads');
      return new Response(method==='HEAD'?null:renderPage(doc,{stepSlug:parts[1]}),{headers:PUBLIC_HEADERS});
    }
    const session=await auth.session(request,host);if(!session)throw new MarketingError(401,'Bitte anmelden.');
    if(!safe&&request.headers.get('x-csrf-token')!==session.csrf)throw new MarketingError(403,'Sicherheitsprüfung fehlgeschlagen.');
    const permitted=doc=>doc&& (role==='manager'||(role==='lp'?doc.kind==='lp':doc.kind!=='lp'));
    const owned=async id=>{const record=await service.get(id);if(!permitted(record.draft))throw new MarketingError(404,'Nicht gefunden.');return record;};
    if(path==='/api/marketing/session'&&method==='GET')return json({csrf:session.csrf,role});
    if(path==='/api/marketing/documents'){
      if(method==='GET')return json((await service.list()).filter(permitted));
      if(method==='POST'){const body=await readBody(request);if(!permitted(body.document))throw new MarketingError(403,'Falscher Arbeitsbereich.');return json(await service.create(body.document,session.email),201);}
    }
    const preview=path.match(/^\/preview\/([a-f0-9-]{36})$/);
    if(preview&&safe){const record=await owned(preview[1]);const headers={...PUBLIC_HEADERS,...PRIVATE};return new Response(method==='HEAD'?null:renderPage(record.draft,{preview:true,previewId:record.id,stepSlug:url.searchParams.get('step')}),{headers});}
    const match=path.match(/^\/api\/marketing\/documents\/([a-f0-9-]{36})(?:\/(publish|unpublish|export))?$/);
    if(!match)throw new MarketingError(404,'Nicht gefunden.');
    const[,id,action]=match,record=await owned(id);
    if(!action&&method==='GET')return json(record);
    if(action==='export'&&method==='GET')return json(record.draft.kind==='newsletter'?newsletterExport(record.draft):adExport(record.draft));
    const body=await readBody(request);
    if(!action&&method==='PUT'){if(!permitted(body.document))throw new MarketingError(403,'Falscher Arbeitsbereich.');if(body.document.kind!==record.draft.kind)throw new MarketingError(409,'Format kann nicht geändert werden.');return json(await service.update(id,body.document,body.revision,session.email));}
    if(!action&&method==='DELETE')return json(await service.remove(id,body.revision,session.email));
    if(action==='publish'&&method==='POST')return json(await service.publish(id,body.revision,session.email));
    if(action==='unpublish'&&method==='POST')return json(await service.unpublish(id,body.revision,session.email));
    throw new MarketingError(405,'Methode nicht erlaubt.');
  }catch(error){return json({error:error instanceof MarketingError?error.message:'Serverfehler. Bitte später erneut versuchen.'},error instanceof MarketingError?error.status:500);}};
}

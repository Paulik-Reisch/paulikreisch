import {PrivateAssetService,type Actor} from './private-asset-service';
/** Ready for an exact-host route adapter; deliberately not a live route. */
export async function privateAssetResponse(service:PrivateAssetService,actor:Actor,id:string):Promise<Response>{
 const headers={'Cache-Control':'private, no-store, max-age=0','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow, noarchive','Content-Security-Policy':"default-src 'none'; sandbox",'Referrer-Policy':'no-referrer'};
 if(!/^[a-f0-9-]{36}$/.test(id))return new Response('Nicht gefunden.',{status:404,headers});
 try{const {record,bytes}=await service.read(actor,id);return new Response(Buffer.from(bytes),{headers:{...headers,'Content-Type':record.type,'Content-Disposition':`attachment; filename*=UTF-8''${encodeURIComponent(record.name)}`,'Content-Length':String(bytes.byteLength)}})}catch{return new Response('Nicht gefunden.',{status:404,headers})}
}

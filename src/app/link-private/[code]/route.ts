import type {NextRequest} from 'next/server';
import {requestHost} from '@/lib/admin-host-policy';
import {SHORT_LINK_HOST,resolveShortLink,shouldCountShortLink} from '@/lib/short-links';
import {shortLinks,shortLinksEnabled} from '@/lib/short-links-server';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store, max-age=0','X-Robots-Tag':'noindex, nofollow, noarchive','Referrer-Policy':'no-referrer'};
async function respond(request:NextRequest,{params}:{params:Promise<{code:string}>}){
  if(requestHost(request.headers)!==SHORT_LINK_HOST||!shortLinksEnabled())return new Response('Nicht gefunden.',{status:404,headers});
  try{
    const target=await resolveShortLink(shortLinks(),(await params).code,shouldCountShortLink(request.method,request.headers));
    if(!target)return new Response('Nicht gefunden.',{status:404,headers});
    // Target was validated at creation and again when loaded. Never forward query strings,
    // referrers, cookies or request-supplied destination/host values.
    return new Response(null,{status:302,headers:{...headers,Location:target}});
  }catch{return new Response('Kurzlink ist vorübergehend nicht verfügbar.',{status:503,headers});}
}
export const GET=respond;
export const HEAD=respond;

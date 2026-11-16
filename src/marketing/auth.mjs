import {createHmac,timingSafeEqual,randomBytes,hkdfSync} from 'node:crypto';
import {readBody} from './http.mjs';import {MarketingError,HOSTS} from './model.mjs';
const COOKIE='__Host-pr-marketing';
const response=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json;charset=utf-8','cache-control':'private, no-store','x-robots-tag':'noindex,nofollow',...extra}});
const parseCookie=request=>{const entries=request.headers.get('cookie')?.split(';').map(v=>v.trim())??[];const values=entries.filter(v=>v.startsWith(COOKIE+'='));return values.length===1?values[0].slice(COOKIE.length+1):'';};
export class MarketingAuth {
  constructor({secret,verifyPassword,currentUser,allowedEmail,limit,now=()=>Date.now()}){if(typeof secret!=='string'||secret.length<32)throw Error('Server key missing.');this.key=Buffer.from(hkdfSync('sha256',secret,'paulikreisch-marketing-v1','host-session',32));this.verifyPassword=verifyPassword;this.currentUser=currentUser;this.allowedEmail=allowedEmail;this.limit=limit;this.now=now;}
  sign(data){const payload=Buffer.from(JSON.stringify(data)).toString('base64url');return payload+'.'+createHmac('sha256',this.key).update(payload).digest('base64url');}
  verify(value,host){try{if(value.length>4096||!Object.values(HOSTS).includes(host))return null;const[payload,mac,extra]=value.split('.');if(extra||!payload||!mac)return null;const expected=createHmac('sha256',this.key).update(payload).digest(),actual=Buffer.from(mac,'base64url');if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return null;const data=JSON.parse(Buffer.from(payload,'base64url'));if(data.aud!==host||!Number.isSafeInteger(data.issued)||data.issued>this.now()||!Number.isSafeInteger(data.expires)||data.expires<=this.now()||data.expires>this.now()+8*3600000||typeof data.email!=='string'||typeof data.csrf!=='string'||!/^[a-f0-9]{64}$/.test(data.csrf)||!this.allowedEmail(data.email))return null;return data;}catch{return null;}}
  async session(request,host){const data=this.verify(parseCookie(request),host);if(!data)return null;try{const user=await this.currentUser(data.email);if(user.disabled||!user.emailVerified||!this.allowedEmail(user.email)||(user.tokensValidAfterTime&&Date.parse(user.tokensValidAfterTime)>data.issued))return null;return data;}catch{return null;}}
  async login(request,host){
    if(!Object.values(HOSTS).includes(host)||request.headers.get('origin')!=='https://'+host)throw new MarketingError(403,'Andere Herkunft nicht erlaubt.');
    // A distributed limiter is required, not an in-process Map. Hosting binding
    // uses a generation-checked encrypted bucket record. Never log credentials.
    if(!this.limit||!await this.limit(host))return response({error:'Zu viele Anmeldeversuche. Später erneut versuchen.'},429,{'retry-after':'900'});
    const body=await readBody(request);if(typeof body.email!=='string'||typeof body.password!=='string'||body.email.length>254||body.password.length>4096)return response({error:'Anmeldung fehlgeschlagen.'},401);
    const email=body.email.trim().toLowerCase();if(!this.allowedEmail(email))return response({error:'Anmeldung fehlgeschlagen.'},401);
    let user;try{user=await this.verifyPassword(email,body.password,host);}catch{return response({error:'Anmeldung fehlgeschlagen.'},401);}
    if(!user?.emailVerified||user.disabled||user.email?.toLowerCase()!==email||!this.allowedEmail(user.email))return response({error:'Anmeldung fehlgeschlagen.'},401);
    const data={email,aud:host,issued:this.now(),csrf:randomBytes(32).toString('hex'),expires:this.now()+8*3600000};
    return response({csrf:data.csrf},200,{'set-cookie':`${COOKIE}=${this.sign(data)}; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`});
  }
  async logout(){return response({ok:true},200,{'set-cookie':`${COOKIE}=; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`});}
}

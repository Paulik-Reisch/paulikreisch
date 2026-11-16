import {createHmac,hkdfSync,timingSafeEqual} from 'node:crypto';
/** Opaque per-recipient tokens. The token is `<id>.<mac>`: `id` is a random
 * 128-bit UUID that identifies a subscriber record and carries no address data;
 * `mac` is a purpose-bound HMAC-SHA256 so a token for one action (confirm,
 * unsubscribe) cannot be replayed for another. The MAC proves the link was
 * issued by this server; it is NOT the only gate, since the record lookup,
 * the record state and (for confirm) a single-use nonce still decide the
 * outcome. Nothing here can be reversed into an e-mail address. */
const PURPOSES=new Set(['confirm','unsubscribe']);
const ID=/^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const MAC=/^[A-Za-z0-9_-]{43}$/;
function key(secret){
  if(typeof secret!=='string'||secret.length<32)throw Error('Server key missing.');
  return Buffer.from(hkdfSync('sha256',secret,'paulikreisch-newsletter-v1','token-mac',32));
}
export function tokenFor(secret,purpose,id,extra=''){
  if(!PURPOSES.has(purpose))throw Error('Invalid purpose.');
  if(!ID.test(id))throw Error('Invalid id.');
  const mac=createHmac('sha256',key(secret)).update(`${purpose}\n${id}\n${extra}`).digest('base64url');
  return `${id}.${mac}`;
}
/** Returns the record id for well-formed tokens, otherwise null. Syntax only. */
export function tokenId(token){
  if(typeof token!=='string'||token.length>120)return null;
  const [id,mac,...rest]=token.split('.');
  return rest.length===0&&ID.test(id??'')&&MAC.test(mac??'')?id:null;
}
export function checkToken(secret,purpose,token,id,extra=''){
  if(tokenId(token)!==id)return false;
  const expected=Buffer.from(tokenFor(secret,purpose,id,extra));
  const given=Buffer.from(token);
  return expected.length===given.length&&timingSafeEqual(expected,given);
}

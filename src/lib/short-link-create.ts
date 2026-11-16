import {randomInt} from 'node:crypto';
import {validateCustomShortLinkCode,validateShortLinkCampaign,type ShortLinkRepository} from './short-links';
export type ShortLinkFormat='random'|'hex'|'custom';
export function randomShortLinkCode(format:'random'|'hex',pick:(max:number)=>number=randomInt):string {
  const alphabet=format==='hex'?'0123456789abcdef':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({length:4},()=>alphabet[pick(alphabet.length)]).join('');
}
/** Create-only writes arbitrate collisions atomically, never a read-before-write check. */
export async function createManagedShortLink(repo:ShortLinkRepository,fields:{label:string;target:string;campaign?:string},format:unknown,custom:unknown,generate:(format:'random'|'hex')=>string=randomShortLinkCode):Promise<string>{
  if(format!=='random'&&format!=='hex'&&format!=='custom')throw new Error('Ungültiges Code-Format.');
  const customCode=format==='custom'?validateCustomShortLinkCode(custom):null;
  const campaign=validateShortLinkCampaign(fields.campaign)||undefined;
  for(let attempt=0;attempt<(format==='custom'?1:12);attempt++){
    const code=customCode??generate(format as 'random'|'hex');
    try{await repo.create({label:fields.label,target:fields.target,...(campaign?{campaign}:{}),code,active:true,clicks:0,createdAt:new Date().toISOString()});return code;}
    catch(error){if(Number((error as {code?:number|string})?.code)!==412||format==='custom')throw error;}
  }
  throw new Error('Code-Raum derzeit belegt. Bitte erneut versuchen.');
}

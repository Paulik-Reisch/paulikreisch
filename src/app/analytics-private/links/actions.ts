'use server';
import {randomBytes} from 'node:crypto';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {requireShortLinkManager,shortLinks} from '@/lib/short-links-server';
import {SHORT_LINK_CODE,validateShortLinkLabel,validateShortLinkTarget} from '@/lib/short-links';
export async function createShortLinkAction(form:FormData):Promise<void>{
  await requireShortLinkManager();
  let code='';let error=false;
  try{
    const target=validateShortLinkTarget(form.get('target'));
    const label=validateShortLinkLabel(form.get('label'));
    // 96 random bits; create-only storage preconditions prohibit collisions replacing a link.
    code=randomBytes(12).toString('base64url');
    await shortLinks().create({code,label,target,active:true,clicks:0,createdAt:new Date().toISOString()});
  }catch{error=true;}
  revalidatePath('/links');
  redirect(error?'/links?notice=create-error':`/links?created=${code}`);
}
export async function setShortLinkActiveAction(form:FormData):Promise<void>{
  await requireShortLinkManager();
  let error=false;
  try{
    const code=form.get('code');const revision=form.get('revision');const active=form.get('active');
    if(typeof code!=='string'||!SHORT_LINK_CODE.test(code)||typeof revision!=='string'||!/^\d+$/.test(revision)||(active!=='true'&&active!=='false'))throw new Error('Ungültige Änderung.');
    await shortLinks().setActive(code,revision,active==='true');
  }catch{error=true;}
  revalidatePath('/links');
  redirect(error?'/links?notice=change-error':'/links?notice=changed');
}

import 'server-only';
import {getAdminStorage,getAdminAuth} from './firebase-admin';
import {getAnalyticsSession,assertAnalyticsOrigin} from './analytics-session';
import {shortLinkRepository} from './short-links-adapters';
export function shortLinksEnabled(){return process.env.SHORT_LINK_RELEASE==='private-prefix-v1-accepted'}
export async function requireShortLinkManager(){
  await assertAnalyticsOrigin();
  const session=await getAnalyticsSession();
  if(!session)throw new Error('Bitte erneut anmelden.');
  const user=await getAdminAuth().getUserByEmail(session.email);
  if(!user.emailVerified||user.disabled)throw new Error('Konto ist nicht freigegeben.');
}
export function shortLinks(){
  if(!shortLinksEnabled())throw new Error('Kurzlinks sind noch nicht aktiviert.');
  return shortLinkRepository(getAdminStorage().bucket('hallo-welt-paulik-reisch.firebasestorage.app'));
}

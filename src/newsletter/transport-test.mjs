import {createHash} from 'node:crypto';
import {SendRefused} from './campaign.mjs';
/** Fixed non-promotional probe. No recipient input, newsletter store or links. */
export const TRANSPORT_PROBE=Object.freeze({
  from:'Paulik & Reisch <newsletter@news.paulikreisch.de>',
  replyTo:'philipp.l.paulik@gmail.com',to:'philipp.l.paulik@gmail.com',
  subject:'Paulik & Reisch: Versandtest',
  text:'Das ist der einmalige technische Versandtest von Paulik & Reisch. Es wurde kein Newsletter-Abo angelegt und niemand sonst angeschrieben. Antworten gehen an philipp.l.paulik@gmail.com.',
});
export const PROBE_PHRASE='EINMALIGEN VERSANDTEST AN PHILIPP SENDEN';
export const PROBE_ID='newsletter-transport-v1';
export const PROBE_DIGEST=createHash('sha256').update(JSON.stringify(TRANSPORT_PROBE)).digest('hex');
export function createTransportTest({enabled,getProvider,claim,configured}){
  return {
    preview(){return {...TRANSPORT_PROBE,enabled:Boolean(enabled),configured:Boolean(configured),digest:PROBE_DIGEST,phrase:PROBE_PHRASE,
      warning:'Genau eine technische Mail, kein Newsletter-Abo, keine weiteren Empfänger. Ein verbrauchter oder unklarer Versuch wird nicht wiederholt.'};},
    async send(approval){
      if(!enabled)throw new SendRefused('Technischer Einzeltest ist nicht freigeschaltet.');
      if(!configured)throw new SendRefused('Testversand ist nicht vollständig konfiguriert.');
      if(approval?.digest!==PROBE_DIGEST||approval?.phrase!==PROBE_PHRASE)throw new SendRefused('Testbestätigung stimmt nicht.');
      // Durable create-only claim BEFORE provider call. No automatic retry after
      // timeout/crash, including after the provider idempotency window expires.
      if(!await claim(PROBE_ID))throw new SendRefused('Einzeltest wurde bereits beansprucht. Keine Wiederholung.');
      const {to,...message}=TRANSPORT_PROBE;
      const result=await getProvider().send({...message,to:[to],html:'<p>'+message.text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')+'</p>'},{idempotencyKey:PROBE_ID+':'+PROBE_DIGEST});
      return {accepted:true,providerId:result.id,recipient:to};
    },
  };
}

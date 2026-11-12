import 'server-only';
import type {Firestore} from 'firebase-admin/firestore';
import type {DailyWordStore,DailyWordRecord} from './worthaft-persistent-daily';
/** Dormant adapter. Current public REST/game loader is intentionally unchanged until migration approval. */
export function persistentDailyWordStore(db:Firestore):DailyWordStore{return {choose:async candidate=>{
 const ref=db.collection('worthaft_daily_words_v1').doc(candidate.date);
 return db.runTransaction(async tx=>{const snap=await tx.get(ref);if(snap.exists)return snap.data() as DailyWordRecord;tx.create(ref,candidate);return candidate})
}}}

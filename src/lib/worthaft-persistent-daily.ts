import {getWorthaftWordOfTheDay} from './worthaft-daily-word';
export type DailyWordRecord={date:string;word:string;sourceRevision:string};
export function assertDailyWordRecord(value:unknown,date:string):asserts value is DailyWordRecord {const record=value as DailyWordRecord|null;if(!record||record.date!==date||typeof record.word!=='string'||!/^[A-ZÄÖÜẞ]{5}$/.test(record.word)||typeof record.sourceRevision!=='string'||!record.sourceRevision)throw new Error('Ungültiges gespeichertes Tageswort.')}
export interface DailyWordStore {
 /** Must atomically return existing date or create candidate, never overwrite a chosen date. */
 choose(candidate:DailyWordRecord):Promise<DailyWordRecord>;
}
/** Not activated by this module. Restart-safe only when store is durable and migration is accepted. */
export function createPersistentDailyResolver(store:DailyWordStore){
 const cache=new Map<string,Promise<DailyWordRecord>>();
 return async(date:string,words:readonly string[],sourceRevision:string)=>{
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!sourceRevision)throw new Error('Ungültiger Tagesstand.');
  if(!cache.has(date)){
   const pending=store.choose({date,word:getWorthaftWordOfTheDay(words,date),sourceRevision}).then(record=>{assertDailyWordRecord(record,date);return record}).catch(error=>{cache.delete(date);throw error});
   cache.set(date,pending);if(cache.size>3)cache.delete(cache.keys().next().value!);
  }
  return (await cache.get(date)!).word;
 };
}
/** Today's fixed answer must remain guessable even if removed or blocked for future days. */
export function preserveDailyAnswer<T extends {words:string[];antiWords:string[]}>(lists:T,word:string){const normalized=word.toLocaleLowerCase('de');return {...lists,words:lists.words.includes(normalized)?lists.words:[...lists.words,normalized],antiWords:lists.antiWords.filter(x=>x!==normalized),word}}
export function persistentDailyEnabled(){return process.env.WORTHAFT_DAILY_RELEASE==='persistent-v1-accepted'}

import type {Bucket} from '@google-cloud/storage';
import {SHORT_LINK_PREFIX,SHORT_LINK_CODE,isShortLink,type ShortLink,type ShortLinkRepository} from './short-links';
export function shortLinkRepository(bucket:Bucket):ShortLinkRepository {
  const fileFor=(code:string)=>{if(!SHORT_LINK_CODE.test(code))throw new Error('Ungültiger Kurzlink.');return bucket.file(SHORT_LINK_PREFIX+code+'.json')};
  const read=async(code:string):Promise<ShortLink|null>=>{
    const file=fileFor(code);
    try{
      const [meta]=await file.getMetadata();
      if(!meta.generation||!Number.isFinite(Number(meta.size))||Number(meta.size)>8192||meta.metadata?.firebaseStorageDownloadTokens)throw new Error('Ungültiger Kurzlink-Datensatz.');
      const fixed=bucket.file(file.name,{generation:meta.generation});
      const [entries]=await fixed.acl.get();const acl=Array.isArray(entries)?entries:[entries];
      if(!acl.length||acl.some(x=>x.entity==='allUsers'||x.entity==='allAuthenticatedUsers'))throw new Error('Öffentliche Speicherberechtigung erkannt.');
      const [bytes]=await fixed.download({validation:'crc32c'});
      if(bytes.length>8192)throw new Error('Ungültiger Kurzlink-Datensatz.');
      const record:unknown=JSON.parse(bytes.toString());
      if(!isShortLink(record,code))throw new Error('Ungültiger Kurzlink-Datensatz.');
      return {...record,revision:String(meta.generation)};
    }catch(error){if((error as {code?:number}).code===404)return null;throw error;}
  };
  const save=async(record:ShortLink,generation:string|number)=>{
    const {revision:unused,...data}=record;void unused;
    await fileFor(record.code).save(JSON.stringify(data),{resumable:false,predefinedAcl:'private',validation:'crc32c',preconditionOpts:{ifGenerationMatch:generation},metadata:{contentType:'application/json',cacheControl:'private, no-store, max-age=0'}});
  };
  return {
    async create(record){await save(record,0);await read(record.code)},get:read,
    async list(cursor){
      if(cursor&&cursor.length>4096)throw new Error('Ungültige Folgeseite.');
      const [files,next]=await bucket.getFiles({prefix:SHORT_LINK_PREFIX,maxResults:25,autoPaginate:false,pageToken:cursor});
      const records:ShortLink[]=[];
      for(const file of files){const match=file.name.slice(SHORT_LINK_PREFIX.length).match(/^([A-Za-z0-9_-]{16})\.json$/);if(match){const record=await read(match[1]);if(record)records.push(record)}}
      return {records,nextCursor:next?.pageToken};
    },
    async setActive(code,revision,active){const record=await read(code);if(!record||record.revision!==revision)throw new Error('Kurzlink wurde inzwischen geändert. Bitte neu laden.');await save({...record,active},revision)},
    async increment(record){if(!record.active||!record.revision||record.clicks>=Number.MAX_SAFE_INTEGER)return;await save({...record,clicks:record.clicks+1},record.revision)}
  };
}

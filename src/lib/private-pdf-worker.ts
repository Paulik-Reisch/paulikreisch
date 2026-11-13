import {createRequire} from 'node:module';
import {Worker} from 'node:worker_threads';
// Parsing is bounded independently from the HTTP worker. This is not a malware scanner.
let active=0;
const workerSource=String.raw`
const {parentPort,workerData}=require('node:worker_threads');
const {PDFDocument,PDFDict,PDFArray,PDFName,PDFRef}=require(workerData.modulePath);
(async()=>{
 const doc=await PDFDocument.load(workerData.bytes,{ignoreEncryption:false,throwOnInvalidObject:true,updateMetadata:false});
 if(doc.getPageCount()<1||doc.getPageCount()>200)throw Error('PDF muss 1 bis 200 Seiten haben.');
 const blocked=new Set(['JavaScript','JS','OpenAction','AA','Launch','EmbeddedFiles','EmbeddedFile','Filespec','FileAttachment','RichMedia','XFA','AcroForm','SubmitForm','ImportData','GoToR','URI','Movie','Sound','3D','AF']);
 const seen=new Set();let count=0;
 function inspect(object,depth=0){if(seen.has(object))return;if(depth>100||++count>100000)throw Error('PDF-Struktur zu komplex.');seen.add(object);
 if(object instanceof PDFRef){inspect(doc.context.lookup(object),depth+1);return}
 if(object instanceof PDFName){if(blocked.has(object.decodeText()))throw Error('PDF mit aktiven Inhalten, Formularen, Links oder eingebetteten Dateien ist nicht erlaubt.')}
 else if(object instanceof PDFDict){for(const [key,value]of object.entries()){inspect(key,depth+1);inspect(value,depth+1)}}
 else if(object instanceof PDFArray){for(const value of object.asArray())inspect(value,depth+1)}
 else if(object&&typeof object==='object'&&'dict'in object)inspect(object.dict,depth+1)
 }
 for(const [,object]of doc.context.enumerateIndirectObjects())inspect(object);
 const output=await doc.save({useObjectStreams:false,addDefaultPage:false});if(output.byteLength>10_000_000)throw Error('Das geprüfte PDF überschreitet 10 MB.');
 parentPort.postMessage({bytes:output});
})().catch(error=>parentPort.postMessage({error:error.message}));
`;
export async function verifyPdfInWorker(bytes:Uint8Array):Promise<Uint8Array>{
 if(active>=2)throw new Error('PDF-Prüfung ausgelastet. Bitte später erneut versuchen.');
 active++;
 try{return await new Promise((resolve,reject)=>{
  const worker=new Worker(workerSource,{eval:true,workerData:{bytes,modulePath:createRequire(process.cwd()+'/package.json').resolve('pdf-lib')},resourceLimits:{maxOldGenerationSizeMb:64,maxYoungGenerationSizeMb:16,stackSizeMb:4}});
  let settled=false;
  const finish=(error?:Error,value?:Uint8Array)=>{if(settled)return;settled=true;clearTimeout(timer);void worker.terminate();if(error)reject(error);else resolve(value!)};
  const timer=setTimeout(()=>finish(new Error('PDF-Prüfung hat das Zeitlimit überschritten.')),3000);
  worker.once('message',(message:{bytes?:Uint8Array;error?:string})=>{if(message.error)finish(new Error(message.error));else if(message.bytes instanceof Uint8Array)finish(undefined,message.bytes);else finish(new Error('PDF-Prüfung fehlgeschlagen.'))});
  worker.once('error',()=>finish(new Error('PDF-Prüfung überschreitet Ressourcen oder ist fehlgeschlagen.')));
  worker.once('exit',()=>finish(new Error('PDF-Prüfung unerwartet beendet.')));
 })}finally{active--}
}

import sharp from 'sharp';
import {verifyPdfInWorker} from './private-pdf-worker';
import {hasExpectedAssetSignature} from './private-asset-model';
import type {VerifiedAsset} from './private-asset-service';
const MAX_INPUT=5*1024*1024;
/** Re-encode decoded static raster images without metadata. Not a malware-scanner promise. */
export async function verifyPrivateAssetContent(bytes:Uint8Array,type:string,name:string):Promise<VerifiedAsset>{
 if(!bytes.byteLength||bytes.byteLength>MAX_INPUT)throw new Error('Maximal 5 MB erlaubt.');
 if(type==='text/plain'){
  let text:string;try{text=new TextDecoder('utf-8',{fatal:true}).decode(bytes)}catch{throw new Error('Textdateien müssen UTF-8 sein.')}
  if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text))throw new Error('Binäre Inhalte sind nicht als Textdatei erlaubt.');
  return {bytes,type,safeName:name};
 }
 if(type==='application/pdf'){
  if(!hasExpectedAssetSignature(type,bytes))throw new Error('Ungültige PDF-Datei.');
  const output=await verifyPdfInWorker(bytes);
  return {bytes:output,type,safeName:name};
 }
 if(!['image/png','image/jpeg','image/webp'].includes(type)||!hasExpectedAssetSignature(type,bytes))throw new Error('Dateiinhalt und Dateityp stimmen nicht überein.');
 const input=sharp(Buffer.from(bytes),{failOn:'warning',limitInputPixels:16_000_000,animated:true});
 const meta=await input.metadata();
 if(!meta.width||!meta.height||meta.width>8000||meta.height>8000||(meta.pages??1)!==1)throw new Error('Nur statische Bilder bis 16 Megapixel erlaubt.');
 const formats:Record<string,string>={'image/png':'png','image/jpeg':'jpeg','image/webp':'webp'};
 if(meta.format!==formats[type])throw new Error('Das erkannte Bildformat stimmt nicht überein.');
 const pipeline=input.rotate();
 const output=await (type==='image/png'?pipeline.png():type==='image/jpeg'?pipeline.jpeg({quality:90}):pipeline.webp({quality:90})).toBuffer();
 if(output.byteLength>MAX_INPUT)throw new Error('Das bereinigte Bild überschreitet 5 MB.');
 return {bytes:output,type,safeName:name.normalize('NFC').replace(/[\u0000-\u001f\u007f"<>]/g,'_')};
}

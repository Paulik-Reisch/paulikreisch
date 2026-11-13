export type AssetStatus = 'private' | 'published';
export type PrivateAsset = { id:string; name:string; size:number; type:string; status:AssetStatus; revision:string; publicUrl?:string };
export type UploadPolicy = { maxBytes:number; types:readonly string[] };
/** This is a local proposal, not a verified production quota or enabled upload policy. */
export const PROPOSED_UPLOAD_POLICY: UploadPolicy = { maxBytes:5*1024*1024, types:['image/png','image/jpeg','image/webp','image/gif','application/pdf','text/plain'] };
export function validateAssetCandidate(file:{name:string;size:number;type:string}, policy:UploadPolicy):string|null {
 if(!file.name || file.name.length>180 || /[\/\\\u0000-\u001f]/.test(file.name))return 'Der Dateiname ist ungültig. Bitte ohne Ordnerpfade hochladen.';
 if(!Number.isSafeInteger(file.size)||file.size<1||file.size>policy.maxBytes)return `Die Datei muss zwischen 1 Byte und ${Math.floor(policy.maxBytes/1024/1024)} MB groß sein.`;
 if(!policy.types.includes(file.type))return 'Dieser Dateityp ist nicht freigegeben. Vorgesehen sind PNG, JPEG, WebP, GIF, PDF und UTF-8-Text.';
 const extension=file.name.toLowerCase().split('.').at(-1);
 const mapping:Record<string,string[]>={'image/png':['png'],'image/jpeg':['jpg','jpeg'],'image/webp':['webp'],'image/gif':['gif'],'application/pdf':['pdf'],'text/plain':['txt']};
 if(!mapping[file.type]?.includes(extension??''))return 'Dateiendung und angegebener Dateityp stimmen nicht überein.';
 return null;
}
/** A header check is only a first validation step, not malware scanning or safe image decoding. */
export function hasExpectedAssetSignature(type:string,bytes:Uint8Array):boolean {
 const prefix=(value:number[])=>value.every((x,i)=>bytes[i]===x);
 if(type==='text/plain')return true;
 if(type==='image/gif')return prefix([71,73,70,56,55,97])||prefix([71,73,70,56,57,97]);
 if(type==='image/png')return prefix([137,80,78,71,13,10,26,10]);
 if(type==='image/jpeg')return prefix([255,216,255]);
 if(type==='application/pdf')return prefix([37,80,68,70,45]);
 if(type==='image/webp')return prefix([82,73,70,70])&&[87,69,66,80].every((x,i)=>bytes[i+8]===x);
 return false;
}
export function planAssetPublication(asset:PrivateAsset, expected:string, action:'publish'|'withdraw', confirmed:boolean) {
 if(asset.revision!==expected)throw new Error('Die Datei wurde inzwischen geändert. Bitte neu laden.');
 if(!confirmed)throw new Error('Bitte die Freigabe ausdrücklich bestätigen.');
 if(action==='publish' && asset.status!=='private')throw new Error('Die Datei ist bereits veröffentlicht.');
 if(action==='withdraw' && asset.status!=='published')throw new Error('Die Datei ist nicht veröffentlicht.');
 return {id:asset.id,status:action==='publish'?'published' as const:'private' as const};
}

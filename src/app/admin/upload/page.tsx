import {notFound,redirect} from 'next/navigation';
import {PrivateFileLibrary} from '@/components/files/private-library';
import {currentPrivateAssetAdmin,privateAssets,privateAssetsEnabled,PRIVATE_FILE_POLICY} from '@/lib/private-asset-runtime';
import {uploadPrivateAsset,publishPrivateAsset,withdrawPrivateAsset,listPrivateAssets} from './actions';
export const dynamic='force-dynamic';
export default async function UploadPage(){if(!privateAssetsEnabled())notFound();const actor=await currentPrivateAssetAdmin();if(!actor)redirect('/login');const {records,nextCursor}=await privateAssets().list(actor);const initial=records.map(({id,name,type,size,status,revision})=>({id,name,type,size,status,revision,publicUrl:status==='published'?`https://static.paulikreisch.de/f/${id}`:undefined}));return <><PrivateFileLibrary initial={initial} nextCursor={nextCursor} loadMore={listPrivateAssets} policy={PRIVATE_FILE_POLICY} upload={uploadPrivateAsset} publish={publishPrivateAsset} withdraw={withdrawPrivateAsset}/></>}

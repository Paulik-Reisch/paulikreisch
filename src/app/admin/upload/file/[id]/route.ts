import {currentPrivateAssetAdmin,privateAssets,privateAssetsEnabled} from '@/lib/private-asset-runtime';
import {privateAssetResponse} from '@/lib/private-asset-gateway';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){if(!privateAssetsEnabled())return new Response('Nicht gefunden.',{status:404});const actor=await currentPrivateAssetAdmin();if(!actor)return new Response('Nicht gefunden.',{status:404,headers:{'Cache-Control':'private, no-store'}});return privateAssetResponse(privateAssets(),actor,(await params).id)}

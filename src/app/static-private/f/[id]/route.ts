import type {NextRequest} from 'next/server';
import {STATIC_HOST} from '@/lib/management-hosts';
import {requestHost} from '@/lib/admin-host-policy';
import {privateAssets,privateAssetsEnabled} from '@/lib/private-asset-runtime';
import {privateAssetResponse} from '@/lib/private-asset-gateway';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:NextRequest,{params}:{params:Promise<{id:string}>}){if(requestHost(request.headers)!==STATIC_HOST||!privateAssetsEnabled())return new Response('Nicht gefunden.',{status:404,headers:{'Cache-Control':'private, no-store'}});return privateAssetResponse(privateAssets(),null,(await params).id)}

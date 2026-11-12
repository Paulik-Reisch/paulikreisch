import 'server-only';
import {getAdminAuth,getAdminStorage} from './firebase-admin';
import {getSession} from './session';
import {PrivateAssetService,type Actor,requireAssetAdmin} from './private-asset-service';
import {assetRepository,privateObjectStore} from './private-asset-adapters';
import {verifyPrivateAssetContent} from './private-asset-content';
export const PRIVATE_FILE_POLICY={maxBytes:5*1024*1024,types:['image/png','image/jpeg','image/webp','application/pdf','text/plain']} as const;
/** Deployment gate, not a readiness detector. Must stay unset until prefix rules/IAM/cost/release accepted. */
export function privateAssetsEnabled(){return process.env.PRIVATE_ASSET_RELEASE==='private-prefix-v1-accepted'}
export function privateAssets(){if(!privateAssetsEnabled())throw new Error('Dateiverwaltung ist noch nicht aktiviert.');const bucket=getAdminStorage().bucket('hallo-welt-paulik-reisch.firebasestorage.app');return new PrivateAssetService(assetRepository(bucket),privateObjectStore(bucket),PRIVATE_FILE_POLICY,verifyPrivateAssetContent)}
export async function currentPrivateAssetAdmin():Promise<Actor>{const session=await getSession();if(!session)return null;const user=await getAdminAuth().getUserByEmail(session.user.id);const actor={email:user.email??'',verified:user.emailVerified&&!user.disabled};requireAssetAdmin(actor);return actor}

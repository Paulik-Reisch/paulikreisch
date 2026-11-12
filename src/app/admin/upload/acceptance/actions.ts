'use server';
import {assertAdminMutationOrigin} from '@/lib/admin-request';
import {currentPrivateAssetAdmin,privateAssetsEnabled} from '@/lib/private-asset-runtime';
import {getAdminStorage} from '@/lib/firebase-admin';
import {acceptanceCleanup,acceptanceWindowOpen,type CleanupPlan} from '@/lib/private-asset-cleanup';
function cleanup(){if(!privateAssetsEnabled()||!acceptanceWindowOpen(process.env.PRIVATE_ASSET_ACCEPTANCE_NONCE??'',process.env.PRIVATE_ASSET_ACCEPTANCE_EXPIRES??''))throw Error('Dateien nicht aktiviert.');return acceptanceCleanup(getAdminStorage().bucket('hallo-welt-paulik-reisch.firebasestorage.app'),process.env.PRIVATE_ASSET_ACCEPTANCE_NONCE??'',process.env.SESSION_SECRET??'')}
export async function prepareCleanup(id:string){await assertAdminMutationOrigin();return cleanup().prepare(await currentPrivateAssetAdmin(),id)}
export async function commitCleanup(plan:CleanupPlan,signature:string,confirmed:boolean){await assertAdminMutationOrigin();return cleanup().commit(await currentPrivateAssetAdmin(),plan,signature,confirmed)}

import {notFound} from 'next/navigation';
import {currentPrivateAssetAdmin,privateAssetsEnabled} from '@/lib/private-asset-runtime';
import {requireAssetAdmin} from '@/lib/private-asset-service';
import {acceptanceWindowOpen} from '@/lib/private-asset-cleanup';
import {CleanupClient} from './cleanup-client';
export default async function Page(){if(!privateAssetsEnabled()||!acceptanceWindowOpen(process.env.PRIVATE_ASSET_ACCEPTANCE_NONCE??'',process.env.PRIVATE_ASSET_ACCEPTANCE_EXPIRES??''))notFound();requireAssetAdmin(await currentPrivateAssetAdmin());return <main className="admin-main mx-auto max-w-2xl space-y-5 p-5"><h1 className="text-2xl font-bold">Abnahmedateien bereinigen</h1><p>Nur eigene, zuvor zurückgezogene Testdateien mit dem Namen acceptance-{process.env.PRIVATE_ASSET_ACCEPTANCE_NONCE}.png, .pdf oder .txt, wahlweise mit dem exakten Vorsatz 1-. Keine normalen Dateien und keine ganzen Ordner.</p><CleanupClient/></main>}

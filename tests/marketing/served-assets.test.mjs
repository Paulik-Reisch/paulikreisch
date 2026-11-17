import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {assets} from '../../src/marketing/generated-assets.mjs';
test('served studio assets equal reviewed source and cannot retain the native probe prompt',async()=>{
 for(const [file,key] of [['studio.html','/'],['studio.css','/assets/studio.css'],['studio.js','/assets/studio.js']]){
  assert.equal(assets[key].body,await fs.readFile(new URL('../../tools/marketing/public/'+file,import.meta.url),'utf8'),'Regenerate studio assets after source changes: '+file);
 }
 assert.match(assets['/assets/studio.js'].body,/Einzelne Testmail senden/);
});

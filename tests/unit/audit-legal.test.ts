import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
test('concrete legal corrections remove obsolete URL and wrong digital paragraphs',()=>{
 const imprint=readFileSync('src/app/impressum/page.tsx','utf8');const withdrawal=readFileSync('src/app/widerruf/page.tsx','utf8');
 assert.doesNotMatch(imprint,/ec.europa.eu\/consumers\/odr|stellt eine Plattform/);
 assert.match(imprint,/Wir sind nicht verpflichtet und nicht bereit/);
 assert.match(withdrawal,/§ 356 Abs. 6 Nr. 2 BGB/);assert.match(withdrawal,/§ 312f BGB/);
 assert.match(withdrawal,/§ 357 Abs. 5 BGB/);assert.match(withdrawal,/Erhalt der Ware/);
 assert.doesNotMatch(withdrawal,/§ 356 Abs. 3 Nr. 3|§ 357 Abs. 6|Amazon Media EU|Google Commerce Limited/);
});

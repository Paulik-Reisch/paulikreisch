import test from 'node:test';
import assert from 'node:assert/strict';
import {loginFailureMessage} from '../../src/lib/login-errors';
test('website/referrer and unknown failures never blame the password',()=>{for(const code of ['auth/unauthorized-domain','auth/app-not-authorized','auth/requests-from-referer-https://static.example/-are-blocked.','auth/internal-error','unknown']){const message=loginFailureMessage({code});assert.doesNotMatch(message,/Passwort nicht erkannt/);assert.match(message,/Website|nicht abgeschlossen/)} });
test('known invalid credential, network, and rate errors have distinct messages',()=>{assert.match(loginFailureMessage({code:'auth/invalid-credential'}),/nicht erkannt/);assert.match(loginFailureMessage({code:'auth/network-request-failed'}),/nicht erreichbar/);assert.match(loginFailureMessage({code:'auth/too-many-requests'}),/Zu viele/)});

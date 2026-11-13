export function loginFailureMessage(error:unknown):string{
 const code=typeof error==='object'&&error!==null&&'code' in error?String(error.code):'';
 if(['auth/invalid-credential','auth/wrong-password','auth/user-not-found','auth/invalid-email'].includes(code))return 'E-Mail-Adresse oder Passwort nicht erkannt. Bitte Eingabe prüfen.';
 if(code==='auth/too-many-requests')return 'Zu viele Anmeldeversuche. Bitte etwas warten und später erneut versuchen.';
 if(code==='auth/network-request-failed')return 'Der Anmeldedienst ist gerade nicht erreichbar. Bitte Verbindung prüfen und erneut versuchen.';
 if(['auth/app-not-authorized','auth/unauthorized-domain','auth/invalid-api-key','auth/api-key-not-valid.-please-pass-a-valid-api-key.'].includes(code)||code.startsWith('auth/requests-from-referer-'))return 'Die Anmeldung ist für diese Website nicht freigegeben. Bitte die Verwaltung informieren; ein Passwortwechsel behebt das nicht.';
 return 'Die Anmeldung konnte nicht abgeschlossen werden. Bitte später erneut versuchen oder die Verwaltung informieren. Das Passwort ist damit nicht als falsch bestätigt.';
}

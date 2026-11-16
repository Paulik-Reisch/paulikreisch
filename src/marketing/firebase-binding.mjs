import {createMarketingHandler} from './http.mjs';
import {MarketingService} from './service.mjs';
import {MarketingAuth} from './auth.mjs';
import {PrivateBucketStorage,bucketLoginLimiter} from './private-bucket.mjs';
import {assets} from './generated-assets.mjs';
/** Firebase binding without new credentials. Existing project ADC, Auth
 * allowlist, public web API key and SESSION_SECRET are supplied by the host.
 * Dormant until explicitly wired into a deployment approved for this feature.
 */
export function createFirebaseMarketing({bucket,firebaseAuth,apiKey,secret,allowedEmail,files,links,fetcher=fetch}) {
  const auth=new MarketingAuth({secret,allowedEmail,limit:bucketLoginLimiter(bucket,secret),currentUser:email=>firebaseAuth.getUserByEmail(email),verifyPassword:async(email,password,host)=>{
    const response=await fetcher('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+encodeURIComponent(apiKey),{method:'POST',headers:{'content-type':'application/json','Referer':'https://'+host+'/'},body:JSON.stringify({email,password,returnSecureToken:true}),signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw Error('Sign in failed.');
    const data=await response.json();if(typeof data.idToken!=='string')throw Error('Missing token.');
    const decoded=await firebaseAuth.verifyIdToken(data.idToken,true);
    if(decoded.email?.toLowerCase()!==email||decoded.email_verified!==true||typeof decoded.auth_time!=='number'||Math.abs(Date.now()/1000-decoded.auth_time)>300)throw Error('Invalid identity.');
    return firebaseAuth.getUserByEmail(email);
  }});
  return createMarketingHandler({service:new MarketingService(new PrivateBucketStorage(bucket,secret)),auth,assets,files,links});
}

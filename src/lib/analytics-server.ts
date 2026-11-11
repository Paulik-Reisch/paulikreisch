import 'server-only';
import { analyticsInput } from './analytics-input';
import { firebaseConfig } from '@/firebase/config';

/** Use App Hosting's existing runtime identity; never create a browser Auth user. */
export async function writeAnalyticsEvent(type: string, userId: string, path: string, params: object = {}): Promise<void> {
  const event = analyticsInput(type, userId, path, params);
  if (!event) throw new Error('Invalid analytics event');
  // Cloud Run's local metadata endpoint uses HTTP by design, not a public network request.
  // https://docs.cloud.google.com/run/docs/authenticating/service-to-service#use_the_metadata_server
  // nosemgrep: typescript.react.security.react-insecure-request.react-insecure-request
  const credential = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {
    headers: { 'Metadata-Flavor': 'Google' }, cache: 'no-store', signal: AbortSignal.timeout(5000),
  });
  if (!credential.ok) throw new Error('Analytics runtime identity unavailable');
  const token = await credential.json() as { access_token?: string };
  if (!token.access_token) throw new Error('Analytics runtime identity unavailable');
  const paramFields = Object.fromEntries(Object.entries(event.params).map(([key,value]) => [key,typeof value === 'number' ? {doubleValue:value} : {stringValue:value}]));
  const response = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/analytics_events`, {
    method: 'POST', headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({fields:{type:{stringValue:event.type},path:{stringValue:event.path},userId:{stringValue:event.userId},params:{mapValue:{fields:paramFields}},timestamp:{timestampValue:new Date().toISOString()}}}),
    cache: 'no-store', signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Analytics storage failed (${response.status})`);
}

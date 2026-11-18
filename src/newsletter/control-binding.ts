import 'server-only';
import type {Bucket} from '@google-cloud/storage';

const DIR = 'managed-private-v1/newsletter-control/';
/** Approval and send-claim records in the already protected private bucket
 * namespace. create() is create-only; update() needs the generation that was read. */
export function createBucketControl(bucket: Bucket) {
  const file = (key: string) => bucket.file(DIR + key + '.json');
  const code = (error: unknown) => (error as {code?: number}).code;
  return {
    async read(key: string) {
      try {
        const f = file(key);
        const [meta] = await f.getMetadata();
        const [bytes] = await bucket.file(DIR + key + '.json', {generation: meta.generation}).download({validation: 'crc32c'});
        return {...JSON.parse(bytes.toString('utf8')), generation: String(meta.generation)};
      } catch (error) {
        if (code(error) === 404) return null;
        throw error;
      }
    },
    async create(key: string, data: unknown) {
      try {
        await file(key).save(JSON.stringify(data), {resumable: false, predefinedAcl: 'private', validation: 'crc32c', preconditionOpts: {ifGenerationMatch: 0}, metadata: {contentType: 'application/json', cacheControl: 'private, no-store'}});
        return true;
      } catch (error) {
        if (code(error) === 412) return false;
        throw error;
      }
    },
    async update(key: string, data: unknown, generation: string) {
      try {
        await file(key).save(JSON.stringify(data), {resumable: false, predefinedAcl: 'private', validation: 'crc32c', preconditionOpts: {ifGenerationMatch: Number(generation)}, metadata: {contentType: 'application/json', cacheControl: 'private, no-store'}});
        return true;
      } catch (error) {
        if (code(error) === 412 || code(error) === 404) return false;
        throw error;
      }
    },
  };
}

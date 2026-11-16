// Server-only recipient store on Firestore via the Admin SDK (ignores client rules).
// One document holds all records so change(fn) is a single atomic transaction.
// Capacity: 1 MiB per document is far above the free Resend plan (1,000 contacts).
// The collection must NOT be publicly readable: see docs/newsletter-resend.md
// (the live Firestore rules currently allow public reads on every collection).
export const RECIPIENTS_COLLECTION='newsletter_private';
export const RECIPIENTS_DOC='recipients-v1';
const MAX_RECORDS=5000;
export class FirestoreSubscriberStore {
  constructor(db,{collection=RECIPIENTS_COLLECTION,doc=RECIPIENTS_DOC}={}){if(!db)throw Error('Firestore handle required.');this.db=db;this.ref=db.collection(collection).doc(doc);}
  async read(){const s=await this.ref.get();return s.exists?structuredClone(s.data().records??[]):[];}
  async change(fn){
    return this.db.runTransaction(async tx=>{
      const s=await tx.get(this.ref);
      const records=s.exists?structuredClone(s.data().records??[]):[];
      const value=fn(records);
      if(records.length>MAX_RECORDS)throw Error('Recipient store is full.');
      tx.set(this.ref,{records,updatedAt:new Date().toISOString(),schema:1});
      return structuredClone(value);
    });
  }
}

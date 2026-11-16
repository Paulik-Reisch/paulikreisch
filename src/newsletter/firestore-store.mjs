// Server-only recipient store on Firestore via the Admin SDK (ignores client rules).
// One document per recipient (id = keyed hash, see recipientId), so writes for
// different people never contend and there is no document size ceiling for the
// list. The collection must NOT be publicly readable: the live Firestore rules
// currently allow public reads on every collection, so server.ts fails closed
// until NEWSLETTER_STORE_ENABLED is set after the rules were fixed.
export const RECIPIENTS_COLLECTION='newsletter_recipients';
export class FirestoreSubscriberStore {
  constructor(db,{collection=RECIPIENTS_COLLECTION}={}){if(!db)throw Error('Firestore handle required.');this.db=db;this.col=db.collection(collection);}
  async list(){const s=await this.col.get();return s.docs.map(d=>structuredClone(d.data()));}
  async update(id,fn){
    const ref=this.col.doc(id);
    return this.db.runTransaction(async tx=>{
      const s=await tx.get(ref);
      const {value,record}=fn(s.exists?structuredClone(s.data()):null);
      if(record)tx.set(ref,record);
      return structuredClone(value);
    });
  }
}

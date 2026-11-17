// Server-only recipient store on Firestore via the Admin SDK (ignores client rules).
// One document per recipient (id = keyed hash, see recipientId), so writes for
// different people never contend and there is no document size ceiling for the
// list. The collection must not be publicly readable. Public registration and
// ordinary writes remain gated in server.ts. Actual access rules are checked
// separately; this comment is not evidence of their current deployed state.
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

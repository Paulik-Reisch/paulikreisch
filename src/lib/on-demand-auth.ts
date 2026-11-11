/** Deduplicate explicit sign-in requests. This function never signs in on its own. */
export function createOnDemandSignIn<A extends object, U>(
  ready: (auth: A) => Promise<void>,
  currentUser: (auth: A) => U | null,
  signIn: (auth: A) => Promise<U>,
  validateExisting: (auth: A, user: U) => Promise<U | null> = async (_auth, user) => user,
) {
  const pending = new WeakMap<A, Promise<U>>();
  return async (auth: A): Promise<U> => {
    const inFlight = pending.get(auth);
    if (inFlight) return inFlight;
    const request = (async () => {
      await ready(auth);
      const existing = currentUser(auth);
      if (existing) {
        const valid = await validateExisting(auth, existing);
        if (valid) return valid;
      }
      return signIn(auth);
    })();
    pending.set(auth, request);
    try {
      return await request;
    } finally {
      if (pending.get(auth) === request) pending.delete(auth);
    }
  };
}

import { createOnDemandSignIn } from './on-demand-auth';
import { asWorthaftDiagnosticError, type WorthaftDiagnostic } from './worthaft-submission-diagnostics';

type Dependencies<A, U> = {
  ready: (auth: A) => Promise<void>;
  currentUser: (auth: A) => U | null;
  signIn: (auth: A) => Promise<U>;
  isAnonymous: (user: U) => boolean;
  sameUser: (a: U, b: U) => boolean;
  refresh: (user: U) => Promise<unknown>;
  signOut: (auth: A) => Promise<void>;
};

/** Same recovery policy as before. Only the locally shown diagnostic is new. */
export function createDiagnosedWorthaftAuth<A extends object, U>(dependencies: Dependencies<A, U>) {
  const recovery = new WeakMap<A, readonly WorthaftDiagnostic[]>();
  return createOnDemandSignIn<A, U>(
    async auth => {
      recovery.delete(auth);
      try { await dependencies.ready(auth); }
      catch (error) { throw asWorthaftDiagnosticError(error, 'restore'); }
    },
    dependencies.currentUser,
    async auth => {
      try { return await dependencies.signIn(auth); }
      catch (error) { throw asWorthaftDiagnosticError(error, 'signin', recovery.get(auth)); }
      finally { recovery.delete(auth); }
    },
    async (auth, user) => {
      if (!dependencies.isAnonymous(user)) return user;
      try {
        await dependencies.refresh(user);
        return dependencies.currentUser(auth);
      } catch (error) {
        const diagnostic = asWorthaftDiagnosticError(error, 'refresh');
        if (![
          'auth/user-token-expired', 'auth/user-not-found', 'auth/invalid-user-token',
          'auth/network-request-failed', 'auth/internal-error',
        ].includes(diagnostic.code ?? '')) throw diagnostic;
        const currentUser = dependencies.currentUser(auth);
        if (currentUser && dependencies.sameUser(currentUser, user)) {
          try { await dependencies.signOut(auth); }
          catch (signOutError) { throw asWorthaftDiagnosticError(signOutError, 'signout', diagnostic.diagnostics); }
        }
        recovery.set(auth, diagnostic.diagnostics);
        return dependencies.currentUser(auth);
      }
    },
  );
}

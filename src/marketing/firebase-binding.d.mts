export function createFirebaseMarketing(options: {
  bucket: unknown;
  firebaseAuth: unknown;
  apiKey: string;
  secret: string;
  allowedEmail: (email: string | null | undefined) => boolean;
}): (request: Request) => Promise<Response>;

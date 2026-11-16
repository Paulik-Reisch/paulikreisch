export function createFirebaseMarketing(options: {
  bucket: unknown;
  firebaseAuth: unknown;
  apiKey: string;
  secret: string;
  allowedEmail: (email: string | null | undefined) => boolean;
  files?: unknown;
  links?: unknown; newsletter?: unknown; transportTest?: unknown;
}): (request: Request) => Promise<Response>;

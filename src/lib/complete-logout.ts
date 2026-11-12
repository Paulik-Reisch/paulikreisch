export async function completeLogout(signOutClient: () => Promise<void>, revokeServerSession: () => Promise<void>): Promise<void> {
  // Do not report logout or leave the page while either credential is live.
  await signOutClient();
  await revokeServerSession();
}

import { FirebaseClientProvider } from "@/firebase/client-provider";

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
        {children}
    </FirebaseClientProvider>
  );
}

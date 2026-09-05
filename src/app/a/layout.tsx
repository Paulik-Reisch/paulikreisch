import { ExitPopup } from '@/components/funnel/exit-popup';

export default function ALayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ExitPopup />
    </>
  );
}

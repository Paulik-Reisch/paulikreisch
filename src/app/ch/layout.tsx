
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '你好世界 | 保利克與賴施',
  description: '保利克與賴施的官方作品。一部關於學校、官僚主義與日常瘋狂的諷刺小說。',
};

export default function ChLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}

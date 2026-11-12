import type { Metadata } from 'next';
import { GptChat } from '@/components/gpt/gpt-chat';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Schreibstube – experimenteller Schreibassistent',
  description: 'Eine experimentelle, satirische Schreib-KI von Paulik & Reisch.',
  path: '/gpt',
});

export default function GptPage() {
  return <GptChat />;
}

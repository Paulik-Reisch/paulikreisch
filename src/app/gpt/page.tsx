import type { Metadata } from 'next';
import { GptChat } from '@/components/gpt/gpt-chat';

export const metadata: Metadata = {
  title: 'Schreibstube – experimenteller Schreibassistent',
  description: 'Eine experimentelle, satirische Schreib-KI von Paulik & Reisch.',
  alternates: { canonical: '/gpt' },
};

export default function GptPage() {
  return <GptChat />;
}
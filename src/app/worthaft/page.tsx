import { after } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { maybeCleanupOldDailyWords } from '@/lib/worthaft-daily-cleanup';
import { getWorthaftDailyData } from '@/lib/worthaft-daily-data';
import { getWorthaftDateString } from '@/lib/worthaft-daily-word';
import WorthaftGame from './game';

export const dynamic = 'force-dynamic';

export default async function WorthaftPage() {
  const date = getWorthaftDateString();
  const dailyData = await getWorthaftDailyData(date);
  // Opt-in only, after a successful daily answer and outside response latency.
  if (process.env.WORTHAFT_DAILY_CLEANUP_RELEASE === 'calendar-two-days-accepted') {
    after(async () => { await maybeCleanupOldDailyWords(getAdminDb(), date); });
  }

  return (
    <WorthaftGame
      key={date}
      dailyDate={date}
      dailyWord={dailyData.word}
      words={dailyData.words}
      antiWords={dailyData.antiWords}
      usedBundledFallback={dailyData.usedBundledFallback}
    />
  );
}

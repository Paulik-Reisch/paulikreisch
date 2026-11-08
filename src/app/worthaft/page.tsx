import { getWorthaftDailyData } from '@/lib/worthaft-daily-data';
import { getWorthaftDateString } from '@/lib/worthaft-daily-word';
import WorthaftGame from './game';

export const dynamic = 'force-dynamic';

export default async function WorthaftPage() {
  const date = getWorthaftDateString();
  const dailyData = await getWorthaftDailyData(date);

  return (
    <WorthaftGame
      dailyDate={date}
      dailyWord={dailyData.word}
      words={dailyData.words}
      antiWords={dailyData.antiWords}
      usedBundledFallback={dailyData.usedBundledFallback}
    />
  );
}

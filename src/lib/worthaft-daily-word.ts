const WORTHAFT_TIME_ZONE = 'Europe/Berlin';
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const BERLIN_DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: WORTHAFT_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

function getBerlinDateParts(date: Date) {
  const parts = new Map(BERLIN_DATE_FORMATTER.formatToParts(date).map(({ type, value }) => [type, value]));
  const year = parts.get('year');
  const month = parts.get('month');
  const day = parts.get('day');
  const hour = parts.get('hour');
  const minute = parts.get('minute');
  const second = parts.get('second');

  if (!year || !month || !day || !hour || !minute || !second) {
    throw new Error('Could not determine the Worthaft date in Europe/Berlin.');
  }

  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
  };
}

export function getWorthaftDateString(date = new Date()): string {
  const { year, month, day } = getBerlinDateParts(date);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getWorthaftMillisecondsUntilNextDay(now = new Date()): number {
  const { year, month, day } = getBerlinDateParts(now);
  const nextMidnightUtc = Date.UTC(year, month - 1, day + 1);
  const berlinAtUtcMidnight = getBerlinDateParts(new Date(nextMidnightUtc));
  const berlinOffset = Date.UTC(
    berlinAtUtcMidnight.year,
    berlinAtUtcMidnight.month - 1,
    berlinAtUtcMidnight.day,
    berlinAtUtcMidnight.hour,
    berlinAtUtcMidnight.minute,
    berlinAtUtcMidnight.second,
  ) - nextMidnightUtc;

  return nextMidnightUtc - berlinOffset - now.getTime();
}

export function getWorthaftWordOfTheDay(words: readonly string[], date: string): string {
  if (words.length === 0) {
    throw new Error('The Worthaft word list must not be empty.');
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) {
    throw new Error(`Invalid Worthaft date: ${date}`);
  }

  const [, year, month, day] = match;
  const daysSinceStart = Math.floor(
    (Date.UTC(Number(year), Number(month) - 1, Number(day)) - Date.UTC(2024, 0, 1)) /
      DAY_IN_MILLISECONDS,
  );
  const wordIndex = ((daysSinceStart % words.length) + words.length) % words.length;

  return words[wordIndex].toUpperCase();
}

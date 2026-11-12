const formatter = new Intl.DateTimeFormat('en-CA', { timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23' });
export function berlinWallClock(date: Date): Date {
  const p = Object.fromEntries(formatter.formatToParts(date).map(x => [x.type,x.value]));
  return new Date(Number(p.year),Number(p.month)-1,Number(p.day),Number(p.hour),Number(p.minute),Number(p.second));
}
export function analyticsWindowStart(now: Date): Date {
  const p = Object.fromEntries(formatter.formatToParts(now).map(x => [x.type,x.value]));
  const month = new Date(Date.UTC(Number(p.year),Number(p.month)-1-5,1));
  const target = month.getTime();
  let instant = target;
  for (let i=0;i<3;i++) {
    const local = Object.fromEntries(formatter.formatToParts(new Date(instant)).map(x => [x.type,x.value]));
    const represented = Date.UTC(Number(local.year),Number(local.month)-1,Number(local.day),Number(local.hour),Number(local.minute),Number(local.second));
    instant += target - represented;
  }
  return new Date(instant);
}
export const ANALYTICS_EVENT_LIMIT = 5000;
export function assertAnalyticsReadSize(count: number): void {
  if (count > ANALYTICS_EVENT_LIMIT) throw new Error('Der Zeitraum enthält mehr als 5.000 Ereignisse. Die Auswertung wurde begrenzt und wird nicht als vollständig angezeigt.');
}

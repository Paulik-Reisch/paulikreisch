import { redirect } from 'next/navigation';
import { ANALYTICS_ORIGIN } from '@/lib/management-hosts';

export default function AnalyticsPage() {
  redirect(ANALYTICS_ORIGIN + '/');
}


import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, Database, FileText, HardDrive, LineChart, Newspaper, Sparkles, VenetianMask } from "lucide-react";
import { getNewsletters, getLegalPages, getPalabrotas, getChistes, getExcerpts, getCollectionData, listFiles } from "@/lib/firestore";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function StatCard({ title, icon: Icon, valuePromise, link, linkText }: { title: string, icon: React.ElementType, valuePromise: Promise<number>, link: string, linkText: string }) {
    const value = await valuePromise;
    return (
        <Card className="gcp-card">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="action-bar !mt-2 !pt-2">
                    <Link href={link}>
                        <span className="gcp-link text-sm">{linkText}</span>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

function StatCardSkeleton() {
    return (
        <Card className="gcp-card">
            <CardHeader>
                <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-12 mb-2" />
                <div className="action-bar !mt-2 !pt-2">
                    <Skeleton className="h-5 w-20" />
                </div>
            </CardContent>
        </Card>
    );
}

export default async function AdminDashboardPage() {
  return (
    <div className="space-y-6">
        <div className="page-tabs">
            <div className="tab active">Dashboard</div>
            <div className="tab">Activity</div>
            <div className="tab">Recommendations</div>
        </div>
        
        <div className="alert-banner">
            <span><b>Maintenance Scheduled:</b> IMCORE DB-Node-04 will undergo maintenance on Sunday at 03:00 UTC.</span>
        </div>

        <div className="dashboard-grid">
            <Suspense fallback={<StatCardSkeleton />}><StatCard title="Newsletter" icon={Newspaper} valuePromise={getNewsletters().then(d => d.length)} link="/admin/marketing" linkText="Manage Newsletters" /></Suspense>
            <Suspense fallback={<StatCardSkeleton />}><StatCard title="Dynamische LPs" icon={FileText} valuePromise={getLegalPages().then(d => d.length)} link="/admin/lp" linkText="Manage Pages" /></Suspense>
            <Suspense fallback={<StatCardSkeleton />}><StatCard title="Exzerpte" icon={Sparkles} valuePromise={getExcerpts().then(d => d.length)} link="/admin/excerpts" linkText="Manage Excerpts" /></Suspense>
            <Suspense fallback={<StatCardSkeleton />}><StatCard title="Palabrotas" icon={VenetianMask} valuePromise={getPalabrotas().then(d => d.length)} link="/admin/palabrotas" linkText="Manage Words" /></Suspense>
            <Suspense fallback={<StatCardSkeleton />}><StatCard title="Storage Files" icon={HardDrive} valuePromise={listFiles('/').then(d => d.length)} link="/admin/storage" linkText="Manage Storage" /></Suspense>
             <Suspense fallback={<StatCardSkeleton />}><StatCard title="Logs" icon={Activity} valuePromise={getCollectionData('logs').then(d => d.length)} link="/admin/logs" linkText="View Logs" /></Suspense>
        </div>
    </div>
  );
}

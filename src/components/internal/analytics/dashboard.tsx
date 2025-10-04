

"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart, Users, BarChart, Map, Link as LinkIcon, ExternalLink, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, XAxis, YAxis, CartesianGrid, Bar } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
        date: date.toISOString().split('T')[0],
        visitors: Math.floor(Math.random() * (500 - 150 + 1)) + 150,
        pageviews: Math.floor(Math.random() * (2000 - 800 + 1)) + 800,
    };
});

const topPages = [
    { path: "/", views: "12,402", change: "+15.2%" },
    { path: "/buchhandlung-paulik-reisch", views: "9,871", change: "+8.1%" },
    { path: "/lp-pfeifer", views: "7,123", change: "+22.4%" },
    { path: "/lp-satire-typ-test", views: "5,432", change: "-2.3%" },
    { path: "/exzerpte", views: "3,109", change: "+5.9%" },
];

const topRegions = [
    { country: "Deutschland", flag: "🇩🇪", users: "28,456", percentage: 75 },
    { country: "Österreich", flag: "🇦🇹", users: "3,789", percentage: 10 },
    { country: "Schweiz", flag: "🇨🇭", users: "2,273", percentage: 6 },
    { country: "USA", flag: "🇺🇸", users: "1,136", percentage: 3 },
    { country: "Niederlande", flag: "🇳🇱", users: "758", percentage: 2 },
];


const chartConfig = {
  visitors: { label: "Besucher", color: "hsl(var(--primary))" },
  pageviews: { label: "Seitenaufrufe", color: "#82ca9d" },
};

function StatCard({ title, value, change, icon: Icon }: { title: string; value: string; change: string; icon: React.ElementType }) {
    const isPositive = change.startsWith('+');
    return (
        <Card className="gcp-card">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-destructive'}`}>{change} vs. Vormonat</p>
            </CardContent>
        </Card>
    );
}

export function AnalyticsDashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Besucher (30 Tage)" value="38,4K" change="+12.5%" icon={Users} />
                <StatCard title="Sitzungen" value="52,1K" change="+9.8%" icon={BarChart} />
                <StatCard title="Absprungrate" value="42.3%" change="-5.1%" icon={TrendingDown} />
                <StatCard title="Durchschn. Sitzungsdauer" value="2m 45s" change="+3.2%" icon={TrendingUp} />
            </div>
            
            <Card className="gcp-card xl:col-span-2">
                <CardHeader>
                    <CardTitle className="text-base font-medium">Besucher & Seitenaufrufe (letzte 30 Tage)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-72">
                         <ChartContainer config={chartConfig}>
                            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString("de-DE", { day: "numeric" })} />
                                <YAxis yAxisId="left" stroke={chartConfig.visitors.color} />
                                <YAxis yAxisId="right" orientation="right" stroke={chartConfig.pageviews.color} />
                                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                                <Line yAxisId="left" type="monotone" dataKey="visitors" stroke={chartConfig.visitors.color} strokeWidth={2} dot={false} name="Besucher"/>
                                <Line yAxisId="right" type="monotone" dataKey="pageviews" stroke={chartConfig.pageviews.color} strokeWidth={2} dot={false} name="Seitenaufrufe"/>
                            </LineChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="gcp-card xl:col-span-1">
                <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center justify-between">
                       <span>Top Seiten</span>
                       <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pfad</TableHead>
                                <TableHead className="text-right">Aufrufe</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topPages.map((page) => (
                                <TableRow key={page.path}>
                                    <TableCell className="font-medium text-xs truncate">{page.path}</TableCell>
                                    <TableCell className="text-right">{page.views}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="gcp-card xl:col-span-1">
                 <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center justify-between">
                       <span>Top Regionen</span>
                       <Map className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {topRegions.map((region) => (
                        <div key={region.country} className="flex items-center justify-between text-sm mb-3">
                            <div className="flex items-center gap-2">
                               <span>{region.flag}</span>
                               <span>{region.country}</span>
                            </div>
                            <span className="font-medium">{region.users}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
            
            <Card className="gcp-card xl:col-span-4 bg-primary text-primary-foreground">
                <CardHeader>
                    <CardTitle>Firebase Analytics ist nicht verbunden</CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                        Diese Daten sind aktuell nur Platzhalter. Um echte Nutzerdaten zu sehen, müssen Sie Firebase Analytics in Ihrer App einrichten und mit diesem Dashboard verbinden.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                        Firebase Analytics verbinden (demnächst) <ExternalLink className="ml-2 h-4 w-4"/>
                    </Button>
                </CardContent>
            </Card>

        </div>
    )
}

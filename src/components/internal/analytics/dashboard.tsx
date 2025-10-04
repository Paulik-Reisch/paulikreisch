

"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart as LineChartIcon, Users, BarChart, Map, Link as LinkIcon, ExternalLink, TrendingUp, TrendingDown, ArrowRight, Smartphone, Globe, Clock, Sparkles, ShieldCheck, UserCheck, CalendarDays, Activity } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, AreaChart, BarChart as BarChartRecharts, Area, Line, XAxis, YAxis, CartesianGrid, Bar } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
        date: date.toLocaleDateString("de-DE", { month: 'short', day: 'numeric' }),
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

const retentionData = [
  { name: 'Tag 0', retention: 100 },
  { name: 'Tag 1', retention: 45 },
  { name: 'Tag 7', retention: 25 },
  { name: 'Tag 14', retention: 15 },
  { name: 'Tag 30', retention: 8 },
]

const chartConfig = {
  visitors: { label: "Besucher", color: "hsl(var(--primary))" },
  pageviews: { label: "Seitenaufrufe", color: "#82ca9d" },
  retention: { label: "Nutzerbindung", color: "hsl(var(--primary))" },
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

function RealtimeCard() {
    const [realtimeUsers, setRealtimeUsers] = React.useState(42);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setRealtimeUsers(prev => Math.max(5, prev + Math.floor(Math.random() * 7) - 3));
        }, 2500);
        return () => clearInterval(interval);
    }, [])

    return (
        <Card className="gcp-card">
            <CardHeader>
                 <CardTitle className="text-base font-medium flex items-center justify-between">
                    <span>Echtzeit</span>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{realtimeUsers}</div>
                <p className="text-xs text-muted-foreground">Aktive Nutzer auf der Seite</p>
            </CardContent>
        </Card>
    )
}


export function AnalyticsDashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            
            {/* Main Overview */}
            <Card className="gcp-card xl:col-span-6">
                <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center justify-between">
                       <span>Nutzeraktivität (letzte 30 Tage)</span>
                       <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                         <ChartContainer config={chartConfig}>
                            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis yAxisId="left" stroke={chartConfig.visitors.color} />
                                <YAxis yAxisId="right" orientation="right" stroke={chartConfig.pageviews.color} />
                                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                                <defs>
                                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartConfig.visitors.color} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={chartConfig.visitors.color} stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <Area yAxisId="left" type="monotone" dataKey="visitors" stroke={chartConfig.visitors.color} strokeWidth={2} fill="url(#colorVisitors)" name="Besucher"/>
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <RealtimeCard />
                <StatCard title="Sitzungen" value="52,1K" change="+9.8%" icon={BarChart} />
                <StatCard title="Absprungrate" value="42.3%" change="-5.1%" icon={TrendingDown} />
                <StatCard title="Sitzungsdauer" value="2m 45s" change="+3.2%" icon={TrendingUp} />
            </div>

            <Card className="gcp-card xl:col-span-2">
                <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center justify-between">
                       <span>Top Seiten (Views)</span>
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
                                    <TableCell className="font-medium text-xs truncate max-w-48">{page.path}</TableCell>
                                    <TableCell className="text-right">{page.views}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            
            <Card className="gcp-card xl:col-span-2">
                 <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center justify-between">
                       <span>Top Regionen (Nutzer)</span>
                       <Map className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     {topRegions.map((region) => (
                        <div key={region.country} className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                                <div className="flex items-center gap-2">
                                <span>{region.flag}</span>
                                <span>{region.country}</span>
                                </div>
                                <span className="font-medium">{region.users}</span>
                            </div>
                             <Progress value={region.percentage} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="gcp-card xl:col-span-3">
                <CardHeader>
                     <CardTitle className="text-base font-medium flex items-center justify-between">
                       <span>Nutzerbindung (User Retention)</span>
                       <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                </CardHeader>
                 <CardContent>
                    <div className="h-48">
                        <ChartContainer config={chartConfig}>
                            <BarChartRecharts data={retentionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                 <CartesianGrid vertical={false} />
                                 <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                                 <YAxis unit="%" />
                                 <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                                 <Bar dataKey="retention" fill={chartConfig.retention.color} radius={4} name="Nutzerbindung" />
                            </BarChartRecharts>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

             <Card className="gcp-card xl:col-span-3">
                <CardHeader>
                     <CardTitle className="text-base font-medium flex items-center justify-between">
                       <span>Wichtige Ereignisse (Key Events)</span>
                       <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                </CardHeader>
                 <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event-Name</TableHead>
                                <TableHead className="text-right">Anzahl (letzte 30 Tage)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow><TableCell>HW2 Vorbestellung</TableCell><TableCell className="text-right">1,284</TableCell></TableRow>
                             <TableRow><TableCell>Newsletter-Anmeldung</TableCell><TableCell className="text-right">3,491</TableCell></TableRow>
                             <TableRow><TableCell>Satire-Test abgeschlossen</TableCell><TableCell className="text-right">7,812</TableCell></TableRow>
                             <TableRow><TableCell>Palabrota nachgeschlagen</TableCell><TableCell className="text-right">22,409</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            
            <Card className="gcp-card xl:col-span-2">
                 <CardHeader>
                     <CardTitle className="text-base font-medium flex items-center justify-between">
                       <span>Geräte</span>
                       <Smartphone className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-around text-center">
                        <div><div className="text-2xl font-bold">68%</div><div className="text-xs text-muted-foreground">Mobile</div></div>
                        <div><div className="text-2xl font-bold">30%</div><div className="text-xs text-muted-foreground">Desktop</div></div>
                        <div><div className="text-2xl font-bold">2%</div><div className="text-xs text-muted-foreground">Tablet</div></div>
                    </div>
                </CardContent>
            </Card>
            <Card className="gcp-card xl:col-span-2">
                 <CardHeader>
                     <CardTitle className="text-base font-medium flex items-center justify-between">
                       <span>App-Stabilität</span>
                       <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="text-4xl font-bold">99.8%</div>
                     <p className="text-xs text-muted-foreground">Absturzfreie Nutzer</p>
                </CardContent>
            </Card>

            <Card className="gcp-card xl:col-span-2 bg-primary/10 border-primary/50 text-primary">
                <CardHeader>
                    <CardTitle>Firebase Analytics ist nicht verbunden</CardTitle>
                    <CardDescription className="text-primary/80">
                        Diese Daten sind aktuell nur Platzhalter. Um echte Nutzerdaten zu sehen, müssen Sie Firebase Analytics in Ihrer App einrichten und mit diesem Dashboard verbinden.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <Button variant="outline" className="border-primary bg-transparent text-primary hover:bg-primary/10">
                        Firebase Analytics verbinden (demnächst) <ExternalLink className="ml-2 h-4 w-4"/>
                    </Button>
                </CardContent>
            </Card>

        </div>
    )
}

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createTrackedUrl } from "@/lib/utils";
import {
  Users,
  BarChart as BarChartIcon,
  MousePointerClick,
  Percent,
  Link as LinkIcon,
  Copy,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Pie, PieChart, Cell, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import type { AnalyticsEvent } from "@/lib/firestore";

const pageViewChartConfig = {
  pageViews: {
    label: "Seitenaufrufe",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const deviceChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--primary))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--secondary))",
  },
} satisfies ChartConfig;

type TrackingData = {
    source: string | null;
    medium: string | null;
    campaign: string | null;
    content: string | null;
    term: string | null;
}

type AnalyticsClientProps = {
    summary: {
        visitors: { value: number; change: number };
        pageViews: { value: number; change: number };
        newsletterSubscriptions: { value: number; change: number };
        conversionRate: { value: number; change: number };
    };
    chartData: { month: string; pageViews: number }[];
    topPages: { path: string; views: number }[];
    topSources: { source: string; visitors: number }[];
    deviceBreakdown: { type: string; count: number }[];
    recentEvents: AnalyticsEvent[];
}


export function AnalyticsClient({ summary, chartData, topPages, topSources, deviceBreakdown, recentEvents }: AnalyticsClientProps) {
  const { toast } = useToast();
  
  // State for UTM Link Generator
  const [baseUrl, setBaseUrl] = useState("https://paulikreisch.de");
  const [campaign, setCampaign] = useState("");
  const [medium, setMedium] = useState("");
  const [content, setContent] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  
  // Effect for UTM Generator
  useEffect(() => {
    if (baseUrl && campaign && medium) {
        const url = createTrackedUrl(baseUrl, campaign, medium, content);
        setGeneratedUrl(url);
    } else {
        setGeneratedUrl("");
    }
  }, [baseUrl, campaign, medium, content]);

  const copyToClipboard = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      toast({
        title: "Kopiert!",
        description: "Der Tracking-Link wurde in die Zwischenablage kopiert.",
      });
    }
  };

  const pieChartColors = [deviceChartConfig.desktop.color, deviceChartConfig.mobile.color];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Besucher</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.visitors.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{summary.visitors.change >= 0 ? '+' : ''}{summary.visitors.change.toFixed(1)}% zum Vormonat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seitenaufrufe</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pageViews.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{summary.pageViews.change >= 0 ? '+' : ''}{summary.pageViews.change.toFixed(1)}% zum Vormonat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter Abos</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.newsletterSubscriptions.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{summary.newsletterSubscriptions.change >= 0 ? '+' : ''}{summary.newsletterSubscriptions.change.toFixed(1)}% zum Vormonat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.conversionRate.value.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Buchkäufe / Besucher</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Seitenaufrufe</CardTitle>
            <CardDescription>Letzte 6 Monate</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pageViewChartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
                <Bar dataKey="pageViews" fill="var(--color-pageViews)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geräte</CardTitle>
            <CardDescription>Besucher nach Gerätetyp</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={deviceChartConfig} className="h-[250px] w-[250px]">
                <PieChart>
                    <Pie data={deviceBreakdown} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={80} label>
                        {deviceBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                        ))}
                    </Pie>
                    <Legend content={({ payload }) => (
                      <ul className="flex gap-4 justify-center mt-4 text-sm">
                        {payload?.map((entry, index) => (
                          <li key={`item-${index}`} className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span>{entry.value}</span>
                          </li>
                        ))}
                      </ul>
                    )} />
                </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top-Seiten</CardTitle>
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
                            <TableCell className="font-medium truncate max-w-xs">{page.path}</TableCell>
                            <TableCell className="text-right">{page.views.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top-Quellen</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Quelle</TableHead>
                        <TableHead className="text-right">Besucher</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topSources.map((source) => (
                        <TableRow key={source.source}>
                            <TableCell className="font-medium">{source.source}</TableCell>
                            <TableCell className="text-right">{source.visitors.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

       <div>
         <Card>
           <CardHeader>
             <CardTitle>Letzte Aktivitäten</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
               {recentEvents.map(event => (
                 <div key={event.id} className="flex items-center gap-4">
                   <div className="p-2 bg-muted rounded-full">
                     { (event.params?.userAgent || '').toLowerCase().includes('mobi') ? <Smartphone className="h-5 w-5 text-muted-foreground"/> : <Monitor className="h-5 w-5 text-muted-foreground"/> }
                   </div>
                   <div className="flex-grow">
                     <p className="font-medium truncate">{event.path}</p>
                     <p className="text-xs text-muted-foreground">
                        {event.params?.utm_source ? `via ${event.params.utm_source}` : 'Direkter Zugriff'}
                     </p>
                   </div>
                   <div className="text-xs text-muted-foreground text-right shrink-0">
                     {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true, locale: de })}
                   </div>
                 </div>
               ))}
             </div>
           </CardContent>
         </Card>
       </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5" /> UTM-Link-Generator</CardTitle>
            <CardDescription>Erstellen Sie nachverfolgbare Links für Ihre Kampagnen.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="base-url">Basis-URL</Label>
                    <Input id="base-url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://paulikreisch.de/..." />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="campaign">Kampagne (utm_campaign)</Label>
                    <Input id="campaign" value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="z.B. sommer-aktion" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="medium">Medium (utm_medium)</Label>
                    <Input id="medium" value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="z.B. social, email" required />
                </div>
                 <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="content">Inhalt (utm_content, optional)</Label>
                    <Input id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="z.B. post-1, header-link" />
                </div>
             </div>
            {generatedUrl && (
                <div className="space-y-2 pt-2">
                    <Label>Generierter Link</Label>
                    <div className="flex items-center gap-2">
                        <Input value={generatedUrl} readOnly className="text-xs bg-muted" />
                        <Button variant="outline" size="icon" onClick={copyToClipboard}><Copy className="h-4 w-4" /></Button>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

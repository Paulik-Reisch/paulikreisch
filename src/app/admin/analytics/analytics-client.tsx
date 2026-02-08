
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
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";


const chartConfig = {
  pageViews: {
    label: "Seitenaufrufe",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

type TrackingData = {
    source: string | null;
    medium: string | null;
    campaign: string | null;
    content: string | null;
    term: string | null;
}

type AnalyticsData = {
    summary: {
        visitors: { value: number; change: number };
        pageViews: { value: number; change: number };
        newsletterSubscriptions: { value: number; change: number };
        conversionRate: { value: number; change: number };
    };
    chartData: { month: string; pageViews: number }[];
}

export function AnalyticsClient({ summary, chartData }: AnalyticsData) {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // State for UTM Link Generator
  const [baseUrl, setBaseUrl] = useState("https://paulik-reisch.de");
  const [campaign, setCampaign] = useState("");
  const [medium, setMedium] = useState("");
  const [content, setContent] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  
  // State for session tracking
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);

  // Effect for UTM Generator
  useEffect(() => {
    if (baseUrl && campaign && medium) {
        const url = createTrackedUrl(baseUrl, campaign, medium, content);
        setGeneratedUrl(url);
    } else {
        setGeneratedUrl("");
    }
  }, [baseUrl, campaign, medium, content]);
  
  // Effect for Session Tracking
  useEffect(() => {
    const data: TrackingData = {
        source: searchParams.get('utm_source'),
        medium: searchParams.get('utm_medium'),
        campaign: searchParams.get('utm_campaign'),
        content: searchParams.get('utm_content'),
        term: searchParams.get('utm_term'),
    };
    if (data.source || data.medium || data.campaign) {
        setTrackingData(data);
    }
  }, [searchParams]);

  const copyToClipboard = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      toast({
        title: "Kopiert!",
        description: "Der Tracking-Link wurde in die Zwischenablage kopiert.",
      });
    }
  };

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
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideIndicator />}
                />
                <Bar
                  dataKey="pageViews"
                  fill="var(--color-pageViews)"
                  radius={8}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {trackingData ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Kampagnen-Tracking</CardTitle>
              <CardDescription>Daten der aktuellen Sitzung.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div>
                    <p className="font-semibold text-primary">{trackingData.campaign || '(nicht gesetzt)'}</p>
                    <p className="text-xs text-muted-foreground">Kampagne</p>
                </div>
                 <div>
                    <p className="font-medium">{trackingData.medium || '(nicht gesetzt)'}</p>
                    <p className="text-xs text-muted-foreground">Medium</p>
                </div>
                <div>
                    <p className="font-medium">{trackingData.source || '(nicht gesetzt)'}</p>
                    <p className="text-xs text-muted-foreground">Quelle</p>
                </div>
                 <div>
                    <p className="font-medium">{trackingData.content || '(nicht gesetzt)'}</p>
                    <p className="text-xs text-muted-foreground">Inhalt</p>
                </div>
            </CardContent>
          </Card>
        ) : (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-muted-foreground" /> Kampagnen-Tracking</CardTitle>
                    <CardDescription>Daten der aktuellen Sitzung.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48">
                    <p className="text-sm text-muted-foreground text-center">Keine aktiven Kampagnenparameter in dieser Sitzung.</p>
                </CardContent>
             </Card>
        )}
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
                    <Input id="base-url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://paulik-reisch.de/..." />
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

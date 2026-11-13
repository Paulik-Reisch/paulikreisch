"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { buildCampaignUrl, CAMPAIGN_MEDIUMS, CAMPAIGN_SOURCES } from "@/lib/campaign-url";
import {
  Users,
  BarChart as BarChartIcon,
  MousePointerClick,
  Percent,
  Link as LinkIcon,
  Copy,
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
import type { SerializedAnalyticsEvent as AnalyticsEvent } from "@/lib/firestore";

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

type Metric = { value: number; change: number; changeSamePeriod: number };

export type AnalyticsClientProps = {
    summary: {
        visitors: Metric;
        pageViews: Metric;
        newsletterSubscriptions: Metric;
        conversionRate: Metric;
    };
    chartData: { month: string; pageViews: number }[];
    topPages: { path: string; views: number }[];
    topSources: { source: string; visitors: number }[];
    deviceBreakdown: { type: string; count: number }[];
    recentEvents: Pick<AnalyticsEvent, "id" | "path" | "params" | "timestamp">[];
    scopeLabel?: string;
}

const formatChange = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

/** The current month to date compared with the previous month, both ways. */
function ComparisonLines({ metric }: { metric: Metric }) {
  return (
    <>
      <p className="text-xs text-muted-foreground">{formatChange(metric.changeSamePeriod)} zum Vormonat (gleicher Zeitraum)</p>
      <p className="text-xs text-muted-foreground">{formatChange(metric.change)} zum Vormonat (gesamt)</p>
    </>
  );
}

export function AnalyticsClient({ summary, chartData, topPages, topSources, deviceBreakdown, recentEvents, scopeLabel }: AnalyticsClientProps) {
  const { toast } = useToast();

  // State for the campaign link builder
  const [baseUrl, setBaseUrl] = useState("https://paulikreisch.de/shop");
  const [source, setSource] = useState<string>(CAMPAIGN_SOURCES[0]);
  const [medium, setMedium] = useState<string>(CAMPAIGN_MEDIUMS[0]);
  const [campaign, setCampaign] = useState("");
  const [content, setContent] = useState("");

  const linkResult = campaign.trim()
    ? buildCampaignUrl({ baseUrl, source, medium, campaign, content })
    : null;
  const generatedUrl = linkResult?.ok ? linkResult.url : "";

  const copyToClipboard = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      toast({
        title: "Kopiert!",
        description: "Der Kampagnen-Link wurde in die Zwischenablage kopiert.",
      });
    }
  };

  const pieChartColors = [deviceChartConfig.desktop.color, deviceChartConfig.mobile.color];

  return (
    <div className="min-w-0 space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eingewilligte Browser</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.visitors.value.toLocaleString()}</div>
            <ComparisonLines metric={summary.visitors} />
            <p className="text-xs text-muted-foreground">Pseudonyme Browser-IDs, keine verifizierten Personen</p>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seitenaufrufe</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pageViews.value.toLocaleString()}</div>
            <ComparisonLines metric={summary.pageViews} />
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anmeldeanfragen</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.newsletterSubscriptions.value.toLocaleString()}</div>
            <ComparisonLines metric={summary.newsletterSubscriptions} />
            <p className="text-xs text-muted-foreground">Erfolgreiche Formular-Anfragen, keine bestätigten Abos</p>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Nicht erfasst</div>
            <p className="text-xs text-muted-foreground">Keine bestätigten Kaufdaten vorhanden</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid min-w-0 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Seitenaufrufe</CardTitle>
            <CardDescription>Letzte 6 Monate</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pageViewChartConfig} className="h-[250px] min-w-0 w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
                <Bar isAnimationActive={false} dataKey="pageViews" fill="var(--color-pageViews)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Geräte</CardTitle>
            <CardDescription>Eingewilligte Browser pro Tag nach Gerätetyp</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={deviceChartConfig} className="h-[250px] w-full max-w-[250px] min-w-0">
                <PieChart>
                    <Pie isAnimationActive={false} data={deviceBreakdown} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={80} label>
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
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Top-Seiten</CardTitle>{scopeLabel && <CardDescription>{scopeLabel}</CardDescription>}
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
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Top-Quellen</CardTitle>{scopeLabel && <CardDescription>{scopeLabel}</CardDescription>}
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
            <p className="mt-3 text-xs text-muted-foreground">„Unbekannt“ heißt: keine Herkunft erkannt, nicht sicher direkt eingegeben.</p>
          </CardContent>
        </Card>
      </div>

       <div>
         <Card className="min-w-0">
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
                   <div className="min-w-0 flex-grow">
                     <p className="font-medium truncate">{event.path}</p>
                     <p className="text-xs text-muted-foreground">
                        {event.params?.utm_source ? `via ${event.params.utm_source}` : 'Keine erkennbare Quelle'}
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
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5" /> Kampagnen-Link-Builder</CardTitle>
            <CardDescription>Feste UTM-Begriffe, damit Kampagnen überall gleich heißen. Keine Empfänger-IDs, E-Mail-Adressen oder Tokens in den Werten.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="base-url">Ziel-URL</Label>
                    <Input id="base-url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://paulikreisch.de/shop" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="utm-source">Quelle (utm_source)</Label>
                    <Select value={source} onValueChange={setSource}>
                      <SelectTrigger id="utm-source"><SelectValue placeholder="Quelle wählen" /></SelectTrigger>
                      <SelectContent>
                        {CAMPAIGN_SOURCES.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                      </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="utm-medium">Medium (utm_medium)</Label>
                    <Select value={medium} onValueChange={setMedium}>
                      <SelectTrigger id="utm-medium"><SelectValue placeholder="Medium wählen" /></SelectTrigger>
                      <SelectContent>
                        {CAMPAIGN_MEDIUMS.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                      </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="utm-campaign">Kampagne (utm_campaign)</Label>
                    <Input id="utm-campaign" value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="z.B. buchstart_2026_11" required />
                 </div>
                 <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="utm-content">Inhalt (utm_content, optional)</Label>
                    <Input id="utm-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="z.B. bio, story_01, poster_a" />
                 </div>
             </div>
            {linkResult && !linkResult.ok && (
                <p role="alert" className="text-sm text-destructive">{linkResult.error}</p>
            )}
            {generatedUrl && (
                <div className="space-y-2 pt-2">
                    <Label>Generierter Link</Label>
                    <div className="flex items-center gap-2">
                        <Input value={generatedUrl} readOnly className="text-xs bg-muted" />
                        <Button variant="outline" size="icon" aria-label="Kampagnen-Link kopieren" onClick={copyToClipboard}><Copy className="h-4 w-4" /></Button>
                    </div>
                </div>
            )}
            <p className="text-xs text-muted-foreground">Nur Kleinbuchstaben und feste Begriffe halten die Auswertung vergleichbar. Die laufende UTM-Erfassung auf der Website ist eine eigene Ausbaustufe und noch nicht live; die Quellen-Auswertung oben nutzt bis dahin nur vorhandene Daten.</p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

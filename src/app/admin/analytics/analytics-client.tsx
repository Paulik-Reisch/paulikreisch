
"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

const chartData = [
  { month: "Januar", pageViews: 186 },
  { month: "Februar", pageViews: 305 },
  { month: "März", pageViews: 237 },
  { month: "April", pageViews: 273 },
  { month: "Mai", pageViews: 209 },
  { month: "Juni", pageViews: 214 },
];

const chartConfig = {
  pageViews: {
    label: "Seitenaufrufe",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export function AnalyticsClient() {
  const { toast } = useToast();
  const [baseUrl, setBaseUrl] = useState("https://paulik-reisch.de");
  const [campaign, setCampaign] = useState("");
  const [medium, setMedium] = useState("");
  const [content, setContent] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");

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
            <div className="text-2xl font-bold">+2.350</div>
            <p className="text-xs text-muted-foreground">+180.1% zum Vormonat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seitenaufrufe</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.234</div>
            <p className="text-xs text-muted-foreground">+19% zum Vormonat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter Abos</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 seit letzter Woche</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.4%</div>
            <p className="text-xs text-muted-foreground">Buchkäufe / Besucher</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Link Generator */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5" /> UTM-Link-Generator</CardTitle>
            <CardDescription>Erstellen Sie nachverfolgbare Links für Ihre Kampagnen.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
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
             <div className="space-y-2">
                <Label htmlFor="content">Inhalt (utm_content, optional)</Label>
                <Input id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="z.B. post-1, header-link" />
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

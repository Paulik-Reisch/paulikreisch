
"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart, BarChart, Users, TrafficCone, MousePointerClick, ArrowRight } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Bar, ComposedChart } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const chartData = [
  { date: "2024-04-01", visitors: 240, sources: { organic: 120, direct: 80, referral: 40 } },
  { date: "2024-04-02", visitors: 310, sources: { organic: 150, direct: 100, referral: 60 } },
  { date: "2024-04-03", visitors: 280, sources: { organic: 140, direct: 90, referral: 50 } },
  { date: "2024-04-04", visitors: 450, sources: { organic: 250, direct: 120, referral: 80 } },
  { date: "2024-04-05", visitors: 420, sources: { organic: 220, direct: 150, referral: 50 } },
  { date: "2024-04-06", visitors: 510, sources: { organic: 280, direct: 160, referral: 70 } },
  { date: "2024-04-07", visitors: 480, sources: { organic: 260, direct: 140, referral: 80 } },
];

const chartConfig = {
  visitors: {
    label: "Besucher",
    color: "hsl(var(--primary))",
  },
  organic: {
      label: "Organisch",
      color: "#22c55e",
  },
  direct: {
      label: "Direkt",
      color: "#3b82f6",
  },
  referral: {
      label: "Verweis",
      color: "#f97316",
  }
};

export function AnalyticsDashboard({ isDetailed = false }: { isDetailed?: boolean }) {
    
    if (!isDetailed) {
        return (
             <Card className="gcp-card">
                <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center justify-between">
                       <span>Analytics-Übersicht</span>
                        <Link href="/internal/isdm/analytics">
                            <Button className="gcp-button h-7">
                                Mehr Details <ArrowRight className="ml-2 h-3 w-3" />
                            </Button>
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="h-48">
                         <ChartContainer config={chartConfig}>
                            <ComposedChart data={chartData}>
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString("de-DE", { month: "short", day: "numeric" })} hide />
                                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                                <Line type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                            </ComposedChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card className="gcp-card xl:col-span-2">
                <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-2"><Users className="h-5 w-5"/>Besucher pro Tag</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-72">
                         <ChartContainer config={chartConfig}>
                            <ComposedChart data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString("de-DE", { month: "short", day: "numeric" })} />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                                <Line type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} />
                            </ComposedChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
            <Card className="gcp-card">
                <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-2"><TrafficCone className="h-5 w-5"/>Traffic-Quellen</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="h-72">
                         <ChartContainer config={chartConfig}>
                            <ComposedChart data={chartData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="date" type="category" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString("de-DE", { weekday: "short" })} />
                                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                                <Bar dataKey="sources.organic" name="Organisch" stackId="a" fill={chartConfig.organic.color} radius={[0, 4, 4, 0]}/>
                                <Bar dataKey="sources.direct" name="Direkt" stackId="a" fill={chartConfig.direct.color} />
                                <Bar dataKey="sources.referral" name="Verweis" stackId="a" fill={chartConfig.referral.color} radius={[4, 0, 0, 4]}/>
                            </ComposedChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

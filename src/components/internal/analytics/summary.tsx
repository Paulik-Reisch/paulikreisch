
"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const summaryData = [
  { title: "Besucher (24h)", value: "2,104", change: "+12.5%" },
  { title: "Sitzungen", value: "3,456", change: "+8.1%" },
  { title: "Absprungrate", value: "42.3%", change: "-2.3%" },
  { title: "Durchschn. Sitzungsdauer", value: "2m 45s", change: "+5.9%" },
];


export function AnalyticsSummary() {
    
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
            <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 {summaryData.map((item) => {
                     const isPositive = item.change.startsWith('+');
                     return (
                        <div key={item.title} className="p-4 bg-gray-50 rounded-sm">
                            <div className="text-xs text-gray-500 flex items-center justify-between">
                                <span>{item.title}</span>
                                { isPositive ? <TrendingUp className="h-4 w-4 text-green-600"/> : <TrendingDown className="h-4 w-4 text-destructive"/> }
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mt-1">{item.value}</div>
                            <div className={`text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-destructive'}`}>{item.change}</div>
                        </div>
                    )
                 })}
            </CardContent>
        </Card>
    )
}

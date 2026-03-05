"use client"

import { Card, CardContent } from "@/components/ui/card"
import { kpiStats } from "@/lib/mock-data"
import {
  ShieldAlert,
  ShieldCheck,
  Flame,
  Timer,
  ScanSearch,
  Brain,
} from "lucide-react"

const cards = [
  {
    label: "Total Threats",
    value: kpiStats.totalThreats,
    icon: ShieldAlert,
    color: "text-threat-critical",
    bgColor: "bg-threat-critical/10",
    trend: "+12%",
    trendUp: true,
  },
  {
    label: "Threats Blocked",
    value: kpiStats.threatsBlocked,
    icon: ShieldCheck,
    color: "text-threat-safe",
    bgColor: "bg-threat-safe/10",
    trend: "87.5%",
    trendUp: true,
  },
  {
    label: "Active Incidents",
    value: kpiStats.activeIncidents,
    icon: Flame,
    color: "text-threat-high",
    bgColor: "bg-threat-high/10",
    trend: "-2",
    trendUp: false,
  },
  {
    label: "Avg Response",
    value: kpiStats.avgResponseTime,
    icon: Timer,
    color: "text-primary",
    bgColor: "bg-primary/10",
    trend: "-0.3s",
    trendUp: false,
  },
  {
    label: "Packets Scanned",
    value: kpiStats.packetsScanned,
    icon: ScanSearch,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    trend: "+8.1M",
    trendUp: true,
  },
  {
    label: "Model Accuracy",
    value: `${kpiStats.modelAccuracy}%`,
    icon: Brain,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    trend: "+0.4%",
    trendUp: true,
  },
]

export function KpiCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <span className={`text-xs font-medium ${card.trendUp ? "text-threat-safe" : "text-primary"}`}>
                  {card.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-card-foreground tracking-tight">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

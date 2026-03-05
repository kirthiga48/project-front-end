"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { threatEvents, type ThreatSeverity, type ThreatStatus } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { AlertTriangle, Clock, CheckCircle2 } from "lucide-react"

function severityColor(s: ThreatSeverity) {
  switch (s) {
    case "critical": return "bg-threat-critical/15 text-threat-critical border-threat-critical/30"
    case "high": return "bg-threat-high/15 text-threat-high border-threat-high/30"
    case "medium": return "bg-threat-medium/15 text-threat-medium border-threat-medium/30"
    case "low": return "bg-threat-low/15 text-threat-low border-threat-low/30"
  }
}

function statusIcon(s: ThreatStatus) {
  switch (s) {
    case "active": return <AlertTriangle className="w-3.5 h-3.5 text-threat-critical" />
    case "investigating": return <Clock className="w-3.5 h-3.5 text-threat-high" />
    case "mitigated": return <CheckCircle2 className="w-3.5 h-3.5 text-threat-safe" />
  }
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

export function RecentThreats() {
  const recent = threatEvents.slice(0, 5)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-card-foreground">
            Recent Threats
          </CardTitle>
          <span className="text-xs text-muted-foreground">{threatEvents.length} total</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {recent.map((threat) => (
            <div
              key={threat.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="mt-0.5">
                {statusIcon(threat.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-card-foreground">{threat.type}</span>
                  <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", severityColor(threat.severity))}>
                    {threat.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{threat.description}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] text-muted-foreground font-mono">{threat.sourceIP}</span>
                  <span className="text-[10px] text-muted-foreground">{formatTime(threat.timestamp)}</span>
                  <span className="text-[10px] text-muted-foreground">{threat.confidence}% conf</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

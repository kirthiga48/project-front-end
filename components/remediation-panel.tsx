
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { remediations, type ThreatSeverity } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import {
  Zap,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Wrench,
} from "lucide-react"

function priorityColor(p: ThreatSeverity) {
  switch (p) {
    case "critical": return "bg-threat-critical/15 text-threat-critical border-threat-critical/30"
    case "high": return "bg-threat-high/15 text-threat-high border-threat-high/30"
    case "medium": return "bg-threat-medium/15 text-threat-medium border-threat-medium/30"
    case "low": return "bg-threat-low/15 text-threat-low border-threat-low/30"
  }
}

export function RemediationPanel() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [executing, setExecuting] = useState<Set<string>>(new Set())
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const handleExecute = (id: string) => {
    setExecuting((prev) => new Set(prev).add(id))
    setTimeout(() => {
      setExecuting((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      setCompleted((prev) => new Set(prev).add(id))
    }, 3000)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Wrench className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-card-foreground">
              Automated Remediation
            </CardTitle>
            <p className="text-xs text-muted-foreground">AI-generated response actions</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {remediations.map((rem) => {
            const isExpanded = expanded === rem.id
            const isExecuting = executing.has(rem.id)
            const isCompleted = completed.has(rem.id)

            return (
              <div
                key={rem.id}
                className={cn(
                  "rounded-lg border border-border/50 overflow-hidden transition-all",
                  isCompleted ? "bg-threat-safe/5 border-threat-safe/20" : "bg-secondary/50"
                )}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : rem.id)}
                  className="flex items-center gap-3 w-full p-3 text-left hover:bg-secondary/80 transition-colors"
                >
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-threat-safe" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-threat-high" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-card-foreground">{rem.title}</span>
                      <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", priorityColor(rem.priority))}>
                        {rem.priority}
                      </Badge>
                      {rem.automated && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">
                          <Zap className="w-2.5 h-2.5 mr-0.5" />
                          Auto
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{rem.description}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-border/30">
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Remediation Steps
                      </p>
                      <ol className="space-y-1.5">
                        {rem.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary text-[10px] text-muted-foreground font-medium shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="text-xs text-card-foreground leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                      {!isCompleted && (
                        <Button
                          size="sm"
                          onClick={() => handleExecute(rem.id)}
                          disabled={isExecuting}
                          className="mt-3 bg-primary text-primary-foreground hover:bg-primary/80"
                        >
                          {isExecuting ? (
                            <>
                              <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                              Executing...
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                              {rem.automated ? "Execute Automatically" : "Apply Manually"}
                            </>
                          )}
                        </Button>
                      )}
                      {isCompleted && (
                        <div className="flex items-center gap-2 mt-3 p-2 rounded-md bg-threat-safe/10">
                          <CheckCircle2 className="w-3.5 h-3.5 text-threat-safe" />
                          <span className="text-xs text-threat-safe font-medium">Remediation applied successfully</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

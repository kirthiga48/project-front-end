"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { threatEvents, type ThreatEvent, type ThreatSeverity, type ThreatStatus } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import {
  Search,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  ExternalLink,
} from "lucide-react"

function severityBadge(s: ThreatSeverity) {
  const colors: Record<ThreatSeverity, string> = {
    critical: "bg-threat-critical/15 text-threat-critical border-threat-critical/30",
    high: "bg-threat-high/15 text-threat-high border-threat-high/30",
    medium: "bg-threat-medium/15 text-threat-medium border-threat-medium/30",
    low: "bg-threat-low/15 text-threat-low border-threat-low/30",
  }
  return colors[s]
}

function statusDisplay(s: ThreatStatus) {
  switch (s) {
    case "active":
      return (
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 text-threat-critical" />
          <span className="text-xs text-threat-critical">Active</span>
        </div>
      )
    case "investigating":
      return (
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-threat-high" />
          <span className="text-xs text-threat-high">Investigating</span>
        </div>
      )
    case "mitigated":
      return (
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-threat-safe" />
          <span className="text-xs text-threat-safe">Mitigated</span>
        </div>
      )
  }
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ThreatLogTable() {
  const [search, setSearch] = useState("")
  const [selectedThreat, setSelectedThreat] = useState<ThreatEvent | null>(null)
  const [severityFilter, setSeverityFilter] = useState<ThreatSeverity | "all">("all")

  const filtered = threatEvents.filter((t) => {
    const matchesSearch =
      t.type.toLowerCase().includes(search.toLowerCase()) ||
      t.sourceIP.includes(search) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    const matchesSeverity = severityFilter === "all" || t.severity === severityFilter
    return matchesSearch && matchesSeverity
  })

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm font-semibold text-card-foreground">
              Threat Event Log
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search threats..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs bg-secondary border-border text-card-foreground"
                />
              </div>
              <div className="flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                {(["all", "critical", "high", "medium", "low"] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={cn(
                      "text-[10px] px-2 py-1 rounded-md transition-colors font-medium",
                      severityFilter === sev
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-card-foreground"
                    )}
                  >
                    {sev === "all" ? "All" : sev.charAt(0).toUpperCase() + sev.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                  <TableHead className="text-xs text-muted-foreground font-medium">ID</TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium">Time</TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium">Type</TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium">Severity</TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium hidden md:table-cell">Source IP</TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium hidden lg:table-cell">Confidence</TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium">Status</TableHead>
                  <TableHead className="text-xs text-muted-foreground font-medium w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((threat) => (
                  <TableRow
                    key={threat.id}
                    className="hover:bg-secondary/30 cursor-pointer transition-colors"
                    onClick={() => setSelectedThreat(threat)}
                  >
                    <TableCell className="text-xs font-mono text-primary">{threat.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDateTime(threat.timestamp)}</TableCell>
                    <TableCell className="text-xs text-card-foreground font-medium">{threat.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", severityBadge(threat.severity))}>
                        {threat.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground hidden md:table-cell">{threat.sourceIP}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${threat.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{threat.confidence}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{statusDisplay(threat.status)}</TableCell>
                    <TableCell>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted-foreground">{filtered.length} events</p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7 border-border">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="sr-only">Previous page</span>
              </Button>
              <span className="text-xs text-muted-foreground px-2">1 of 1</span>
              <Button variant="outline" size="icon" className="h-7 w-7 border-border">
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedThreat} onOpenChange={() => setSelectedThreat(null)}>
        <DialogContent className="bg-card border-border text-card-foreground max-w-lg">
          {selectedThreat && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-card-foreground">
                  <span className="font-mono text-primary">{selectedThreat.id}</span>
                  <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", severityBadge(selectedThreat.severity))}>
                    {selectedThreat.severity}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                    <p className="text-sm font-medium text-card-foreground">{selectedThreat.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    {statusDisplay(selectedThreat.status)}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Source IP</p>
                    <p className="text-sm font-mono text-card-foreground">{selectedThreat.sourceIP}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Destination IP</p>
                    <p className="text-sm font-mono text-card-foreground">{selectedThreat.destinationIP}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${selectedThreat.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-card-foreground">{selectedThreat.confidence}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Packets Analyzed</p>
                    <p className="text-sm font-medium text-card-foreground">{selectedThreat.packetsAnalyzed.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-card-foreground leading-relaxed">{selectedThreat.description}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Detected At</p>
                  <p className="text-sm text-card-foreground">{new Date(selectedThreat.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { trafficTimeline } from "@/lib/mock-data"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const responseTimeData = [
  { time: "Mon", avg: 1.8, p95: 3.2, p99: 5.1 },
  { time: "Tue", avg: 1.5, p95: 2.8, p99: 4.5 },
  { time: "Wed", avg: 1.2, p95: 2.4, p99: 3.8 },
  { time: "Thu", avg: 1.9, p95: 3.5, p99: 5.8 },
  { time: "Fri", avg: 1.1, p95: 2.1, p99: 3.2 },
  { time: "Sat", avg: 0.8, p95: 1.6, p99: 2.4 },
  { time: "Sun", avg: 0.9, p95: 1.8, p99: 2.8 },
]

const radarData = [
  { subject: "DDoS", A: 92, fullMark: 100 },
  { subject: "Phishing", A: 88, fullMark: 100 },
  { subject: "Malware", A: 95, fullMark: 100 },
  { subject: "Brute Force", A: 97, fullMark: 100 },
  { subject: "SQLi", A: 91, fullMark: 100 },
  { subject: "XSS", A: 89, fullMark: 100 },
]

const blockRateTimeline = trafficTimeline.map((d) => ({
  time: d.time,
  blockRate: d.threats > 0 ? Math.round((d.blocked / d.threats) * 100) : 100,
}))

export function AnalyticsView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-card-foreground">
                Response Time Trends
              </CardTitle>
              <span className="text-xs text-muted-foreground">Last 7 days</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                    axisLine={{ stroke: "var(--color-border)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    unit="s"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      color: "var(--color-popover-foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="avg" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} name="Avg" />
                  <Line type="monotone" dataKey="p95" stroke="var(--color-chart-4)" strokeWidth={2} dot={false} name="P95" />
                  <Line type="monotone" dataKey="p99" stroke="var(--color-chart-5)" strokeWidth={2} dot={false} name="P99" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-card-foreground">
                ML Detection Accuracy
              </CardTitle>
              <span className="text-xs text-muted-foreground">By threat category</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[70, 100]}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 9 }}
                  />
                  <Radar
                    name="Accuracy"
                    dataKey="A"
                    stroke="var(--color-primary)"
                    fill="var(--color-primary)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-card-foreground">
              Block Rate Over Time
            </CardTitle>
            <span className="text-xs text-muted-foreground">24h hourly breakdown</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={blockRateTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  axisLine={{ stroke: "var(--color-border)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[60, 100]}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-popover-foreground)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="blockRate"
                  stroke="var(--color-threat-safe)"
                  strokeWidth={2}
                  dot={false}
                  name="Block Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

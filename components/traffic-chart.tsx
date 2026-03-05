"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { trafficTimeline } from "@/lib/mock-data"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export function TrafficChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-card-foreground">
            Network Traffic
          </CardTitle>
          <span className="text-xs text-muted-foreground">Last 24 hours</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="requestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-5)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-chart-5)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Legend
                wrapperStyle={{ fontSize: 11, color: "var(--color-muted-foreground)" }}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="var(--color-chart-1)"
                fill="url(#requestGrad)"
                strokeWidth={2}
                name="Requests"
              />
              <Area
                type="monotone"
                dataKey="threats"
                stroke="var(--color-chart-5)"
                fill="url(#threatGrad)"
                strokeWidth={2}
                name="Threats"
              />
              <Area
                type="monotone"
                dataKey="blocked"
                stroke="var(--color-chart-2)"
                fill="url(#blockedGrad)"
                strokeWidth={2}
                name="Blocked"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

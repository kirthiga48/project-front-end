"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { threatDistribution } from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

const COLORS = [
  "var(--color-chart-5)",
  "var(--color-chart-4)",
  "var(--color-chart-1)",
  "var(--color-chart-3)",
  "var(--color-chart-2)",
  "var(--color-primary)",
  "var(--color-muted-foreground)",
]

export function ThreatDistributionChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-card-foreground">
            Threat Distribution
          </CardTitle>
          <span className="text-xs text-muted-foreground">By attack type</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={threatDistribution}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="type"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={85}
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
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={18}>
                {threatDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

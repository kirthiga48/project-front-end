"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Menu, Shield } from "lucide-react"

interface DashboardHeaderProps {
  activeView: string
  onMobileMenuToggle?: () => void
}

const viewTitles: Record<string, string> = {
  dashboard: "Security Dashboard",
  upload: "Upload Network Logs",
  threats: "Threat Event Log",
  chatbot: "AI Security Assistant",
  analytics: "Security Analytics",
  settings: "Settings",
}

export function DashboardHeader({ activeView }: DashboardHeaderProps) {
  return 
    <header className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="lg:hidden flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
            <Shield className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-card-foreground">{viewTitles[activeView] || "Dashboard"}</h2>
          <p className="text-xs text-muted-foreground hidden sm:block">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-threat-critical/30 text-threat-critical text-[10px] px-2 py-0.5 hidden sm:flex gap-1 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-threat-critical animate-pulse" />
          3 Active
        </Badge>
        <Badge variant="outline" className="border-threat-safe/30 text-threat-safe text-[10px] px-2 py-0.5 hidden sm:flex gap-1 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-threat-safe" />
          System Online
        </Badge>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-card-foreground">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-threat-critical" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 text-muted-foreground hover:text-card-foreground">
          <Menu className="w-4 h-4" />
          <span className="sr-only">Menu</span>
        </Button>
      </div>
    </header>
  )
}

"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Upload,
  ShieldAlert,
  MessageSquareText,
  Activity,
  Settings,
  Shield,
} from "lucide-react"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "upload", label: "Upload Logs", icon: Upload },
  { id: "threats", label: "Threat Log", icon: ShieldAlert },
  { id: "chatbot", label: "AI Assistant", icon: MessageSquareText },
  { id: "analytics", label: "Analytics", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
]

interface AppSidebarProps {
  activeView: string
  onNavigate: (view: string) => void
}

export function AppSidebar({ activeView, onNavigate }: AppSidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-sidebar-foreground tracking-tight">SentinelAI</h1>
          <p className="text-xs text-muted-foreground">Threat Detection</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">SA</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Security Admin</p>
            <p className="text-xs text-muted-foreground truncate">admin@sentinel.ai</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Upload,
  ShieldAlert,
  MessageSquareText,
  Activity,
} from "lucide-react"

const mobileNavItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "upload", label: "Upload", icon: Upload },
  { id: "threats", label: "Threats", icon: ShieldAlert },
  { id: "chatbot", label: "AI Chat", icon: MessageSquareText },
  { id: "analytics", label: "Analytics", icon: Activity },
]

interface MobileNavProps {
  activeView: string
  onNavigate: (view: string) => void
}

export function MobileNav({ activeView, onNavigate }: MobileNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm">
      <div className="flex items-center justify-around py-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

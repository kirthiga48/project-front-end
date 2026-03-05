"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { DashboardHeader } from "@/components/dashboard-header"
import { KpiCards } from "@/components/kpi-cards"
import { TrafficChart } from "@/components/traffic-chart"
import { ThreatDistributionChart } from "@/components/threat-distribution-chart"
import { RecentThreats } from "@/components/recent-threats"
import { SeverityGauge } from "@/components/severity-gauge"
import { UploadZone } from "@/components/upload-zone"
import { AiChatbot } from "@/components/ai-chatbot"
import { RemediationPanel } from "@/components/remediation-panel"
import { ThreatLogTable } from "@/components/threat-log-table"
import { AnalyticsView } from "@/components/analytics-view"
import { SettingsView } from "@/components/settings-view"

export default function Page() {
  const [activeView, setActiveView] = useState("dashboard")

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar activeView={activeView} onNavigate={setActiveView} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader activeView={activeView} />

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          <div className="p-4 lg:p-6 space-y-4">
            {activeView === "dashboard" && <DashboardView />}
            {activeView === "upload" && <UploadView />}
            {activeView === "threats" && <ThreatsView />}
            {activeView === "chatbot" && <ChatbotView />}
            {activeView === "analytics" && <AnalyticsView />}
            {activeView === "settings" && <SettingsView />}
          </div>
        </main>
      </div>

      <MobileNav activeView={activeView} onNavigate={setActiveView} />
    </div>
  )
}

function DashboardView() {
  return (
    <>
      <KpiCards />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <TrafficChart />
        </div>
        <div>
          <SeverityGauge />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ThreatDistributionChart />
        <RecentThreats />
      </div>
    </>
  )
}

function UploadView() {
  return (
    <div className="max-w-3xl mx-auto">
      <UploadZone />
    </div>
  )
}

function ThreatsView() {
  return <ThreatLogTable />
}

function ChatbotView() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <AiChatbot />
      <RemediationPanel />
    </div>
  )
}

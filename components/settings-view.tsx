"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Database, Bell, Shield, Globe } from "lucide-react"

export function SettingsView() {
  return (
    <div className="space-y-4 max-w-2xl">
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-semibold text-card-foreground">
              Database Connection
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Host</Label>
              <Input defaultValue="db.sentinel-ai.internal" className="h-8 text-xs bg-secondary border-border text-card-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Port</Label>
              <Input defaultValue="5432" className="h-8 text-xs bg-secondary border-border text-card-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Database</Label>
              <Input defaultValue="sentinel_threats" className="h-8 text-xs bg-secondary border-border text-card-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Username</Label>
              <Input defaultValue="sentinel_admin" className="h-8 text-xs bg-secondary border-border text-card-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-md bg-threat-safe/10">
            <div className="w-2 h-2 rounded-full bg-threat-safe" />
            <span className="text-xs text-threat-safe">Connected to PostgreSQL 16.2</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-semibold text-card-foreground">
              Alert Configuration
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-card-foreground">Critical Threat Alerts</p>
              <p className="text-xs text-muted-foreground">Email and Slack notifications for critical threats</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-card-foreground">DDoS Auto-Response</p>
              <p className="text-xs text-muted-foreground">Automatically apply rate limiting during detected attacks</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-card-foreground">Phishing Quarantine</p>
              <p className="text-xs text-muted-foreground">Auto-quarantine emails flagged as phishing</p>
            </div>
            <Switch />
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-card-foreground">Weekly Digest</p>
              <p className="text-xs text-muted-foreground">Send weekly threat summary to security team</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-semibold text-card-foreground">
              ML Model Configuration
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Detection Threshold</Label>
              <Input defaultValue="0.85" type="number" step="0.01" className="h-8 text-xs bg-secondary border-border text-card-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Model Version</Label>
              <Input defaultValue="v3.2.1-stable" readOnly className="h-8 text-xs bg-secondary border-border text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-card-foreground">Auto-retrain on New Data</p>
              <p className="text-xs text-muted-foreground">Retrain model weekly with new threat data</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-semibold text-card-foreground">
              API & Integrations
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">API Key</Label>
            <Input defaultValue="sk-sentinel-xxxx-xxxx-xxxx" type="password" className="h-8 text-xs bg-secondary border-border text-card-foreground font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Webhook URL</Label>
            <Input defaultValue="https://hooks.slack.com/services/xxx" className="h-8 text-xs bg-secondary border-border text-card-foreground font-mono" />
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/80 text-xs h-8">
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

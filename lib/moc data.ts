// Mock data for the cybersecurity dashboard

export type ThreatSeverity = "critical" | "high" | "medium" | "low"
export type ThreatType = "DDoS" | "Phishing" | "Malware" | "Brute Force" | "SQL Injection" | "XSS" | "Port Scan"
export type ThreatStatus = "active" | "mitigated" | "investigating"

export interface ThreatEvent {
  id: string
  timestamp: string
  type: ThreatType
  severity: ThreatSeverity
  sourceIP: string
  destinationIP: string
  description: string
  status: ThreatStatus
  confidence: number
  packetsAnalyzed: number
}

export interface TrafficData {
  time: string
  requests: number
  threats: number
  blocked: number
}

export interface ThreatDistribution {
  type: string
  count: number
  fill: string
}

export const threatEvents: ThreatEvent[] = [
  {
    id: "THR-001",
    timestamp: "2026-03-05T14:32:00Z",
    type: "DDoS",
    severity: "critical",
    sourceIP: "192.168.45.102",
    destinationIP: "10.0.0.5",
    description: "Volumetric DDoS attack detected. 2.4 Gbps traffic spike from botnet cluster targeting primary DNS server.",
    status: "active",
    confidence: 97.3,
    packetsAnalyzed: 1_482_903,
  },
  {
    id: "THR-002",
    timestamp: "2026-03-05T13:18:00Z",
    type: "Phishing",
    severity: "high",
    sourceIP: "203.0.113.42",
    destinationIP: "10.0.1.15",
    description: "Spear-phishing email campaign detected targeting finance department. Malicious links found in 23 emails.",
    status: "investigating",
    confidence: 94.1,
    packetsAnalyzed: 342_567,
  },
  {
    id: "THR-003",
    timestamp: "2026-03-05T12:47:00Z",
    type: "Brute Force",
    severity: "high",
    sourceIP: "198.51.100.78",
    destinationIP: "10.0.2.3",
    description: "SSH brute force attempt detected. 15,000+ login attempts in 10 minutes from single source.",
    status: "mitigated",
    confidence: 99.2,
    packetsAnalyzed: 89_234,
  },
  {
    id: "THR-004",
    timestamp: "2026-03-05T11:05:00Z",
    type: "SQL Injection",
    severity: "critical",
    sourceIP: "172.16.0.99",
    destinationIP: "10.0.3.8",
    description: "Automated SQL injection attack on customer portal. Multiple payloads targeting user authentication endpoints.",
    status: "mitigated",
    confidence: 96.8,
    packetsAnalyzed: 567_890,
  },
  {
    id: "THR-005",
    timestamp: "2026-03-05T10:22:00Z",
    type: "Malware",
    severity: "medium",
    sourceIP: "10.0.4.12",
    destinationIP: "45.33.32.156",
    description: "Outbound C2 communication detected from internal workstation. Possible trojan activity.",
    status: "investigating",
    confidence: 87.5,
    packetsAnalyzed: 234_567,
  },
  {
    id: "THR-006",
    timestamp: "2026-03-05T09:15:00Z",
    type: "Port Scan",
    severity: "low",
    sourceIP: "192.168.1.200",
    destinationIP: "10.0.0.0/24",
    description: "Internal network reconnaissance scan detected. Full TCP port scan across subnet.",
    status: "mitigated",
    confidence: 92.1,
    packetsAnalyzed: 45_678,
  },
  {
    id: "THR-007",
    timestamp: "2026-03-05T08:50:00Z",
    type: "XSS",
    severity: "medium",
    sourceIP: "203.0.113.55",
    destinationIP: "10.0.3.8",
    description: "Reflected XSS attempt on search endpoint. Encoded JavaScript payload detected in query parameters.",
    status: "mitigated",
    confidence: 91.4,
    packetsAnalyzed: 12_345,
  },
  {
    id: "THR-008",
    timestamp: "2026-03-05T07:33:00Z",
    type: "Phishing",
    severity: "medium",
    sourceIP: "198.51.100.200",
    destinationIP: "10.0.1.20",
    description: "Bulk phishing emails detected with cloned login page. 8 users clicked malicious links.",
    status: "investigating",
    confidence: 89.7,
    packetsAnalyzed: 156_789,
  },
]

export const trafficTimeline: TrafficData[] = [
  { time: "00:00", requests: 1200, threats: 3, blocked: 2 },
  { time: "01:00", requests: 980, threats: 1, blocked: 1 },
  { time: "02:00", requests: 750, threats: 0, blocked: 0 },
  { time: "03:00", requests: 620, threats: 2, blocked: 2 },
  { time: "04:00", requests: 540, threats: 1, blocked: 1 },
  { time: "05:00", requests: 890, threats: 0, blocked: 0 },
  { time: "06:00", requests: 1450, threats: 4, blocked: 3 },
  { time: "07:00", requests: 2100, threats: 7, blocked: 6 },
  { time: "08:00", requests: 3400, threats: 12, blocked: 10 },
  { time: "09:00", requests: 4200, threats: 18, blocked: 15 },
  { time: "10:00", requests: 4800, threats: 24, blocked: 22 },
  { time: "11:00", requests: 5200, threats: 31, blocked: 28 },
  { time: "12:00", requests: 4900, threats: 15, blocked: 14 },
  { time: "13:00", requests: 5100, threats: 22, blocked: 19 },
  { time: "14:00", requests: 8500, threats: 45, blocked: 41 },
  { time: "15:00", requests: 6200, threats: 28, blocked: 25 },
  { time: "16:00", requests: 5800, threats: 19, blocked: 17 },
  { time: "17:00", requests: 4300, threats: 11, blocked: 9 },
  { time: "18:00", requests: 3200, threats: 8, blocked: 7 },
  { time: "19:00", requests: 2800, threats: 5, blocked: 4 },
  { time: "20:00", requests: 2200, threats: 3, blocked: 3 },
  { time: "21:00", requests: 1800, threats: 2, blocked: 2 },
  { time: "22:00", requests: 1500, threats: 1, blocked: 1 },
  { time: "23:00", requests: 1300, threats: 2, blocked: 2 },
]

export const threatDistribution: ThreatDistribution[] = [
  { type: "DDoS", count: 34, fill: "var(--color-chart-5)" },
  { type: "Phishing", count: 28, fill: "var(--color-chart-4)" },
  { type: "Brute Force", count: 19, fill: "var(--color-chart-1)" },
  { type: "SQL Injection", count: 12, fill: "var(--color-chart-3)" },
  { type: "Malware", count: 8, fill: "var(--color-chart-2)" },
  { type: "XSS", count: 6, fill: "var(--color-chart-1)" },
  { type: "Port Scan", count: 5, fill: "var(--color-muted-foreground)" },
]

export const kpiStats = {
  totalThreats: 112,
  threatsBlocked: 98,
  activeIncidents: 3,
  avgResponseTime: "1.2s",
  packetsScanned: "48.2M",
  modelAccuracy: 96.7,
}

export interface RemediationSuggestion {
  id: string
  threatId: string
  title: string
  description: string
  priority: ThreatSeverity
  steps: string[]
  automated: boolean
}

export const remediations: RemediationSuggestion[] = [
  {
    id: "REM-001",
    threatId: "THR-001",
    title: "Mitigate DDoS Volume Attack",
    description: "Activate rate limiting and traffic scrubbing for the targeted DNS server.",
    priority: "critical",
    steps: [
      "Enable upstream DDoS protection (Cloudflare/AWS Shield)",
      "Apply rate-limit rules: max 100 req/s per IP on port 53",
      "Blackhole traffic from identified botnet IPs",
      "Scale DNS infrastructure horizontally",
      "Monitor for traffic pattern changes"
    ],
    automated: true,
  },
  {
    id: "REM-002",
    threatId: "THR-002",
    title: "Neutralize Phishing Campaign",
    description: "Quarantine suspicious emails and block sender domains.",
    priority: "high",
    steps: [
      "Quarantine all emails from sender domain",
      "Block malicious URLs at proxy level",
      "Reset credentials for users who clicked links",
      "Deploy additional email filtering rules",
      "Send security awareness notification to all staff"
    ],
    automated: false,
  },
  {
    id: "REM-003",
    threatId: "THR-004",
    title: "Patch SQL Injection Vulnerability",
    description: "Apply input sanitization and WAF rules to the customer portal.",
    priority: "critical",
    steps: [
      "Deploy WAF rule to block SQLi patterns on affected endpoints",
      "Review and parameterize all database queries",
      "Enable prepared statements across the application",
      "Conduct code review of authentication module",
      "Run automated security scan post-fix"
    ],
    automated: true,
  },
]

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export const initialChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content: "Welcome to SentinelAI Assistant. I can help you analyze threat patterns, query network logs, and provide remediation guidance. What would you like to investigate?",
    timestamp: new Date().toISOString(),
  },
]

"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Shield,
  X,
  Brain,
  Loader2,
} from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: string
  status: "uploading" | "analyzing" | "complete"
  progress: number
  threats: number
  clean: number
}

const simulatedResults = [
  { threats: 12, clean: 4520 },
  { threats: 3, clean: 8912 },
  { threats: 0, clean: 2340 },
  { threats: 7, clean: 15430 },
]

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const simulateUpload = useCallback((fileName: string, fileSize: number) => {
    const id = crypto.randomUUID()
    const sizeStr = fileSize > 1_000_000
      ? `${(fileSize / 1_000_000).toFixed(1)} MB`
      : `${(fileSize / 1_000).toFixed(0)} KB`

    const result = simulatedResults[Math.floor(Math.random() * simulatedResults.length)]

    const newFile: UploadedFile = {
      id,
      name: fileName,
      size: sizeStr,
      status: "uploading",
      progress: 0,
      threats: result.threats,
      clean: result.clean,
    }

    setFiles((prev) => [newFile, ...prev])

    // Simulate upload progress
    let progress = 0
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 25 + 10
      if (progress >= 100) {
        progress = 100
        clearInterval(uploadInterval)
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, status: "analyzing", progress: 100 } : f
          )
        )

        // Simulate analysis
        setTimeout(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id ? { ...f, status: "complete" } : f
            )
          )
        }, 2000 + Math.random() * 2000)
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, progress: Math.min(progress, 100) } : f
          )
        )
      }
    }, 300)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFiles = Array.from(e.dataTransfer.files)
      droppedFiles.forEach((f) => simulateUpload(f.name, f.size))
    },
    [simulateUpload]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      selectedFiles.forEach((f) => simulateUpload(f.name, f.size))
    },
    [simulateUpload]
  )

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-card-foreground">
            Upload Network Traffic Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "relative flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer",
              isDragging
                ? "border-primary bg-primary/5 shadow-[0_0_30px_var(--glow-cyan)]"
                : "border-border hover:border-muted-foreground/30 hover:bg-secondary/30"
            )}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Drop zone for network log files"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pcap,.csv,.log,.json,.txt,.xml,.pcapng"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className={cn(
              "flex items-center justify-center w-16 h-16 rounded-2xl transition-colors",
              isDragging ? "bg-primary/15" : "bg-secondary"
            )}>
              <Upload className={cn(
                "w-7 h-7 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-card-foreground">
                {isDragging ? "Release to upload" : "Drag and drop your log files here"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports PCAP, CSV, JSON, LOG, XML, TXT files up to 500MB
              </p>
            </div>
            <Button variant="outline" size="sm" className="mt-2 border-border text-card-foreground">
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-card-foreground">
                Analysis Queue
              </CardTitle>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                {files.filter((f) => f.status === "complete").length}/{files.length} complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary shrink-0">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-card-foreground truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{file.size}</span>
                    </div>

                    {file.status === "uploading" && (
                      <div className="space-y-1">
                        <Progress value={file.progress} className="h-1.5" />
                        <p className="text-xs text-muted-foreground">Uploading... {Math.round(file.progress)}%</p>
                      </div>
                    )}

                    {file.status === "analyzing" && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 text-primary animate-spin" />
                        <div className="flex items-center gap-1.5">
                          <Brain className="w-3 h-3 text-primary" />
                          <span className="text-xs text-primary">ML model analyzing traffic patterns...</span>
                        </div>
                      </div>
                    )}

                    {file.status === "complete" && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-threat-safe" />
                          <span className="text-xs text-threat-safe">{file.clean.toLocaleString()} clean</span>
                        </div>
                        {file.threats > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-threat-critical" />
                            <span className="text-xs text-threat-critical">{file.threats} threats found</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Shield className="w-3 h-3 text-threat-safe" />
                            <span className="text-xs text-threat-safe">No threats detected</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(file.id)
                    }}
                    className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-card-foreground transition-colors shrink-0"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-card-foreground mb-1">ML Analysis Pipeline</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Files are processed through our multi-model pipeline: packet inspection, anomaly detection (Isolation Forest), 
                signature-based matching, and deep learning classification for DDoS, phishing, malware, and intrusion patterns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

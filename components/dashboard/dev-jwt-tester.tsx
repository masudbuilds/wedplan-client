"use client"

import * as React from "react"
import { toast } from "sonner"
import { KeyRound, Send, Check, Copy, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { apiFetch } from "@/lib/api"

export function DevJwtTester() {
  const [token, setToken] = React.useState<string | null>(null)
  const [isTokenLoading, setIsTokenLoading] = React.useState(false)
  const [testStatus, setTestStatus] = React.useState<string | null>(null)
  const [isTesting, setIsTesting] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)

  const fetchToken = async () => {
    setIsTokenLoading(true)
    try {
      const res = await authClient.token()
      if (res.data?.token) {
        setToken(res.data.token)
      } else {
        setToken(null)
      }
    } catch {
      setToken(null)
    } finally {
      setIsTokenLoading(false)
    }
  }

  React.useEffect(() => {
    fetchToken()
  }, [])

  const copyToken = () => {
    if (!token) return
    navigator.clipboard.writeText(token)
    setCopied(true)
    toast.success("JWT token copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTestApi = async () => {
    setIsTesting(true)
    setTestStatus("Sending request with Bearer token...")

    try {
      // apiFetch will automatically attach Authorization: Bearer <token>
      const res = await apiFetch("/me")

      if (res.error) {
        setTestStatus(`Response: ${res.error} (Note: Express backend may not be running yet)`)
      } else {
        setTestStatus(`Success (200 OK): ${JSON.stringify(res.data)}`)
        toast.success("Express backend verified JWT token successfully!")
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection failed"
      setTestStatus(`Backend offline or unreachable (${msg}). Ready for Express server.`)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <Card className="border-dashed border-primary/30 bg-blush/20 text-xs">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-primary" />
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-primary">
            Developer Helper: Better Auth JWT & Express Verifier
          </CardTitle>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1 text-[11px]"
        >
          {isExpanded ? (
            <>
              Hide details <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Show details <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </CardHeader>

      {isExpanded && (
        <CardContent className="px-4 pb-4 space-y-3 pt-0 border-t border-primary/10">
          <p className="text-muted-foreground">
            The Express server will verify this token using JWKS at{" "}
            <code className="text-primary font-mono text-[11px]">
              http://localhost:3000/api/auth/jwks
            </code>
            .
          </p>

          {/* Token Display */}
          <div className="space-y-1">
            <span className="font-semibold text-foreground">Current JWT Token:</span>
            {isTokenLoading ? (
              <p className="text-muted-foreground">Fetching session token...</p>
            ) : token ? (
              <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border">
                <code className="font-mono text-[10px] truncate flex-1 text-muted-foreground">
                  {token}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyToken}
                  className="h-6 px-2 text-[10px]"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                No active JWT session token found. Sign in first to generate a token.
              </p>
            )}
          </div>

          {/* API Verification Button */}
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isTesting || !token}
              onClick={handleTestApi}
              className="h-7 text-xs rounded-full"
            >
              {isTesting ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
              ) : (
                <Send className="w-3 h-3 mr-1.5" />
              )}
              Test Express Verification (GET /api/me)
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={fetchToken}
              className="h-7 text-xs rounded-full"
            >
              Refresh Token
            </Button>
          </div>

          {testStatus && (
            <div className="p-2.5 rounded-lg bg-card border border-border text-[11px] font-mono text-muted-foreground break-all">
              {testStatus}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

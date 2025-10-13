"use client"
import { useEffect, useState } from "react"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL 

type Report = {
  id: number
  title: string
  vulnerability_type: string
  severity: "low" | "medium" | "high" | "critical"
  status: "pending" | "approved" | "rejected"
  points: number
  submitted_at: string
  reviewed_at: string | null
  feedback: string | null
}

const severityColors: { [key: string]: string } = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const statusConfig: { [key: string]: { icon: any; color: string; label: string } } = {
  pending: {
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    label: "Pending Review",
  },
  approved: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    label: "Approved",
  },
  rejected: {
    icon: XCircle,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    label: "Rejected",
  },
}

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`${API_URL}/api/reports/reportsPage`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch reports")
        }

        const data = await res.json()
        setReports(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])
  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>

  // stats
  const totalPoints = reports.filter((r) => r.status === "approved").reduce((sum, r) => sum + r.points, 0)
  const approvedReports = reports.filter((r) => r.status === "approved").length
  const pendingReports = reports.filter((r) => r.status === "pending").length

  return (
    <div className="min-h-screen flex flex-col">
     
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Reports</h1>
              <p className="text-muted-foreground">Track your submitted vulnerability reports and earned points</p>
            </div>
            <Button asChild>
              <Link href="/users/reports/submit">
                <FileText className="h-4 w-4 mr-2" />
                Submit New Report
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                    <p className="text-2xl font-bold text-primary">{totalPoints}</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved Reports</p>
                    <p className="text-2xl font-bold text-green-600">{approvedReports}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingReports}</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {reports.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reports yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by exploitating and submitting your first vulnerability report.
                  </p>
                </CardContent>
              </Card>
            ) : (
              reports.map((report) => {
                const StatusIcon = statusConfig[report.status].icon
                return (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{report.title}</CardTitle>
                       
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={statusConfig[report.status].color} variant="secondary">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[report.status].label}
                          </Badge>
                          {report.status === "approved" && <Badge variant="outline">+{report.points} pts</Badge>}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm">
                          <span className="font-medium mr-2">Vulnerability:</span>
                          <span>{report.vulnerability_type}</span>
                        </div>

                        <div className="flex items-center text-sm">
                          <span className="font-medium mr-2">Severity:</span>
                          <Badge className={severityColors[report.severity]} variant="secondary">
                            {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                          </Badge>
                        </div>

                        <div className="flex items-center text-sm">
                          <span className="font-medium mr-2">Submitted:</span>
                          <span>{new Date(report.submitted_at).toLocaleDateString()}</span>
                        </div>

                        {report.reviewed_at && (
                          <div className="flex items-center text-sm">
                            <span className="font-medium mr-2">Reviewed:</span>
                            <span>{new Date(report.reviewed_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {report.feedback && (
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium mb-1">Instructor Feedback:</p>
                              <p className="text-sm text-muted-foreground">{report.feedback}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

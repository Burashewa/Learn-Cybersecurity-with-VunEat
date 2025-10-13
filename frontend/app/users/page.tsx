"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Calendar, Trophy, FileText } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL 

const severityColors: { [key: string]: string } = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const statusColors: { [key: string]: string } = {
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

interface Report {
  id: string
  title: string
  severity: string
  status: string
  points: number
  submittedAt: string
}

interface Stats {
  total_points: number
  reports_submitted: number
  reports_approved: number
}

interface UserData {
  user: {
    username: string
    email: string
    created_at: string
  }
  stats: Stats
  recentReports: Report[]
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [dashboardData, setDashboardData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchDashboard = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("No authentication token found. Please log in again.")
          setLoading(false)
          return
        }

        const res = await fetch(`${API_URL}/api/users/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          const errText = await res.text()
          throw new Error(`Failed to fetch dashboard data: ${errText}`)
        }

        const rawData = await res.json()

        const data: UserData = {
          ...rawData,
          recentReports: rawData.recentReports.map((r: any) => ({
            ...r,
            submittedAt: r.submitted_at,
          })),
        }

        setDashboardData(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Error fetching dashboard")
      } finally {
        setLoading(false)
      }
    }


    fetchDashboard()
  }, [isAuthenticated])

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>
  if (!dashboardData) return null

  const { user: userInfo, stats, recentReports } = dashboardData

  return (
    <div className="p-8 bg-muted/5 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Welcome back, {userInfo.username} 👋</h1>
          <p className="text-muted-foreground">Here’s an overview of your activity and reports.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* User Info Card */}
          <Card className="lg:col-span-1 shadow-sm hover:shadow-md transition">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarFallback className="text-xl font-bold">
                    {userInfo.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-semibold mb-1">{userInfo.username}</h2>
                <div className="w-full space-y-2 text-sm">
                  <div className="flex items-center justify-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{userInfo.email}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Joined {new Date(userInfo.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="lg:col-span-3 grid md:grid-cols-3 gap-6">
            <Card className="shadow-sm hover:shadow-md transition">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                    <p className="text-2xl font-bold text-primary">{stats.total_points}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reports Submitted</p>
                    <p className="text-2xl font-bold text-primary">{stats.reports_submitted}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved Reports</p>
                    <p className="text-2xl font-bold text-primary">{stats.reports_approved}</p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reports Section */}
        <div className="mt-10">
          <Card className="shadow-sm hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="text-xl">Submitted Reports</CardTitle>
              <CardDescription className="text-sm">
                Track and manage your vulnerability reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentReports.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  You haven’t submitted any reports yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{report.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={severityColors[report.severity]} variant="secondary">
                            {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                          </Badge>
                          <Badge className={statusColors[report.status]} variant="secondary">
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">
                          {new Date(report.submittedAt).toLocaleDateString()}
                        </div>
                        {report.status === "approved" && (
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            +{report.points} pts
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

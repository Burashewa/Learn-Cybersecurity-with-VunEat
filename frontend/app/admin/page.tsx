"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Users, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import { Bar } from "react-chartjs-2"
import Link from "next/link"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [pendingReports, setPendingReports] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [chartData, setChartData] = useState<any>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // ✅ Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` }

        const [statsRes, pendingRes, leaderboardRes, usersRes, analyticsRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/dashboard-stats`, { headers }),
          fetch(`${API_URL}/api/admin/pending-reports`, { headers }),
          fetch(`${API_URL}/api/admin/leaderboard`, { headers }),
          fetch(`${API_URL}/api/admin/users`, { headers }),
          fetch(`${API_URL}/api/admin/analytics/reports`, { headers }),
        ])

        const stats = await statsRes.json()
        const pending = await pendingRes.json()
        const leaders = await leaderboardRes.json()
        const userList = await usersRes.json()
        const analytics = await analyticsRes.json()

        setDashboardStats(stats)
        setPendingReports(pending)
        setLeaderboard(leaders)
        setUsers(userList)

        // ✅ Prepare chart data dynamically
        setChartData({
          labels: analytics.map((d: any) => d.month),
          datasets: [
            {
              label: "Reports Submitted",
              data: analytics.map((d: any) => d.total),
              backgroundColor: "rgba(34,197,94,0.7)",
            },
            {
              label: "Reports Approved",
              data: analytics.map((d: any) => d.approved),
              backgroundColor: "rgba(59,130,246,0.7)",
            },
          ],
        })

        setLoading(false)
      } catch (err) {
        console.error("Error loading dashboard data", err)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // ✅ Handle approve/reject report
  // const handleReportAction = async (id: string, status: string) => {
  //   try {
  //     const res = await fetch(`${API_URL}/admin/report/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ status }),
  //     })
  //     if (res.ok) {
  //       setPendingReports((prev) => prev.filter((r) => r.id !== id))
  //     }
  //   } catch (error) {
  //     console.error("Error updating report:", error)
  //   }
  // }

  // ✅ Toggle user status
  // const toggleUserStatus = async (id: number) => {
  //   try {
  //     const res = await fetch(`${API_URL}/admin/users/${id}/toggle`, {
  //       method: "PUT",
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     const data = await res.json()
  //     if (res.ok) {
  //       setUsers((prev) =>
  //         prev.map((u) => (u.id === id ? { ...u, status: data.newStatus } : u))
  //       )
  //     }
  //   } catch (err) {
  //     console.error("Error toggling user status", err)
  //   }
  // }

  // ✅ Chart config
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Reports Overview (Monthly)" },
    },
  }

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading admin dashboard...</p>
  }

  return (
    <div className="flex-1 p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of VunEat platform activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-primary">{dashboardStats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Reports</p>
              <p className="text-2xl font-bold text-yellow-600">{dashboardStats.pendingReports}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
              <p className="text-2xl font-bold text-primary">{dashboardStats.totalReports}</p>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Pending Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
              <CardDescription>Reports awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingReports.length === 0 ? (
                  <p className="text-center text-muted-foreground">No pending reports</p>
                ) : (
                  pendingReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{report.title}</h4>
                        <p className="text-xs text-muted-foreground">by {report.student}</p>
                        <Badge
                          variant="secondary"
                          className={`mt-1 text-xs ${
                            report.severity === "critical"
                              ? "bg-red-100 text-red-800"
                              : report.severity === "high"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {report.severity}
                        </Badge>
                      </div>
                      {/* <div className="flex space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/reports/${report.id}`}>
                            <Eye className="h-3 w-3" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleReportAction(report.id, "approved")}>
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleReportAction(report.id, "rejected")}>
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div> */}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>


        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Reports Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Reports Analytics</CardTitle>
              <CardDescription>Monthly report trends</CardDescription>
            </CardHeader>
            <CardContent>{chartData && <Bar data={chartData} options={chartOptions} />}</CardContent>
          </Card>


          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard Summary</CardTitle>
              <CardDescription>Top performing students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((student, index) => (
                  <div key={student.username} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <span className="text-sm">{student.username}</span>
                    </div>
                    <span className="text-sm font-medium text-primary">{student.total_points} pts</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          {/* <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">
                        {user.username} ({user.role})
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={user.status === "active" ? "outline" : "destructive"}
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  )
}

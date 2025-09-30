"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Users, Clock, CheckCircle, XCircle, Eye} from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import Link from "next/link"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Dashboard stats
const dashboardStats = {
  totalUsers: 156,
  pendingReports: 8,
  totalReports: 45,
}

// Pending reports sample data
const pendingReports = [
  {
    id: "1",
    title: "SQL Injection in Login Form",
    student: "CyberNinja",
    severity: "high",
    submittedAt: "2024-01-18T16:45:00Z",
  },
  {
    id: "2",
    title: "Reflected XSS via Search",
    student: "HackMaster",
    severity: "medium",
    submittedAt: "2024-01-17T14:30:00Z",
  },
  {
    id: "3",
    title: "CSRF Token Bypass",
    student: "SecureCode",
    severity: "critical",
    submittedAt: "2024-01-16T10:15:00Z",
  },
]

// Top students leaderboard
const topStudents = [
  { username: "CyberNinja", points: 420 },
  { username: "HackMaster", points: 380 },
  { username: "SecureCode", points: 340 },
]

// Sample users for User Management
const sampleUsers = [
  { id: 1, username: "CyberNinja", email: "cyberninja@test.com", role: "user", status: "active" },
  { id: 2, username: "HackMaster", email: "hackmaster@test.com", role: "admin", status: "active" },
  { id: 3, username: "SecureCode", email: "securecode@test.com", role: "user", status: "inactive" },
]

export default function AdminDashboard() {
  const [users, setUsers] = useState(sampleUsers)

  const toggleUserStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "active" ? "inactive" : "active" }
          : user
      )
    )
  }

  // Sample chart data
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Reports Submitted",
        data: [5, 8, 12, 7, 10, 15],
        backgroundColor: "rgba(34,197,94,0.7)",
      },
      {
        label: "Reports Approved",
        data: [3, 6, 10, 5, 7, 12],
        backgroundColor: "rgba(59,130,246,0.7)",
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Reports Overview (Monthly)",
      },
    },
  }

  return (
    <div className="flex-1 p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of VunEat platform activity
        </p>
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
        {/* Left Column: Pending Reports + Leaderboard */}
        <div className="space-y-6">
          
          {/* Pending Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
              <CardDescription>Reports awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
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
                    <div className="flex space-x-2">
                      {/* 👁 View details */}
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/reports/${report.id}`}>
                          <Eye className="h-3 w-3" />
                        </Link>
                      </Button>
                      {/* ✔ Approve */}
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                      {/* ✖ Reject */}
                      <Button size="sm" variant="outline">
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle>Leaderboard Summary</CardTitle>
              <CardDescription>Top performing students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topStudents.map((student, index) => (
                  <div key={student.username} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <span className="text-sm">{student.username}</span>
                    </div>
                    <span className="text-sm font-medium text-primary">{student.points} pts</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Analytics + User Management */}
        <div className="space-y-6">
          {/* Analytics Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Reports Analytics</CardTitle>
              <CardDescription>Monthly report trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Bar data={chartData} options={chartOptions} />
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{user.username} ({user.role})</p>
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
          </Card>
        </div>
      </div>
    </div>
  )
}

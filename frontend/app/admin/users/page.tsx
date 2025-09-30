"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, UserCheck, UserX, Award, Eye, Shield, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Sample users data
const usersData = [
  {
    id: "1",
    username: "CyberNinja",
    email: "cyberninja@example.com",
    totalPoints: 420,
    reportsSubmitted: 12,
    joinDate: "2024-01-10T00:00:00Z",
    status: "active",
  },
  {
    id: "2",
    username: "HackMaster",
    email: "hackmaster@example.com",
    totalPoints: 380,
    reportsSubmitted: 11,
    joinDate: "2024-01-12T00:00:00Z",
    status: "active",
  },
  {
    id: "3",
    username: "SecureCode",
    email: "securecode@example.com",
    totalPoints: 340,
    reportsSubmitted: 9,
    joinDate: "2024-01-15T00:00:00Z",
    status: "inactive",
  },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState(usersData)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [pointsAdjustment, setPointsAdjustment] = useState("")

  const handleView = (id: string) => {
    const user = users.find((u) => u.id === id)
    if (user) alert(`Viewing details for ${user.username}\nEmail: ${user.email}`)
  }

  const handleAdjustPoints = (userId: string, adjustment: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, totalPoints: Math.max(0, user.totalPoints + adjustment) } : user,
      ),
    )
    setSelectedUser(null)
    setPointsAdjustment("")
  }

  const toggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
  }

  const resetPassword = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (user) alert(`Password reset link sent to ${user.email}`)
  }

  const activeUsers = users.filter((u) => u.status === "active").length
  const inactiveUsers = users.filter((u) => u.status === "inactive").length
  const totalPoints = users.reduce((sum, user) => sum + user.totalPoints, 0)

  const columns = [
    {
      key: "username",
      label: "User",
      render: (u: any) => (
        <div>
          <p className="font-medium">{u.username}</p>
          <p className="text-xs text-muted-foreground">{u.email}</p>
        </div>
      ),
    },
    { key: "totalPoints", label: "Points" },
    { key: "reportsSubmitted", label: "Reports" },
    {
      key: "status",
      label: "Status",
      render: (u: any) => (
        <Badge
          className={
            u.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        >
          {u.status}
        </Badge>
      ),
    },
    { key: "joinDate", label: "Joined" },
    {
      key: "actions",
      label: "Actions",
      render: (u: any) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => handleView(u.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setSelectedUser(u.id)}>
            Adjust Points
          </Button>
          <Button size="sm" variant="outline" onClick={() => toggleStatus(u.id)}>
            {u.status === "active" ? "Deactivate" : "Activate"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => resetPassword(u.id)}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex-1 p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage student accounts, points, and permissions</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-primary">{users.length}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inactive Users</p>
                <p className="text-2xl font-bold text-red-600">{inactiveUsers}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold text-primary">{totalPoints}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Point Adjustment */}
      {selectedUser && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Adjust Points</CardTitle>
            <CardDescription>Manually adjust points for selected user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                placeholder="Enter point adjustment (+/-)"
                value={pointsAdjustment}
                onChange={(e) => setPointsAdjustment(e.target.value)}
                className="w-48"
              />
              <Button
                onClick={() => handleAdjustPoints(selectedUser, Number.parseInt(pointsAdjustment) || 0)}
                disabled={!pointsAdjustment}
              >
                Apply Adjustment
              </Button>
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Accounts</CardTitle>
          <CardDescription>Manage student accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={users} searchable={true} />
        </CardContent>
      </Card>
    </div>
  )
}

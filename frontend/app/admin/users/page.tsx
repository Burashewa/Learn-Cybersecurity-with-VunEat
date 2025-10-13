"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, UserCheck, UserX, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type User = {
  id: number
  username: string
  email: string
  totalPoints: number
  reportsSubmitted: number
  joinDate: string
  status: "active" | "inactive"
  is_admin: boolean
}

function DataTable({ columns, data, searchable }: { columns: any[], data: any[], searchable?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-background shadow-sm">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-muted/50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="border-b border-border px-4 py-2 text-left text-sm font-medium text-muted-foreground"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) &&
            data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border hover:bg-muted/30 transition-colors duration-150"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-sm text-foreground">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [pointsAdjustment, setPointsAdjustment] = useState("")
  const [loading, setLoading] = useState(false)

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const data = await res.json()

      if (Array.isArray(data)) {
        setUsers(data)
      } else if (Array.isArray(data.users)) {
        setUsers(data.users)
      } else {
        console.error("Invalid users response:", data)
        setUsers([])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAdjustPoints = async (userId: number) => {
    try {
      const adjustment = parseInt(pointsAdjustment)
      if (isNaN(adjustment)) return alert("Enter a valid number")

      const res = await fetch(`${API_URL}/api/admin/users/${userId}/adjust-points`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ adjustment }),
      })

      const result = await res.json()
      if (res.ok) {
        alert(result.message || "Points adjusted successfully")
        fetchUsers()
      } else {
        alert(result.message || "Failed to adjust points")
      }

      setSelectedUser(null)
      setPointsAdjustment("")
    } catch (error) {
      console.error("Error adjusting points:", error)
    }
  }

  const handleToggleStatus = async (userId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/toggle-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const result = await res.json()
      if (res.ok) {
        await fetchUsers()
      } else {
        alert(result.message || "Failed to toggle status")
      }
    } catch (error) {
      console.error("Error toggling user status:", error)
    }
  }

  const handleResetPassword = async (userId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/reset-password`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const data = await res.json()
      alert(data.message)
    } catch (error) {
      console.error("Error resetting password:", error)
    }
  }

  // Safeguard: Ensure users is always an array
  const safeUsers = Array.isArray(users) ? users : []

  const activeUsers = safeUsers.filter((u) => u.status === "active").length
  const inactiveUsers = safeUsers.filter((u) => u.status === "inactive").length
  const totalPoints = safeUsers.reduce(
    (sum, u) => Number(sum) + Number(u.totalPoints || 0),
    0
  )

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
        <div className="flex gap-2">
          <button
            onClick={() => handleToggleStatus(u.id)}
            className={`px-3 py-1 rounded text-white ${
              u.status === "active" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {u.status === "active" ? "Deactivate" : "Activate"}
          </button>

          <button
            onClick={() => handleResetPassword(u.id)}
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Reset Password
          </button>

          <button
            onClick={() => setSelectedUser(u.id)}
            className="px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Adjust Points
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex-1 p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">
          Manage student accounts, points, and permissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-primary">{safeUsers.length}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inactive Users */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Inactive Users
                </p>
                <p className="text-2xl font-bold text-red-600">{inactiveUsers}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Points */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Points
                </p>
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
                onClick={() => handleAdjustPoints(selectedUser)}
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
          {loading ? (
            <p className="text-center text-muted-foreground">Loading users...</p>
          ) : (
            <DataTable columns={columns} data={safeUsers} searchable={true} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

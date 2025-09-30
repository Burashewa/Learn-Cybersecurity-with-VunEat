import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Calendar, Trophy, FileText, Plus } from "lucide-react"
import Link from "next/link"





// Sample user data
const userData = {
  username: "CyberNinja",
  email: "cyberninja@example.com",
  joinDate: "2024-01-10",
  totalPoints: 420,
  reportsSubmitted: 12,
  reportsApproved: 11,
  recentReports: [
    {
      id: "1",
      title: "SQL Injection in Login Form",
      severity: "high",
      status: "approved",
      points: 40,
      submittedAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Reflected XSS via Search Parameter",
      severity: "medium",
      status: "pending",
      points: 0,
      submittedAt: "2024-01-18",
    },
    {
      id: "3",
      title: "CSRF Token Bypass",
      severity: "critical",
      status: "approved",
      points: 70,
      submittedAt: "2024-01-20",
    },
  ],
}

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

export default function DashboardPage() {
  return (
    <div className="p-8 bg-muted/5 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {userData.username} 👋</h1>
            <p className="text-muted-foreground">Here’s an overview of your activity and reports.</p>
          </div>
          {/* <Button asChild size="lg">
            <Link href="/users/reports/submit">
              <Plus className="h-4 w-4 mr-2" />
              Submit New Report
            </Link>
          </Button> */}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* User Info Card */}
          <Card className="lg:col-span-1 shadow-sm hover:shadow-md transition">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarFallback className="text-xl font-bold">
                    {userData.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-semibold mb-1">{userData.username}</h2>
                <div className="w-full space-y-2 text-sm">
                  <div className="flex items-center justify-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{userData.email}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Joined {new Date(userData.joinDate).toLocaleDateString()}</span>
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
                    <p className="text-2xl font-bold text-primary">{userData.totalPoints}</p>
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
                    <p className="text-2xl font-bold text-primary">{userData.reportsSubmitted}</p>
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
                    <p className="text-2xl font-bold text-primary">{userData.reportsApproved}</p>
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
              {userData.recentReports.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  You haven’t submitted any reports yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {userData.recentReports.map((report) => (
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

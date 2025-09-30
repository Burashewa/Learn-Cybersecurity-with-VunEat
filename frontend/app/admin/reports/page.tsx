"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { DataTable } from "@/components/data-table"

// Sample reports data
const reportsData = [
  {
    id: "1",
    title: "SQL Injection in Login Form",
    student: "CyberNinja",
    labName: "SQL Injection Fundamentals",
    vulnerabilityType: "SQL Injection",
    severity: "high",
    status: "pending",
    submittedAt: "2024-01-18T16:45:00Z",
  },
  {
    id: "2",
    title: "Reflected XSS via Search",
    student: "HackMaster",
    labName: "Reflected XSS Attack",
    vulnerabilityType: "XSS",
    severity: "medium",
    status: "approved",
    submittedAt: "2024-01-17T14:30:00Z",
  },
  {
    id: "3",
    title: "CSRF Token Bypass",
    student: "SecureCode",
    labName: "CSRF Token Bypass",
    vulnerabilityType: "CSRF",
    severity: "critical",
    status: "rejected",
    submittedAt: "2024-01-16T10:15:00Z",
  },
]

// columns with severity badge + formatted date
const columns = [
  { key: "title", label: "Report Title" },
  { key: "student", label: "Student" },
  { key: "labName", label: "Lab" },
  {
    key: "severity",
    label: "Severity",
    render: (value: string) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          value === "critical"
            ? "bg-red-100 text-red-800"
            : value === "high"
            ? "bg-orange-100 text-orange-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {value}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (value: string) => (
      <span className="capitalize">{value}</span>
    ),
  },
  {
    key: "submittedAt",
    label: "Submitted",
    render: (value: string) =>
      new Date(value).toLocaleString(),
  },
]

export default function AdminReportsPage() {
  const [reports, setReports] = useState(reportsData)
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<any>(null)

  const handleApprove = (id: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status: "approved" } : report
      )
    )
  }

  const handleReject = (id: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status: "rejected" } : report
      )
    )
  }

  const handleView = (id: string) => {
    const report = reports.find((r) => r.id === id)
    setSelectedReport(report)
  }

  const pendingCount = reports.filter((r) => r.status === "pending").length
  const approvedCount = reports.filter((r) => r.status === "approved").length
  const rejectedCount = reports.filter((r) => r.status === "rejected").length

  const filteredReports =
    statusFilter === "all"
      ? reports
      : reports.filter((r) => r.status === statusFilter)

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Report Management</h1>
        <p className="text-muted-foreground">
          Review and manage student vulnerability reports
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Reports
                </p>
                <p className="text-2xl font-bold text-primary">{reports.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vulnerability Reports</CardTitle>
          <CardDescription>Review and approve student submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredReports}
            actions={{
              view: handleView,
              approve: handleApprove,
              reject: handleReject,
              // show eye icon as well
              // customViewIcon: <Eye className="h-4 w-4" />,
            }}
            searchable={true}
          />
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedReport?.title}</DialogTitle>
            <DialogDescription>Full report details</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-2 text-sm">
              <p><strong>Student:</strong> {selectedReport.student}</p>
              <p><strong>Lab:</strong> {selectedReport.labName}</p>
              <p><strong>Vulnerability:</strong> {selectedReport.vulnerabilityType}</p>
              <p><strong>Severity:</strong> {selectedReport.severity}</p>
              <p><strong>Status:</strong> {selectedReport.status}</p>
              <p><strong>Submitted:</strong> {new Date(selectedReport.submittedAt).toLocaleString()}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

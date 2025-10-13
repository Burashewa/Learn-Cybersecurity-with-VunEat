"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DataTable } from "@/components/data-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const API_URL = process.env.NEXT_PUBLIC_API_URL 

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [feedback, setFeedback] = useState("");
  const [pointInput, setPointInput] = useState(0)

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/reports`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        if (!res.ok) throw new Error("Failed to fetch reports")
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

  const handleView = (id: string) => {
    const report = reports.find((r) => r.id === id)
    setSelectedReport(report)
    setPointInput(report ? report.points : 0)
  }

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/reports/${id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ points: pointInput, feedback }), // ✅ added feedback
      });

      if (!res.ok) throw new Error("Failed to approve report");

      // Update locally
      setReports((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: "approved", points: pointInput, feedback } // ✅ store feedback locally
            : r
        )
      );

      setSelectedReport(null);
      setFeedback(""); // ✅ clear feedback input after action
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/reports/${id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ points: pointInput, feedback }), // ✅ added feedback
      });

      if (!res.ok) throw new Error("Failed to reject report");

      // Update locally
      setReports((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: "rejected", points: pointInput, feedback } // ✅ store feedback locally
            : r
        )
      );

      setSelectedReport(null);
      setFeedback(""); // ✅ clear feedback input after action
    } catch (err) {
      console.error(err);
    }
  };


  const filteredReports =
    statusFilter === "all"
      ? reports
      : reports.filter((r) => r.status === statusFilter)

  const pendingCount = reports.filter((r) => r.status === "pending").length
  const approvedCount = reports.filter((r) => r.status === "approved").length
  const rejectedCount = reports.filter((r) => r.status === "rejected").length

  const columns = [
    { key: "title", label: "Report Title" },
    { key: "student", label: "Student" },
    { key: "vulnerability_type", label: "vulnerability" },
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
      render: (value: string) => <span className="capitalize">{value}</span>,
    },
    {
      key: "submittedAt",
      label: "Submitted",
      render: (value: string) => new Date(value).toLocaleString(),
    },
  ]

  if (loading)
    return (
      <p className="text-center text-muted-foreground mt-10">
        Loading reports...
      </p>
    )

  if (error)
    return (
      <p className="text-center text-red-500 mt-10">
        Error: {error}
      </p>
    )

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Report Management</h1>
        <p className="text-muted-foreground">Review and manage student vulnerability reports</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Reports", value: reports.length, color: "text-primary", icon: FileText },
          { label: "Pending", value: pendingCount, color: "text-yellow-600", icon: Clock },
          { label: "Approved", value: approvedCount, color: "text-green-600", icon: CheckCircle },
          { label: "Rejected", value: rejectedCount, color: "text-red-600", icon: XCircle },
        ].map(({ label, value, color, icon: Icon }, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
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
            }}
            searchable={true}
          />
        </CardContent>
      </Card>

      {/* View Modal */}
      <AnimatePresence>
        {selectedReport && (
          <Dialog open={true} onOpenChange={() => setSelectedReport(null)}>
            <DialogContent>
              <motion.div
                key="modal"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 80 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="rounded-xl shadow-lg p-6 max-h-[85vh] overflow-y-auto"
              >
                <DialogHeader>
                  <DialogTitle>{selectedReport.title}</DialogTitle>
                  <DialogDescription>Full report details</DialogDescription>
                </DialogHeader>

                <div className="space-y-2 text-sm">
                  <p><strong>Student:</strong> {selectedReport.student}</p>
                  <p><strong>Title:</strong> {selectedReport.title}</p>
                  <p><strong>Vulnerability:</strong> {selectedReport.vulnerability_type}</p>
                  <p><strong>Severity:</strong> {selectedReport.severity}</p>
                  <p><strong>Status:</strong> {selectedReport.status}</p>
                  <p><strong>Submitted:</strong> {new Date(selectedReport.submittedAt).toLocaleString()}</p>

                  <div className="my-4">
                    <label><strong>Show Full Report:</strong></label>
                    <iframe
                      src={selectedReport.pdfUrl}
                      title="Report PDF"
                      className="w-full h-[350px] border border-gray-200 rounded-lg mt-2"
                    />
                    <a href={selectedReport.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      Open PDF in new tab
                    </a>
                  </div>

                  <div className="my-4">
                    <label><strong>Points:</strong></label>
                    <Input
                      type="number"
                      value={pointInput}
                      onChange={(e) => setPointInput(Number(e.target.value))}
                      placeholder="Enter points"
                      className="w-24 inline-block ml-3"
                    />
                  </div>

                  <div className="my-4">
                    <label htmlFor="feedback" className="block font-semibold mb-1">
                      Feedback:
                    </label>
                    <textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Write your feedback for the student..."
                      className="w-full min-h-[100px] border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
                    />
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="default"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApprove(selectedReport.id)}
                    >
                      Approve
                    </Button>
                    <Button variant="destructive" onClick={() => handleReject(selectedReport.id)}>
                      Reject
                    </Button>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}

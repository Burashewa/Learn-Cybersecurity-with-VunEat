"use client"

import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Vulnerability = {
  id: number
  title: string
  severity: "High" | "Medium" | "Low"
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function AdminVulnerabilityListPage() {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newSeverity, setNewSeverity] = useState<"High" | "Medium" | "Low" | "">("")
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    const fetchVulnerabilities = async () => {
      try {
        const res = await fetch(`${API_URL}/api/vulnerabilities`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        const data = await res.json()
        setVulnerabilities(data)
      } catch (error) {
        console.error("Error fetching vulnerabilities:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchVulnerabilities()
  }, [])

  const handleAddOrUpdate = async () => {
    if (!newTitle || !newSeverity) return

    try {
      const method = editId ? "PUT" : "POST"
      const url = editId ? `${API_URL}/api/vulnerabilities/${editId}` : `${API_URL}/api/vulnerabilities`

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title: newTitle, severity: newSeverity }),
      })

      const data = await res.json()

      if (method === "POST") {
        setVulnerabilities([...vulnerabilities, data])
      } else {
        setVulnerabilities(
          vulnerabilities.map((v) => (v.id === editId ? data : v))
        )
      }

      setNewTitle("")
      setNewSeverity("")
      setEditId(null)
      setShowForm(false)
    } catch (error) {
      console.error("Error saving vulnerability:", error)
    }
  }

  const handleEdit = (vuln: Vulnerability) => {
    setEditId(vuln.id)
    setNewTitle(vuln.title)
    setNewSeverity(vuln.severity)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vulnerability?")) return

    try {
      await fetch(`${API_URL}/api/vulnerabilities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setVulnerabilities(vulnerabilities.filter((v) => v.id !== id))
    } catch (error) {
      console.error("Error deleting vulnerability:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Vulnerability List</h1>
            <p className="text-muted-foreground">
              Manage reported vulnerabilities and add new ones
            </p>
          </div>

          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : editId ? "Cancel Edit" : "+ Add Vulnerability"}
            </Button>
          </div>

          {showForm && (
            <Card className="max-w-4xl mx-auto mb-6">
              <CardHeader>
                <CardTitle>{editId ? "Edit Vulnerability" : "Add New Vulnerability"}</CardTitle>
                <CardDescription>
                  {editId ? "Update details and save changes" : "Fill in details to add a new vulnerability"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Vulnerability Type</Label>
                    <Input
                      id="title"
                      placeholder="e.g. SQL Injection"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Severity</Label>
                    <Select value={newSeverity} onValueChange={(val) => setNewSeverity(val as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleAddOrUpdate}>
                      {editId ? "Update" : "Save"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <p className="text-center text-muted-foreground">Loading vulnerabilities...</p>
          ) : (
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Vulnerabilities</CardTitle>
                <CardDescription className="text-center">
                  List of identified vulnerabilities and their severity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {vulnerabilities.map((vuln) => (
                    <div
                      key={vuln.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div>
                        <h3 className="font-semibold">{vuln.title}</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div
                          className={`text-lg font-bold ${
                            vuln.severity === "High"
                              ? "text-red-600"
                              : vuln.severity === "Medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {vuln.severity}
                        </div>
                        <Button variant="outline" onClick={() => handleEdit(vuln)}>Edit</Button>
                        <Button variant="destructive" onClick={() => handleDelete(vuln.id)}>Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

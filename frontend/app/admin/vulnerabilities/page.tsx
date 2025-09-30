"use client"

import { useState } from "react"
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

export default function AdminVulnerabilityListPage() {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([
    { id: 1, title: "SQL Injection in Login Form", severity: "High" },
    { id: 2, title: "Cross-Site Scripting (XSS) in Comments", severity: "Medium" },
    { id: 3, title: "Insecure Direct Object Reference", severity: "High" },
    { id: 4, title: "Missing Security Headers", severity: "Low" },
    { id: 5, title: "Weak Password Policy", severity: "Medium" },
    { id: 6, title: "Unencrypted Sensitive Data", severity: "High" },
  ])

  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newSeverity, setNewSeverity] = useState<"High" | "Medium" | "Low" | "">("")

  const handleAddVulnerability = () => {
    if (!newTitle || !newSeverity) return

    const newVuln: Vulnerability = {
      id: vulnerabilities.length + 1,
      title: newTitle,
      severity: newSeverity as "High" | "Medium" | "Low",
    }

    setVulnerabilities([...vulnerabilities, newVuln])
    setNewTitle("")
    setNewSeverity("")
    setShowForm(false)
  }

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Vulnerability List</h1>
            <p className="text-muted-foreground">
              Manage reported vulnerabilities and add new ones
            </p>
          </div>

          {/* Add Button */}
          <div className="flex justify-end mb-4">
            <Button
              className="bg-primary text-white hover:bg-primary/90"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "+ Add Vulnerability"}
            </Button>
          </div>

          {/* Add Vulnerability Form */}
          {showForm && (
            <Card className="max-w-4xl mx-auto mb-6">
              <CardHeader>
                <CardTitle>Add New Vulnerability</CardTitle>
                <CardDescription>
                  Fill in the details of the new vulnerability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Vulnerability Type</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Cross-Site Request Forgery (CSRF)"
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
                    <Button onClick={handleAddVulnerability}>Save</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vulnerability Table */}
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
                    <div className="text-right">
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
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

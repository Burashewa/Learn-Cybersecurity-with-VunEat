"use client"

import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

// Sample vulnerability data - in a real app, this would come from a database
const vulnerabilityData = [
  { id: 1, title: "SQL Injection in Login Form", severity: "High" },
  { id: 2, title: "Cross-Site Scripting (XSS) in Comments", severity: "Medium" },
  { id: 3, title: "Insecure Direct Object Reference", severity: "High" },
  { id: 4, title: "Missing Security Headers", severity: "Low" },
  { id: 5, title: "Weak Password Policy", severity: "Medium" },
  { id: 6, title: "Unencrypted Sensitive Data", severity: "High" },
]

export default function VulnerabilityListPage() {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Vulnerability List</h1>
            <p className="text-muted-foreground">
              Reported vulnerabilities with their severity levels
            </p>
          </div>

          {/* Back Button */}
          <div className="mb-6 flex justify-center">
            <Button variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>

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
                {vulnerabilityData.map((vuln) => (
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

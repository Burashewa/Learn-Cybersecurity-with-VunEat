"use client"

import { useEffect, useState } from "react"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL 

type Vulnerability = {
  id: number
  title: string
  severity: "Low" | "Medium" | "High"
}

export default function VulnerabilityListPage() {
  const router = useRouter()
  const [vulnerabilityData, setVulnerabilityData] = useState<Vulnerability[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVulnerabilities = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/velnerablity/velnerablityList`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        if (!res.ok) throw new Error("Failed to fetch vulnerabilities")
        const data: Vulnerability[] = await res.json()
        setVulnerabilityData(data)
      } catch (err: any) {
        console.error("Error fetching vulnerabilities:", err)
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchVulnerabilities()
  }, [])

  const handleBack = () => {
    if (window.history.length > 1) router.back()
    else router.push("/dashboard")
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

          {/* Loading / Vulnerability Table */}
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
          )}

          {error && (
            <p className="text-center text-red-600 mt-4">{error}</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

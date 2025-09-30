"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, AlertTriangle, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

const vulnerabilityTypes = [
  "SQL Injection",
  "Cross-Site Scripting (XSS)",
  "Cross-Site Request Forgery (CSRF)",
  "Remote Code Execution (RCE)",
  "Authentication Bypass",
  "Authorization Bypass",
  "File Upload Vulnerability",
  "Path Traversal",
  "Server-Side Request Forgery (SSRF)",
  "XML External Entity (XXE)",
  "Insecure Direct Object Reference",
  "Security Misconfiguration",
  "Other",
]

const severityLevels = [
  { value: "low", label: "Low", points: 10, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  { value: "medium", label: "Medium", points: 20, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
  { value: "high", label: "High", points: 40, color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
  { value: "critical", label: "Critical", points: 70, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
]

export default function ReportForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    vulnerabilityType: "",
    severity: "",
    description: "",
  })

  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfError, setPdfError] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Implement actual report submission
    console.log("Report submitted:", formData)
    console.log("PDF file:", pdfFile)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    // TODO: Show success message and redirect
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const selectedSeverity = severityLevels.find((s) => s.value === formData.severity)

  // PDF handlers
  const validatePdf = (file: File) => {
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      setPdfFile(file)
      setPdfError(null)
    } else {
      setPdfFile(null)
      setPdfError("Please upload a PDF file only.")
    }
  }

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validatePdf(e.target.files[0])
    }
  }

  const handlePdfDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validatePdf(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Submit Vulnerability Report</CardTitle>
              <CardDescription>Report vulnerabilities found in the VulnShop application</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vulnerability Type */}
            <div className="space-y-2">
              <Label htmlFor="vulnerabilityType">Vulnerability Type *</Label>
              <Select
                value={formData.vulnerabilityType}
                onValueChange={(value) => handleChange("vulnerabilityType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vulnerability type" />
                </SelectTrigger>
                <SelectContent>
                  {vulnerabilityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Severity Selection */}
            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level *</Label>
              <Select value={formData.severity} onValueChange={(value) => handleChange("severity", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  {severityLevels.map((severity) => (
                    <SelectItem key={severity.value} value={severity.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{severity.label}</span>
                        <Badge variant="secondary" className="ml-2">
                          {severity.points} pts
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedSeverity && (
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={selectedSeverity.color} variant="secondary">
                    {selectedSeverity.label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Worth {selectedSeverity.points} points</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Short Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe the vulnerability you found, including steps to reproduce and potential impact..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={6}
                
              />
            </div>

            {/* Upload PDF Report */}
            <div className="w-full">
              <Label className="mb-2 block font-medium">Upload PDF Report *</Label>

              <div
                onDrop={handlePdfDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed ${
                  pdfError ? "border-red-500" : "border-gray-500"
                } p-6 text-center cursor-pointer hover:border-gray-400 transition`}
                onClick={() => document.getElementById("pdf-input")?.click()}
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />

                {pdfFile ? (
                  <p className="text-sm font-medium text-gray-200">{pdfFile.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-200">
                      Drop your PDF here or click to browse
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Maximum file size: 10MB</p>
                  </>
                )}

                <input
                  id="pdf-input"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handlePdfChange}
                />
              </div>

              {pdfError && (
                <p className="mt-2 text-xs text-red-500 font-medium">{pdfError}</p>
              )}
            </div>

            {/* Guidelines */}
            <Card className="bg-muted/30">
              <CardContent className="pt-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm space-y-1">
                    <p className="font-medium">Reporting Guidelines:</p>
                    <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>Be specific about the vulnerability location and type</li>
                      <li>Include clear steps to reproduce the issue</li>
                      <li>Describe the potential security impact</li>
                      <li>Reports are reviewed before points are awarded</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/users/reports")}
                className="sm:w-auto"
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

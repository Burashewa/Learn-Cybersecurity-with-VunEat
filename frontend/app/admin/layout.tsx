import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ThemeProvider } from "@/components/theme-context" 
import { RouteGuard } from "@/components/route-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard requireAuth={true}>
    <ThemeProvider>  
      <div className="min-h-screen flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </ThemeProvider>
    </RouteGuard>
  )
}


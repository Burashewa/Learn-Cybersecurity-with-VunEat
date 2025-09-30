import type React from "react"
import { UserSidebar } from "@/components/user-sidebar"
import { RouteGuard } from "@/components/route-guard"

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard requireAuth={false}>
      <div className="flex min-h-screen bg-background">
        <UserSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </RouteGuard>
  )
}

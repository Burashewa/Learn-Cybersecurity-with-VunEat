"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function RouteGuard({
  children,
  requireAuth = false,
  requireAdmin = false,
}: RouteGuardProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Wait until auth state is determined
    if (requireAuth && !isAuthenticated) {
      router.replace("/auth/login")
      return
    }

    if (requireAdmin && (!isAuthenticated || !user?.isAdmin)) {
      router.replace("/users")
      return
    }
  }, [isAuthenticated, user, requireAuth, requireAdmin, router])

  // Show a loader while redirecting or waiting for auth state
  if (
    (requireAuth && !isAuthenticated) ||
    (requireAdmin && (!isAuthenticated || !user?.isAdmin))
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

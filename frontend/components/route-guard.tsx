"use client"

import type React from "react"

import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function RouteGuard({ children, requireAuth = false, requireAdmin = false }: RouteGuardProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (requireAdmin && (!isAuthenticated || !user?.isAdmin)) {
      router.push("/users")
      return
    }
  }, [isAuthenticated, user, requireAuth, requireAdmin, router])

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (requireAdmin && (!isAuthenticated || !user?.isAdmin)) {
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

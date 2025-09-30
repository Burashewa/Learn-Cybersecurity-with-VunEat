"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, LogOut } from "lucide-react"
import { useAuth } from "./auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"

export function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const pathname = usePathname()

  // only fix nav bar on landing page
  const isLandingPage = pathname === "/"

  // base classes
  const navClasses =
    (isLandingPage
      ? "fixed top-0 left-0 right-0 z-50" // sticky on landing
      : "relative") +
    " border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50"

  if (isLoading) {
    return (
      <nav className={navClasses}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <Link href="/" className="text-xl font-bold text-foreground">
                VulnEat
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="animate-pulse bg-muted rounded h-9 w-9"></div>
              <div className="animate-pulse bg-muted rounded h-9 w-16"></div>
              <div className="animate-pulse bg-muted rounded h-9 w-20"></div>
              <div className="animate-pulse bg-muted rounded h-9 w-9"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <Link href="/" className="text-xl font-bold text-foreground">
              VulnEat
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <>
                <Link href="/users" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <Link href="/users/reports" className="text-muted-foreground hover:text-foreground transition-colors">
                  Reports
                </Link>
              </>
            )}

          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Welcome, {user?.username}</span>
                <Button variant="ghost" onClick={logout} className="flex items-center space-x-1">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

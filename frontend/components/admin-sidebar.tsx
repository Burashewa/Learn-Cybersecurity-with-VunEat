"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Shield, FileText, Bug, Users, BarChart3, Settings, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import {useRouter} from "next/navigation"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "vulnerabilities",
    href: "/admin/vulnerabilities",
    icon: Bug,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center space-x-2 mb-8">
          <Shield className="h-8 w-8 text-sidebar-primary" />
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">VunEat Admin</h2>
            <p className="text-sm text-sidebar-foreground/70">Management Panel</p>
            
          </div>
          <div className="text-right mb-5">
            <ThemeToggle />
          </div>

        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                asChild
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4 mr-3" />
                  {item.title}
                </Link>
              </Button>
            )
          })}
        </nav>
      </div>

      <div className="p-6 mt-auto border-t border-sidebar-border">
        <div className="flex justify-center ">
          <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center space-x-1">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

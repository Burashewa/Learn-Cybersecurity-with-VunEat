"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface User {
  id: string
  username: string
  email: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  register: (username: string, email: string, password: string) => Promise<User>
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user and token from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      } catch (err) {
        console.error("Failed to parse stored user:", err)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    if (!API_URL) throw new Error("API_URL is not defined")

    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("API Error:", res.status, errorData);
      throw new Error(errorData.message || "Request failed");
    }


    const loggedInUser: User = {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      isAdmin: data.user.is_admin,
    }

    setUser(loggedInUser)
    setToken(data.token)
    localStorage.setItem("user", JSON.stringify(loggedInUser))
    localStorage.setItem("token", data.token)

    return loggedInUser
  }

  const register = async (username: string, email: string, password: string): Promise<User> => {
    if (!API_URL) throw new Error("API_URL is not defined")

    const res = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      const message = data.message || "Registration failed"
      throw new Error(message)
    }

    // Registration does not auto-login
    return {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      isAdmin: data.user.is_admin,
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

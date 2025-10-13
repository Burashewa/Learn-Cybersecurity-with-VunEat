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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.message || "Login failed";
      throw new Error(message);
    }


    const data = await res.json()

    const loggedInUser: User = {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      isAdmin: data.user.is_admin, // backend returns is_admin
    }

    setUser(loggedInUser)
    localStorage.setItem("user", JSON.stringify(loggedInUser))
    localStorage.setItem("token", data.token)

    return loggedInUser
  }

  const register = async (username: string, email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      throw new Error("Registration failed");
    }

    const data = await res.json();

    // Do not set user here - registration does not mean authentication
    // Do not set localStorage values here either

    return {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      isAdmin: data.user.is_admin,
    };
  };


  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])


  return (
    <AuthContext.Provider
      value={{
        user,
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


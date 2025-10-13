"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Check, X, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthFormProps {
  type: "login" | "register"
}

interface PasswordValidation {
  minLength: boolean
  hasLetter: boolean
  hasNumber: boolean
  hasSymbol: boolean
}

export function AuthForm({ type }: AuthFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { login, register } = useAuth()
  const router = useRouter()

  // ✅ Password validation
  const validatePassword = (password: string): PasswordValidation => ({
    minLength: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  })

  const passwordValidation = validatePassword(formData.password)
  const isPasswordValid = Object.values(passwordValidation).every(Boolean)
  const isConfirmPasswordValid =
    type === "login" || formData.password === formData.confirmPassword

  const isFormValid =
    type === "login"
      ? formData.email && formData.password
      : formData.username && formData.email && isPasswordValid && isConfirmPasswordValid

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) {
      setError("Please fix all validation errors before submitting.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      if (type === "login") {
        const user = await login(formData.email, formData.password)
        router.push(user?.isAdmin ? "/admin" : "/users")
      } else {
        await register(formData.username, formData.email, formData.password)
        router.push("/auth/login")
      }
    } catch (err: any) {
      console.error("Auth error:", err)
      setError(err?.message || "Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {type === "login" ? "Welcome Back" : "Join VunEat"}
          </CardTitle>
          <CardDescription>
            {type === "login"
              ? "Sign in to access the vulnerable application"
              : "Create your account to start learning cybersecurity"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {type === "register" && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            {/* 🔐 PASSWORD FIELD WITH TOGGLE */}
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password validation */}
              {type === "register" && formData.password && (
                <div className="space-y-1 text-sm">
                  {Object.entries(passwordValidation).map(([key, valid]) => {
                    const labels: Record<keyof PasswordValidation, string> = {
                      minLength: "At least 8 characters",
                      hasLetter: "Contains at least one letter",
                      hasNumber: "Contains at least one number",
                      hasSymbol: "Contains at least one symbol",
                    }
                    return (
                      <div
                        key={key}
                        className={`flex items-center gap-2 ${
                          valid ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {valid ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                        <span>{labels[key as keyof PasswordValidation]}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 🔐 CONFIRM PASSWORD FIELD WITH TOGGLE */}
            {type === "register" && (
              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {formData.confirmPassword && (
                  <div className="text-sm">
                    {isConfirmPasswordValid ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="h-3 w-3" />
                        <span>Passwords match</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <X className="h-3 w-3" />
                        <span>Passwords do not match</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isFormValid}
            >
              {isLoading
                ? "Please wait..."
                : type === "login"
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            {type === "login" ? (
              <p className="text-muted-foreground">
                Don’t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

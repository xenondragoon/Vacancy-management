"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "../../lib/auth"
import { getDashboardPath } from "../../lib/roles"
import "../../styles/login.css"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const result = await login(email, password)
      if (result.success) {
        router.push(getDashboardPath(result.role))
      } else {
        setError(result.message || "Invalid credentials")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>Log in</h1>
        <p style={{ marginTop: "1rem" }}>
          Don't have an account? <Link href="/signup">Create one</Link>
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-container">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="show-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <div style={{ color: "red", marginTop: "0.5rem" }}>{error}</div>
          )}

          <div className="checkbox-container">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Keep me logged in</label>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="login-links">
          <a href="#">Forgot username?</a>
          <a href="#">Forgot password?</a>
          <a href="#">Can't log in?</a>
        </div>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "../../lib/auth"
import { getDashboardPath } from "../../lib/roles"
import "../../styles/login.css"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = login(username, password)
    if (result.success) {
      router.push(getDashboardPath(result.role))
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>Log in</h1>
        <p style={{ marginTop: "1rem" }}>
          Don't have an account? <a href="/signup">Create one</a>
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username or Email</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          <button type="submit" className="login-button">
            Log in
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

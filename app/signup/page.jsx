
"use client"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signup } from "../../lib/auth"
import { getDashboardPath } from "../../lib/roles"
import "../../styles/signup.css" // Ensure this path is correct

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [role, setRole] = useState("applicant")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = signup(name, password, role)
    if (result.success) {
      router.push(getDashboardPath(role))
    } else {
      setError(result.message || "Signup failed")
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Sign up</h1>
        <p className="subtitle">Sign up to continue</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="signup-button">
            Sign up
          </button>

          <div className="remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          <div className="divider">
            <span>ACCESS QUICKLY</span>
          </div>

          <div className="quick-access">
            <button type="button">Google</button>
            <button type="button">LinkedIn</button>
            <button type="button">SSO</button>
          </div>

          {error && <div style={{ color: "red", marginTop: "8px" }}>{error}</div>}

          <p className="signin-link">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  )
}

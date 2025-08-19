"use client"

import { useState, useEffect } from "react"
import { FiSun, FiMoon } from "react-icons/fi"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
      document.body.classList.add("dark")
    } else {
      setIsDark(false)
      document.documentElement.classList.remove("dark")
      document.body.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    console.log('Toggling theme to:', newIsDark ? 'dark' : 'light')
    
    if (newIsDark) {
      document.documentElement.classList.add("dark")
      document.body.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      document.body.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
    
    console.log('Current classes:', document.documentElement.className)
    console.log('Body classes:', document.body.className)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button className="theme-toggle" disabled>
        <FiMoon size={20} />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{ 
        backgroundColor: isDark ? '#333' : '#fff',
        color: isDark ? '#fff' : '#333'
      }}
    >
      {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  )
}

"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import "../../styles/Sidebar.css"
import "../../styles/components.css"

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      // On desktop, sidebar should be open by default
      if (window.innerWidth >= 768) {
        setSidebarOpen(true)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="dashboard-container">
      <Navbar
        onSidebarToggle={handleSidebarToggle}
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
      />
      <div className="dashboard-content-wrapper">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
        <main className="dashboard-main-content">
          {children}
        </main>
      </div>
      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div className="sidebar-overlay open" onClick={handleSidebarClose} />
      )}
    </div>
  )
}

"use client"
import Link from "next/link"
import { getUser } from "../lib/auth"
import { useEffect, useState } from "react"

export default function Sidebar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    setUser(getUser())
  }, [])

  if (!user) return null

  let links = []
  if (user.role === "admin") {
    links = [
      { href: "/dashboards/admin", label: "Dashboard" },
      { href: "/dashboards/admin/manage-users", label: "Manage Users" },
      { href: "/dashboards/admin/settings", label: "Settings" },
    ]
  } else if (user.role === "manager") {
    links = [
      { href: "/dashboards/manager", label: "Dashboard" },
      { href: "/dashboards/manager/overview", label: "Overview" },
      { href: "/dashboards/manager/assign-roles", label: "Assign Roles" },
      { href: "/dashboards/manager/settings", label: "Settings" },
    ]
  } else if (user.role === "applicant") {
    links = [
      { href: "/dashboards/applicant", label: "Dashboard" },
      { href: "/dashboards/applicant/contact", label: "Contact" },
      { href: "/dashboards/applicant/settings", label: "Settings" },
    ]
  }

  return (
    <aside className="sidebar">
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

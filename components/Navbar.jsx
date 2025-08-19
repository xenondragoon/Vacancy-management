"use client";

import "../styles/NavBar.css";
import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useRouter } from "next/navigation";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";

export default function Navbar({ onSidebarToggle, sidebarOpen, isMobile }) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {isMobile && (
          <button
            className={`hamburger${sidebarOpen ? " open" : ""}`}
            onClick={onSidebarToggle}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        )}
        <Link href="/" className="navbar-logo">
          <img
            src="/logo.png"
            alt="Logo"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span className="logo-text">Time Software</span>
        </Link>
      </div>
      <div className="navbar-right">
        <ThemeToggle />
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <FiLogOut size={22} />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </nav>
  )
} 
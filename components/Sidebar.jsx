"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiBriefcase, FiUsers, FiUserCheck, FiSettings, FiUser, FiLogOut, FiFileText, FiBell, FiCalendar, FiChevronDown, FiBarChart2 } from "react-icons/fi";
import { getUser } from "../lib/auth";
import { getRoleDisplayName } from "../lib/roles";

export default function Sidebar({ isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  const isActive = (path) => pathname === path;

  const getRoleSpecificItems = (role) => {
    switch (role) {
      case "admin":
        return [
          { name: "Dashboard Overview", path: "/dashboards/admin", icon: FiHome },
          { name: "Manage Job Posts", path: "/dashboards/admin/manage-job-posts", icon: FiBriefcase },
          { name: "View Applicants", path: "/dashboards/admin/view-applicants", icon: FiUsers },
          { name: "Interview Scheduling", path: "/dashboards/admin/interview-scheduler", icon: FiCalendar },
        ];
      case "manager":
        return [
          { name: "Dashboard Overview", path: "/dashboards/manager", icon: FiHome },
          { name: "Job Listings", path: "/dashboards/manager/job-listings", icon: FiBriefcase },
          { name: "Applicants", path: "/dashboards/manager/Applicants", icon: FiUsers },
          { name: "Admin Users", path: "/dashboards/manager/admin-users", icon: FiUserCheck },
          { name: "Reports & Analytics", path: "/dashboards/manager/reports", icon: FiBarChart2 },
         
        ];
      case "applicant":
        return [
          { name: "Dashboard", path: "/dashboards/applicant", icon: FiHome },
          { name: "Browse Jobs", path: "/dashboards/applicant/browse-jobs", icon: FiBriefcase },
          { name: "My Applications", path: "/dashboards/applicant/my-applications", icon: FiFileText },
          { name: "Notifications", path: "/dashboards/applicant/Notifications", icon: FiBell },
        ];
      default:
        return [];
    }
  };

  const getCommonItems = () => [
    { name: "Profile", path: `/dashboards/${user?.role}/profile`, icon: FiUser },
    { name: "Logout", path: "/login", icon: FiLogOut, isLogout: true },
  ];

  const getSidebarItems = (role) => {
    const roleSpecificItems = getRoleSpecificItems(role);
    const commonItems = getCommonItems();
    return [...roleSpecificItems, ...commonItems];
  };

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    // Simple logout without dynamic import
    try {
      // Clear cookies if available
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (error) {
      console.warn('Could not clear cookies:', error);
    }
    // Redirect to login
    window.location.href = "/login";
  };

  if (!user) return null;

  const sidebarItems = getSidebarItems(user.role);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h3>Vacancy Management</h3>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="profile-section">
        <div className="profile-avatar">
          <FiUser size={20} />
        </div>
        <div className="profile-info">
          <div className="profile-name">{user.name}</div>
          <div className="profile-account">My Account</div>
        </div>
        <div className="profile-dropdown">
          <FiChevronDown size={16} />
        </div>
      </div>

      <div className="menu-section">
        <div className="menu-title">MENU</div>
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
                onClick={item.isLogout ? handleLogout : undefined}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 
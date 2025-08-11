"use client";

import DashboardLayout from "../layout";
import RoleGuard from "../../../components/RoleGuard";
import { ROLES } from "../../../lib/roles";
import "../../../styles/adminCss/adminLayout.css";

export default function AdminLayout({ children }) {
  return (
    <RoleGuard allowedRoles={[ROLES.ADMIN]}>
      <DashboardLayout>
        <div className="admin-layout-content">
          <header className="admin-layout-header">
            <div>
              <div className="admin-layout-title">Admin Dashboard</div>
              <div className="admin-layout-subtitle">Manage users, roles, and system settings</div>
            </div>
          </header>
          {children}
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
} 
"use client";

import DashboardLayout from "../layout";
import RoleGuard from "../../../components/RoleGuard";
import { ROLES } from "../../../lib/roles";

export default function AdminLayout({ children }) {
  return (
    <RoleGuard allowedRoles={[ROLES.ADMIN]}>
      <DashboardLayout>
        <div className="admin-layout-wrapper">
          <header className="admin-layout-header">
            <div>
              <div className="admin-layout-title">Admin Dashboard</div>
              <div className="admin-layout-subtitle">Manage users, roles, and system settings</div>
            </div>
          </header>
          <div className="admin-layout-content">
            {children}
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
} 
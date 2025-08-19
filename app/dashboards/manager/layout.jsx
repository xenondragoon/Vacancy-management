"use client"
import DashboardLayout from "../layout";
import RoleGuard from "../../../components/RoleGuard";
import { ROLES } from "../../../lib/roles";

export default function ManagerLayout({ children }) {
  return (
    <RoleGuard allowedRoles={[ROLES.MANAGER, ROLES.ADMIN]}>
      <DashboardLayout>
        <div className="manager-layout-content">
          {children}
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}

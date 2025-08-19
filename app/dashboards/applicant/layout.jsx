"use client";
import DashboardLayout from "../layout";
import RoleGuard from "../../../components/RoleGuard";
import { ROLES } from "../../../lib/roles";

export default function ApplicantLayout({ children }) {
  return (
    <RoleGuard allowedRoles={[ROLES.APPLICANT, ROLES.MANAGER, ROLES.ADMIN]}>
      <DashboardLayout>
        <div className="applicant-layout-wrapper">
          {children}
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
} 
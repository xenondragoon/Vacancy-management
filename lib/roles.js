export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  APPLICANT: "applicant",
}

// Dashboard paths for each role
export const DASHBOARD_PATHS = {
  [ROLES.ADMIN]: "/dashboards/admin",
  [ROLES.MANAGER]: "/dashboards/manager",
  [ROLES.APPLICANT]: "/dashboards/applicant",
}

// Get the appropriate dashboard path for a role
export function getDashboardPath(role) {
  return DASHBOARD_PATHS[role] || DASHBOARD_PATHS[ROLES.APPLICANT]
}

// Check if user has required role
export function hasRole(userRole, requiredRole) {
  if (!userRole || !requiredRole) return false

  // Admin has access to everything
  if (userRole === ROLES.ADMIN) {
    return true
  }
  // Manager has access to manager and applicant areas
  if (userRole === ROLES.MANAGER) {
    return requiredRole === ROLES.MANAGER || requiredRole === ROLES.APPLICANT
  }
  // Applicant only has access to applicant areas
  if (userRole === ROLES.APPLICANT) {
    return requiredRole === ROLES.APPLICANT
  }
  
  return false
}

export function getRoleDisplayName(role) {
  const displayNames = {
    [ROLES.ADMIN]: "Administrator",
    [ROLES.MANAGER]: "Manager",
    [ROLES.APPLICANT]: "Applicant",
  }
  return displayNames[role] || "Unknown"
}

// Get role permissions
export function getRolePermissions(role) {
  const permissions = {
    [ROLES.ADMIN]: [
      "manage_users",
      "view_all_dashboards",
      "system_settings",
      "delete_records",
    ],
    [ROLES.MANAGER]: [
      "manage_roles",
      "view_applications",
      "approve_applications",
      "manage_vacancies",
      "view_reports",
      "assign_roles",
    ],
    [ROLES.APPLICANT]: [
      "view_vacancies",
      "apply_vacancies",
      "view_profile",
      "edit_profile",
      "view_applications",
    ],
  }
  return permissions[role] || []
}

// Check if user has specific permission
export function hasPermission(userRole, permission) {
  const permissions = getRolePermissions(userRole)
  return permissions.includes(permission)
} 
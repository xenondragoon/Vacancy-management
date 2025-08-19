"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { LoadingSpinner, SkeletonTable } from "../../../../components/LoadingSpinner";
import { EmptyState } from "../../../../components/EmptyState";
import { useToastNotifications } from "../../../../components/Toast";
import { usePerformance } from "../../../../lib/usePerformance";
import "../../../../styles/adminCss/interviewScheduler.css";
import "../../../../styles/managerCss/managerLayout.css";

// EmptySearchResults Component
const EmptySearchResults = ({ searchTerm, onClearFilters }) => (
  <div style={{
    textAlign: 'center',
    padding: '3rem 2rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderRadius: '16px',
    border: '1px solid #e2e8f0'
  }}>
    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
      No users found
    </h3>
    <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
      {searchTerm ? `No users match "${searchTerm}"` : 'No users match your current filters'}
    </p>
    <button
      onClick={onClearFilters}
      className="is-button secondary"
    >
      Clear Filters
    </button>
  </div>
);

// Memoized mock data for better performance
const mockUsers = [
  {
    id: 1,
    name: "John Admin",
    email: "john.admin@company.com",
    role: "admin",
    department: "IT",
    status: "Active",
    lastLogin: "2024-01-12 10:30 AM",
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Sarah Manager",
    email: "sarah.manager@company.com",
    role: "manager",
    department: "HR",
    status: "Active",
    lastLogin: "2024-01-12 09:15 AM",
    joinDate: "2023-03-20",
  },
  {
    id: 3,
    name: "Mike User",
    email: "mike.user@company.com",
    role: "applicant",
    department: "Engineering",
    status: "Inactive",
    lastLogin: "2024-01-10 02:45 PM",
    joinDate: "2023-06-10",
  },
  {
    id: 4,
    name: "Lisa Admin",
    email: "lisa.admin@company.com",
    role: "admin",
    department: "Operations",
    status: "Active",
    lastLogin: "2024-01-12 11:20 AM",
    joinDate: "2022-11-05",
  },
  {
    id: 5,
    name: "David Manager",
    email: "david.manager@company.com",
    role: "manager",
    department: "Marketing",
    status: "Active",
    lastLogin: "2024-01-11 04:30 PM",
    joinDate: "2023-08-15",
  },
];

// Memoized utility functions
const getRoleCount = (users, role) => {
  return users.filter(user => user.role === role).length;
};

const getStatusCount = (users, status) => {
  return users.filter(user => user.status === status).length;
};

const getRoleClass = (role) => {
  switch (role) {
    case "admin":
      return "danger";
    case "manager":
      return "primary";
    case "applicant":
      return "success";
    default:
      return "info";
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "Active":
      return "completed";
    case "Inactive":
      return "pending";
    case "Suspended":
      return "warning";
    default:
      return "pending";
  }
};

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToastNotifications();
  const { metrics, trackInteraction, updateRenderMetrics } = usePerformance("AdminUsers");

  // Memoized filtered users for better performance
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = !selectedRole || user.role === selectedRole;
      const matchesStatus = !selectedStatus || user.status === selectedStatus;
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [users, selectedRole, selectedStatus, searchTerm]);

  // Memoized stats for better performance
  const stats = useMemo(() => ({
    totalUsers: users.length,
    adminUsers: getRoleCount(users, "admin"),
    managers: getRoleCount(users, "manager"),
    activeUsers: getStatusCount(users, "Active")
  }), [users]);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        updateRenderMetrics(); // Track initial render
        toast.showSuccess("Admin users data loaded successfully");
      } catch (error) {
        toast.showError("Failed to load admin users data");
        setIsLoading(false);
      }
    };

    loadData();
  }, [updateRenderMetrics, toast]);

  // Memoized handlers for better performance
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      updateRenderMetrics(); // Track refresh performance
      toast.showInfo("Admin users data refreshed");
    } catch (error) {
      toast.showError("Failed to refresh admin users data");
    } finally {
      setIsRefreshing(false);
    }
  }, [updateRenderMetrics, toast]);

  const handleStatusChange = useCallback(async (userId, newStatus) => {
    trackInteraction('status-change');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      toast.showSuccess(`User status updated to ${newStatus}`);
    } catch (error) {
      toast.showError("Failed to update user status");
    }
  }, [trackInteraction, toast]);

  const handleCreateUser = useCallback(async () => {
    trackInteraction('create-user');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.showSuccess("New admin user created successfully");
      setShowCreateForm(false);
    } catch (error) {
      toast.showError("Failed to create admin user");
    }
  }, [trackInteraction, toast]);

  const handleEditUser = useCallback(async (user) => {
    trackInteraction('edit-user');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 600));
      toast.showSuccess(`Editing user: ${user.name}`);
    } catch (error) {
      toast.showError("Failed to edit user");
    }
  }, [trackInteraction, toast]);

  const handleDeleteUser = useCallback(async (user) => {
    trackInteraction('delete-user');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 700));
      toast.showSuccess(`User deleted: ${user.name}`);
    } catch (error) {
      toast.showError("Failed to delete user");
    }
  }, [trackInteraction, toast]);

  const handleViewUser = useCallback(async (user) => {
    trackInteraction('view-user');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 400));
      setSelectedUser(user);
      toast.showInfo(`Viewing user: ${user.name}`);
    } catch (error) {
      toast.showError("Failed to view user details");
    }
  }, [trackInteraction, toast]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedRole("");
    setSelectedStatus("");
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h1 className="admin-dashboard-title">Admin Users</h1>
          <p className="admin-dashboard-subtitle">
            Manage system users and permissions
          </p>
        </div>
        
        <SkeletonTable rows={6} columns={8} />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <div className="admin-dashboard-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="admin-dashboard-title">Admin Users</h1>
            <p className="admin-dashboard-subtitle">
              Manage system users and permissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="is-button"
            >
              👤 Create User
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="is-button secondary"
            >
              {isRefreshing ? (
                <LoadingSpinner size="sm" type="dots" />
              ) : (
                "🔄 Refresh"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card primary">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Total Users</div>
            <div className="admin-stat-icon">👥</div>
          </div>
          <div className="admin-stat-number">{stats.totalUsers}</div>
          <div className="admin-stat-change positive">+2 this month</div>
        </div>
        <div className="admin-stat-card danger">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Admin Users</div>
            <div className="admin-stat-icon">👑</div>
          </div>
          <div className="admin-stat-number">{stats.adminUsers}</div>
          <div className="admin-stat-change neutral">0 changes</div>
        </div>
        <div className="admin-stat-card info">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Managers</div>
            <div className="admin-stat-icon">👔</div>
          </div>
          <div className="admin-stat-number">{stats.managers}</div>
          <div className="admin-stat-change positive">+1 today</div>
        </div>
        <div className="admin-stat-card success">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Active Users</div>
            <div className="admin-stat-icon">✅</div>
          </div>
          <div className="admin-stat-number">{stats.activeUsers}</div>
          <div className="admin-stat-change positive">+1 today</div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="admin-recent-activity">
        <div className="admin-activity-header">
          <h2 className="admin-activity-title">Filters & Search</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="is-search">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="is-search-input"
            />
          </div>
          <div className="is-filter-select">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="is-filter-select-input"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="applicant">Applicant</option>
            </select>
          </div>
          <div className="is-filter-select">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="is-filter-select-input"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-recent-activity">
        <div className="admin-activity-header">
          <h2 className="admin-activity-title">Users</h2>
          <span className="admin-activity-subtitle">
            {filteredUsers.length} users found
          </span>
        </div>
        
        {filteredUsers.length === 0 ? (
          <EmptySearchResults
            searchTerm={searchTerm}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <div className="is-table-container">
            <table className="is-table">
              <thead className="is-table-header">
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="is-table-body">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="is-table-row">
                    <td>
                      <div>
                        <div className="is-table-cell-primary">{user.name}</div>
                        <div className="is-table-cell-secondary">{user.email}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`is-status-tag ${getRoleClass(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td>{user.department}</td>
                    <td>
                      <span className={`is-status-tag ${getStatusClass(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.lastLogin}</td>
                    <td>{user.joinDate}</td>
                    <td>
                      <div className="is-action-buttons">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="is-button primary small"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="is-button secondary small"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="is-button danger small"
                        >
                          Delete
                        </button>
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          className="is-filter-select-input"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Form Modal */}
      {showCreateForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Create New User</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Full Name"
                className="is-search-input"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="is-search-input"
              />
              <select className="is-filter-select-input">
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="applicant">Applicant</option>
              </select>
              <select className="is-filter-select-input">
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateForm(false)}
                className="is-button secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="is-button"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Name:</label>
                <span>{selectedUser.name}</span>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Email:</label>
                <span>{selectedUser.email}</span>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Role:</label>
                <span className={`is-status-tag ${getRoleClass(selectedUser.role)}`}>
                  {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                </span>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Department:</label>
                <span>{selectedUser.department}</span>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Status:</label>
                <span className={`is-status-tag ${getStatusClass(selectedUser.status)}`}>
                  {selectedUser.status}
                </span>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Last Login:</label>
                <span>{selectedUser.lastLogin}</span>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Join Date:</label>
                <span>{selectedUser.joinDate}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setSelectedUser(null)}
                className="is-button secondary"
              >
                Close
              </button>
              <button
                onClick={() => handleEditUser(selectedUser)}
                className="is-button"
              >
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div style={{ marginTop: '3rem' }}>
        <div className="admin-recent-activity">
          <div className="admin-activity-header">
            <h2 className="admin-activity-title">Performance Metrics</h2>
          </div>
          <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>
                {metrics.renderTime ? `${metrics.renderTime.toFixed(1)}ms` : 'N/A'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Render Time</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>
                {metrics.renderCount || 0}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Render Count</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💾</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>
                {metrics.memoryUsage ? `${metrics.memoryUsage.used}MB` : 'N/A'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Memory Usage</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>
                {metrics.interactionTime ? `${metrics.interactionTime.toFixed(1)}ms` : 'N/A'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Interaction Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

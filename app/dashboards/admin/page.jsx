"use client";

import React, { useState, useEffect } from "react";
import { LoadingSpinner, SkeletonStats, SkeletonTable } from "../../../components/LoadingSpinner";
import { EmptyState } from "../../../components/EmptyState";
import { useToastNotifications } from "../../../components/Toast";
import { usePerformance } from "../../../lib/usePerformance";
import "../../../styles/adminCss/interviewScheduler.css";
import "../../../styles/adminCss/adminLayout.css";

const overviewStats = [
  { 
    title: "Total Job Posts", 
    value: 24, 
    change: "+12%", 
    changeType: "positive",
    icon: "💼",
    color: "primary"
  },
  { 
    title: "Upcoming Interviews", 
    value: 5, 
    change: "+2", 
    changeType: "positive",
    icon: "📅",
    color: "success"
  },
  { 
    title: "Applications Pending", 
    value: 8, 
    change: "-3", 
    changeType: "negative",
    icon: "⏳",
    color: "warning"
  },
  { 
    title: "Active Users", 
    value: 156, 
    change: "+8%", 
    changeType: "positive",
    icon: "👥",
    color: "primary"
  }
];

const recentActivity = [
  { 
    id: 1,
    type: "interview",
    message: "Interview with Alice Johnson scheduled for tomorrow at 10:00 AM",
    time: "2 hours ago",
    status: "pending",
    icon: "📅"
  },
  { 
    id: 2,
    type: "application",
    message: "New applicant: Bob Smith for Backend Engineer position",
    time: "4 hours ago",
    status: "completed",
    icon: "📝"
  },
  { 
    id: 3,
    type: "job",
    message: "Job post 'QA Tester' is expiring in 2 days",
    time: "6 hours ago",
    status: "warning",
    icon: "⚠️"
  },
  { 
    id: 4,
    type: "user",
    message: "New user registration: Carol Lee (Manager)",
    time: "8 hours ago",
    status: "completed",
    icon: "👤"
  },
  { 
    id: 5,
    type: "system",
    message: "System backup completed successfully",
    time: "12 hours ago",
    status: "completed",
    icon: "💾"
  }
];

const quickActions = [
  {
    title: "Schedule Interview",
    description: "Book a new interview slot",
    icon: "📅",
    action: "schedule",
    color: "primary"
  },
  {
    title: "Create Job Post",
    description: "Add a new job opening",
    icon: "💼",
    action: "create-job",
    color: "success"
  },
  {
    title: "Review Applications",
    description: "Process pending applications",
    icon: "📋",
    action: "review",
    color: "warning"
  },
  {
    title: "User Management",
    description: "Manage system users and roles",
    icon: "👥",
    action: "users",
    color: "primary"
  }
];

const getStatusClass = (status) => {
  switch (status) {
    case "pending":
      return "pending";
    case "completed":
      return "completed";
    case "warning":
      return "warning";
    default:
      return "pending";
  }
};

const getActivityIconClass = (type) => {
  switch (type) {
    case "interview":
      return "admin-activity-icon interview";
    case "application":
      return "admin-activity-icon application";
    case "job":
      return "admin-activity-icon job";
    case "user":
      return "admin-activity-icon user";
    case "system":
      return "admin-activity-icon system";
    default:
      return "admin-activity-icon";
  }
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToastNotifications();
  const { metrics, trackInteraction } = usePerformance("AdminDashboard");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        toast.showSuccess("Dashboard loaded successfully");
      } catch (error) {
        toast.showError("Failed to load dashboard data");
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array since we only want this to run once on mount

  const handleQuickAction = async (action) => {
    trackInteraction('quick-action');
    setIsRefreshing(true);
    
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.showSuccess(`${action.title} action completed successfully`);
    } catch (error) {
      toast.showError(`Failed to complete ${action.title} action`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.showInfo("Dashboard refreshed");
    } catch (error) {
      toast.showError("Failed to refresh dashboard");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h1 className="admin-dashboard-title">Admin Dashboard</h1>
          <p className="admin-dashboard-subtitle">
            Manage users, roles, and system settings with powerful insights and controls
          </p>
        </div>
        
        <SkeletonStats count={4} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <SkeletonTable rows={5} columns={3} />
          <div className="admin-quick-actions">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="admin-quick-action">
                <div className="admin-quick-action-icon">
                  <LoadingSpinner size="sm" type="dots" />
                </div>
                <div className="admin-quick-action-content">
                  <div className="admin-quick-action-title">
                    <LoadingSpinner size="xs" type="bars" />
                  </div>
                  <div className="admin-quick-action-description">
                    <LoadingSpinner size="xs" type="bars" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <div className="admin-dashboard-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="admin-dashboard-title">Admin Dashboard</h1>
            <p className="admin-dashboard-subtitle">
              Manage users, roles, and system settings with powerful insights and controls
            </p>
          </div>
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

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {overviewStats.map((stat, index) => (
          <div key={stat.title} className={`admin-stat-card ${stat.color}`}>
            <div className="admin-stat-header">
              <div className="admin-stat-title">{stat.title}</div>
              <div className="admin-stat-icon">{stat.icon}</div>
            </div>
            <div className="admin-stat-number">{stat.value}</div>
            <div className={`admin-stat-change ${stat.changeType}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recent Activity */}
        <div className="admin-recent-activity">
          <div className="admin-activity-header">
            <h2 className="admin-activity-title">Recent Activity</h2>
          </div>
          <ul className="admin-activity-list">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="admin-activity-item">
                <div className={getActivityIconClass(activity.type)}>
                  {activity.icon}
                </div>
                <div className="admin-activity-content">
                  <div className="admin-activity-text">{activity.message}</div>
                  <div className="admin-activity-time">{activity.time}</div>
                </div>
                <span className={`admin-activity-status ${getStatusClass(activity.status)}`}>
                  {activity.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="admin-quick-actions">
          {quickActions.map((action) => (
            <button
              key={action.title}
              className="admin-quick-action"
              onClick={() => handleQuickAction(action.action)}
            >
              <div className="admin-quick-action-icon">
                {action.icon}
              </div>
              <div className="admin-quick-action-content">
                <div className="admin-quick-action-title">{action.title}</div>
                <div className="admin-quick-action-description">{action.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Stats Section */}
      <div style={{ marginTop: '3rem' }}>
        <div className="admin-recent-activity">
          <div className="admin-activity-header">
            <h2 className="admin-activity-title">System Overview</h2>
          </div>
          <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>98.5%</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>System Uptime</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>2.3s</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Avg Response Time</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>100%</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Security Score</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💾</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>75%</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Storage Used</div>
            </div>
          </div>
        </div>
      </div>

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
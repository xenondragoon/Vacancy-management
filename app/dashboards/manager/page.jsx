"use client";

import React, { useState, useEffect } from "react";
import { LoadingSpinner, SkeletonStats, SkeletonTable } from "../../../components/LoadingSpinner";
import { EmptyState } from "../../../components/EmptyState";
import { useToastNotifications } from "../../../components/Toast";
import { usePerformance } from "../../../lib/usePerformance";
import "../../../styles/adminCss/interviewScheduler.css";
import "../../../styles/managerCss/managerLayout.css";

const overviewStats = [
  { 
    title: "Total Job Posts", 
    value: 18, 
    change: "+3", 
    changeType: "positive",
    icon: "💼",
    color: "primary"
  },
  { 
    title: "Active Applications", 
    value: 42, 
    change: "+8", 
    changeType: "positive",
    icon: "📋",
    color: "success"
  },
  { 
    title: "Scheduled Interviews", 
    value: 7, 
    change: "+2", 
    changeType: "positive",
    icon: "📅",
    color: "warning"
  },
  { 
    title: "Active Admins", 
    value: 3, 
    change: "0", 
    changeType: "neutral",
    icon: "👥",
    color: "primary"
  }
];

const hiringFunnel = [
  { 
    label: "Applications", 
    value: 120, 
    color: "#667eea",
    icon: "📥"
  },
  { 
    label: "Shortlisted", 
    value: 30, 
    color: "#10b981",
    icon: "✅"
  },
  { 
    label: "Interviews", 
    value: 12, 
    color: "#f59e0b",
    icon: "📅"
  },
  { 
    label: "Hired", 
    value: 4, 
    color: "#059669",
    icon: "🎉"
  }
];

const recentActivity = [
  { 
    id: 1,
    type: "application",
    message: "Admin Liya updated application for DevOps Engineer",
    time: "2 hours ago",
    status: "completed",
    icon: "📝"
  },
  { 
    id: 2,
    type: "interview",
    message: "Applicant Alem was scheduled for interview",
    time: "4 hours ago",
    status: "completed",
    icon: "📅"
  },
  { 
    id: 3,
    type: "job",
    message: "Job Mobile Developer was archived",
    time: "6 hours ago",
    status: "completed",
    icon: "📦"
  },
  { 
    id: 4,
    type: "user",
    message: "New admin user registered: Sarah Manager",
    time: "8 hours ago",
    status: "completed",
    icon: "👤"
  },
  { 
    id: 5,
    type: "system",
    message: "Weekly hiring report generated",
    time: "12 hours ago",
    status: "completed",
    icon: "📊"
  }
];

const quickActions = [
  {
    title: "Post New Job",
    description: "Create a new job opening",
    icon: "💼",
    action: "post-job",
    color: "primary"
  },
  {
    title: "Review Applications",
    description: "Process pending applications",
    icon: "📋",
    action: "review-apps",
    color: "success"
  },
  {
    title: "Schedule Interview",
    description: "Book interview slots",
    icon: "📅",
    action: "schedule",
    color: "warning"
  },
  {
    title: "Generate Report",
    description: "Create hiring analytics report",
    icon: "📊",
    action: "report",
    color: "info"
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

export default function ManagerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToastNotifications();
  const { metrics, trackInteraction, updateRenderMetrics } = usePerformance("ManagerDashboard");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        setIsLoading(false);
        updateRenderMetrics(); // Track initial render
        toast.showSuccess("Manager dashboard loaded successfully");
      } catch (error) {
        toast.showError("Failed to load manager dashboard data");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleQuickAction = async (action) => {
    trackInteraction('quick-action');
    setIsRefreshing(true);
    
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 800));
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
      await new Promise(resolve => setTimeout(resolve, 600));
      updateRenderMetrics(); // Track refresh performance
      toast.showInfo("Manager dashboard refreshed");
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
          <h1 className="admin-dashboard-title">Manager Dashboard</h1>
          <p className="admin-dashboard-subtitle">
            Monitor hiring pipeline, manage applications, and track team performance
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
            <h1 className="admin-dashboard-title">Manager Dashboard</h1>
            <p className="admin-dashboard-subtitle">
              Monitor hiring pipeline, manage applications, and track team performance
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
              onClick={() => handleQuickAction(action)}
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

      {/* Hiring Funnel Section */}
      <div style={{ marginTop: '3rem' }}>
        <div className="admin-recent-activity">
          <div className="admin-activity-header">
            <h2 className="admin-activity-title">Hiring Funnel</h2>
          </div>
          <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {hiringFunnel.map((stage) => (
              <div key={stage.label} style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stage.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>{stage.value}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{stage.label}</div>
              </div>
            ))}
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
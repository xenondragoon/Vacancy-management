"use client";

import React, { useState, useEffect } from "react";
import { LoadingSpinner, SkeletonStats, SkeletonTable } from "../../../components/LoadingSpinner";
import { EmptyState } from "../../../components/EmptyState";
import { useToastNotifications } from "../../../components/Toast";
import { usePerformance } from "../../../lib/usePerformance";
import "../../../styles/adminCss/interviewScheduler.css";
import "../../../styles/adminCss/adminDashboard.css";
import "../../../styles/applicantCss/applicantLayout.css";

const applicantName = "Jane Doe";
const overviewStats = [
  { 
    title: "Applications in Progress", 
    value: 2, 
    change: "+1", 
    changeType: "positive",
    icon: "📋",
    color: "primary"
  },
  { 
    title: "Interviews Scheduled", 
    value: 1, 
    change: "+1", 
    changeType: "positive",
    icon: "📅",
    color: "warning"
  },
  { 
    title: "Total Applications", 
    value: 5, 
    change: "+2", 
    changeType: "positive",
    icon: "📤",
    color: "success"
  },
  { 
    title: "Rejections", 
    value: 1, 
    change: "0", 
    changeType: "neutral",
    icon: "❌",
    color: "danger"
  }
];

const recentActivity = [
  { 
    id: 1,
    type: "application",
    message: "You applied for Mobile App Developer at Time Software",
    time: "2 hours ago",
    status: "completed",
    icon: "📱",
    company: "Time Software"
  },
  { 
    id: 2,
    type: "interview",
    message: "Interview scheduled for QA Engineer at Time Software",
    time: "1 day ago",
    status: "scheduled",
    icon: "📅",
    company: "Time Software"
  },
  { 
    id: 3,
    type: "rejection",
    message: "Application for Product Designer was rejected",
    time: "3 days ago",
    status: "cancelled",
    icon: "❌",
    company: "Time Software"
  },
  { 
    id: 4,
    type: "application",
    message: "You applied for Data Analyst at Time Software",
    time: "5 days ago",
    status: "completed",
    icon: "📊",
    company: "Time Software"
  },
  { 
    id: 5,
    type: "shortlist",
    message: "Your application for Frontend Developer was shortlisted",
    time: "1 week ago",
    status: "scheduled",
    icon: "✅",
    company: "Time Software"
  }
];

const quickActions = [
  {
    title: "Browse Jobs",
    description: "Find new opportunities",
    icon: "🔍",
    action: "browse",
    color: "primary"
  },
  {
    title: "Update Profile",
    description: "Keep your information current",
    icon: "👤",
    action: "profile",
    color: "success"
  },
  {
    title: "Track Applications",
    description: "Monitor your progress",
    icon: "📊",
    action: "track",
    color: "warning"
  },
  {
    title: "Interview Prep",
    description: "Get ready for interviews",
    icon: "📚",
    action: "prep",
    color: "info"
  }
];

const getStatusClass = (status) => {
  switch (status) {
    case "completed":
      return "completed";
    case "scheduled":
      return "pending";
    case "cancelled":
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
    case "rejection":
      return "admin-activity-icon warning";
    case "shortlist":
      return "admin-activity-icon success";
    default:
      return "admin-activity-icon";
  }
};

export default function ApplicantDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToastNotifications();
  const { metrics, trackInteraction, updateRenderMetrics } = usePerformance("ApplicantDashboard");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        updateRenderMetrics(); // Track initial render
        toast.showSuccess(`Welcome back, ${applicantName}! Dashboard loaded successfully`);
      } catch (error) {
        toast.showError("Failed to load applicant dashboard data");
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
      await new Promise(resolve => setTimeout(resolve, 700));
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
      await new Promise(resolve => setTimeout(resolve, 500));
      updateRenderMetrics(); // Track refresh performance
      toast.showInfo("Applicant dashboard refreshed");
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
          <h1 className="admin-dashboard-title">Welcome, {applicantName}!</h1>
          <p className="admin-dashboard-subtitle">
            Track your job applications and interview progress
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
            <h1 className="admin-dashboard-title">Welcome, {applicantName}!</h1>
            <p className="admin-dashboard-subtitle">
              Track your job applications and interview progress
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

      {/* Application Progress Section */}
      <div style={{ marginTop: '3rem' }}>
        <div className="admin-recent-activity">
          <div className="admin-activity-header">
            <h2 className="admin-activity-title">Application Progress</h2>
          </div>
          <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>40%</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Success Rate</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>8 days</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Avg Response Time</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>3</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Active Applications</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>+20%</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>This Month</div>
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
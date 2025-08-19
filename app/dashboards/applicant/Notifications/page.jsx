"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { LoadingSpinner, SkeletonTable } from "../../../../components/LoadingSpinner";
import { EmptyState } from "../../../../components/EmptyState";
import { useToastNotifications } from "../../../../components/Toast";
import { usePerformance } from "../../../../lib/usePerformance";
import "../../../../styles/adminCss/interviewScheduler.css";
import "../../../../styles/applicantCss/applicantLayout.css";

// Memoized mock data for better performance
const mockNotifications = [
  {
    id: 1,
    type: "interview",
    title: "Interview Scheduled",
    message: "Your interview for Frontend Developer at Tech Corp has been scheduled for January 15th, 2024 at 2:00 PM.",
    timestamp: "2024-01-12T10:30:00Z",
    isRead: false,
    priority: "high",
  },
  {
    id: 2,
    type: "application",
    title: "Application Status Updated",
    message: "Your application for Backend Engineer at Startup Inc is now under review.",
    timestamp: "2024-01-11T14:20:00Z",
    isRead: true,
    priority: "medium",
  },
  {
    id: 3,
    type: "rejection",
    title: "Application Update",
    message: "Thank you for your interest in the UI/UX Designer position. We have decided to move forward with other candidates.",
    timestamp: "2024-01-10T09:15:00Z",
    isRead: true,
    priority: "low",
  },
  {
    id: 4,
    type: "reminder",
    title: "Application Deadline Reminder",
    message: "Don't forget to submit your application for Product Manager at Innovation Labs. Deadline is tomorrow!",
    timestamp: "2024-01-09T16:45:00Z",
    isRead: false,
    priority: "high",
  },
  {
    id: 5,
    type: "system",
    title: "Profile Update Required",
    message: "Please update your profile information to include your latest work experience.",
    timestamp: "2024-01-08T11:00:00Z",
    isRead: false,
    priority: "medium",
  },
];

const notificationIcons = {
  interview: "📅",
  application: "📋",
  rejection: "❌",
  reminder: "⏰",
  system: "⚙️",
};

const priorityColors = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#6b7280",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState("all");
  const [showRead, setShowRead] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const toast = useToastNotifications();
  const { metrics, trackInteraction, updateRenderMetrics } = usePerformance("Notifications");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));
        setIsLoading(false);
        updateRenderMetrics(); // Track initial render
        toast.showSuccess("Notifications loaded successfully");
      } catch (error) {
        toast.showError("Failed to load notifications");
        setIsLoading(false);
      }
    };

    loadData();
  }, [updateRenderMetrics, toast]);

  // Memoized filtered notifications for better performance
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      if (filter !== "all" && notification.type !== filter) return false;
      if (!showRead && notification.isRead) return false;
      return true;
    });
  }, [notifications, filter, showRead]);

  // Memoized stats for better performance
  const stats = useMemo(() => ({
    unreadCount: notifications.filter(n => !n.isRead).length,
    totalCount: notifications.length,
    highPriorityCount: notifications.filter(n => n.priority === "high" && !n.isRead).length
  }), [notifications]);

  // Memoized handlers for better performance
  const markAsRead = useCallback(async (id) => {
    trackInteraction('mark-notification-read');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 300));
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
      toast.showSuccess("Notification marked as read");
    } catch (error) {
      toast.showError("Failed to mark notification as read");
    }
  }, [trackInteraction, toast]);

  const markAllAsRead = useCallback(async () => {
    trackInteraction('mark-all-notifications-read');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      toast.showSuccess("All notifications marked as read");
    } catch (error) {
      toast.showError("Failed to mark all notifications as read");
    }
  }, [trackInteraction, toast]);

  const deleteNotification = useCallback(async (id) => {
    trackInteraction('delete-notification');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 400));
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      toast.showSuccess("Notification deleted");
    } catch (error) {
      toast.showError("Failed to delete notification");
    }
  }, [trackInteraction, toast]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      updateRenderMetrics(); // Track refresh performance
      toast.showInfo("Notifications refreshed");
    } catch (error) {
      toast.showError("Failed to refresh notifications");
    } finally {
      setIsRefreshing(false);
    }
  }, [updateRenderMetrics, toast]);

  const handleViewNotification = useCallback(async (notification) => {
    trackInteraction('view-notification');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 200));
      setSelectedNotification(notification);
      if (!notification.isRead) {
        markAsRead(notification.id);
      }
      toast.showInfo(`Viewing notification: ${notification.title}`);
    } catch (error) {
      toast.showError("Failed to view notification");
    }
  }, [trackInteraction, markAsRead, toast]);

  const formatTimestamp = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="is-container">
        <div className="is-header">
          <div className="is-header-content">
            <h1 className="is-title">Notifications</h1>
            <span className="is-badge">Loading...</span>
          </div>
        </div>
        
        <SkeletonTable rows={5} columns={1} />
      </div>
    );
  }

  return (
    <div className="is-container">
      <div className="is-header">
        <div className="is-header-content">
          <h1 className="is-title">Notifications</h1>
          <span className="is-badge">{stats.unreadCount} unread</span>
        </div>
        <div className="is-header-actions">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="is-action"
            style={{ marginRight: '1rem' }}
          >
            {isRefreshing ? (
              <LoadingSpinner size="sm" type="dots" />
            ) : (
              "🔄 Refresh"
            )}
          </button>
          <button onClick={markAllAsRead} className="is-action">
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="is-controls">
        <div className="is-filter-group">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="is-filter-select"
          >
            <option value="all">All Types</option>
            <option value="interview">Interviews</option>
            <option value="application">Applications</option>
            <option value="rejection">Rejections</option>
            <option value="reminder">Reminders</option>
            <option value="system">System</option>
          </select>
        </div>
        <div className="is-filter-group">
          <label className="is-checkbox-label">
            <input
              type="checkbox"
              checked={showRead}
              onChange={(e) => setShowRead(e.target.checked)}
            />
            Show read notifications
          </label>
        </div>
      </div>

      <div className="is-results">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`is-card ${!notification.isRead ? 'is-unread' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => handleViewNotification(notification)}
          >
            <div className="is-card-icon">
              {notificationIcons[notification.type]}
            </div>
            
            <div className="is-card-content">
              <div className="is-card-header">
                <h3 className="is-card-title">{notification.title}</h3>
                <div className="is-card-meta">
                  <span className="is-card-time">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                  <span
                    className="is-status-tag"
                    style={{ backgroundColor: priorityColors[notification.priority] }}
                  >
                    {notification.priority}
                  </span>
                </div>
              </div>
              
              <p className="is-card-description">{notification.message}</p>
              
              <div className="is-card-actions">
                {!notification.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                    className="is-action"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="is-action"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="is-empty-state">
          <p>No notifications found.</p>
          <button
            onClick={() => {
              setFilter("all");
              setShowRead(true);
            }}
            className="is-action"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Notification Details Modal */}
      {selectedNotification && (
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
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Notification Details</h2>
              <button
                onClick={() => setSelectedNotification(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{notificationIcons[selectedNotification.type]}</div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {selectedNotification.title}
                  </h3>
                  <span
                    style={{ 
                      padding: '0.375rem 0.75rem',
                      backgroundColor: priorityColors[selectedNotification.priority],
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}
                  >
                    {selectedNotification.priority} priority
                  </span>
                </div>
              </div>
              
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Message:</label>
                <p style={{ color: '#475569', lineHeight: '1.6' }}>{selectedNotification.message}</p>
              </div>
              
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Timestamp:</label>
                <span>{formatTimestamp(selectedNotification.timestamp)}</span>
              </div>
              
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Status:</label>
                <span style={{ 
                  padding: '0.375rem 0.75rem',
                  backgroundColor: selectedNotification.isRead ? '#10b981' : '#f59e0b',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {selectedNotification.isRead ? 'Read' : 'Unread'}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setSelectedNotification(null)}
                className="is-button secondary"
              >
                Close
              </button>
              {!selectedNotification.isRead && (
                <button
                  onClick={() => {
                    markAsRead(selectedNotification.id);
                    setSelectedNotification(null);
                  }}
                  className="is-button"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div style={{ marginTop: '3rem' }}>
        <div className="is-controls">
          <div className="is-controls-header">
            <h2 className="is-controls-title">Performance Metrics</h2>
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

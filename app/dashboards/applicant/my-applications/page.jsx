"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { LoadingSpinner, SkeletonTable } from "../../../../components/LoadingSpinner";
import { EmptyState } from "../../../../components/EmptyState";
import { useToastNotifications } from "../../../../components/Toast";
import { usePerformance } from "../../../../lib/usePerformance";
import "../../../../styles/adminCss/interviewScheduler.css";
import "../../../../styles/applicantCss/applicantLayout.css";

// Memoized mock data for better performance
const COMPANY_NAME = "Time Software";

const mockApplications = [
  {
    id: 1,
    jobTitle: "Frontend Developer",
    company: COMPANY_NAME,
    appliedDate: "2024-01-10",
    status: "In Progress",
    lastUpdated: "2024-01-12",
    description: "Application is being reviewed by the hiring team",
  },
  {
    id: 2,
    jobTitle: "Backend Engineer",
    company: COMPANY_NAME,
    appliedDate: "2024-01-08",
    status: "Interview Scheduled",
    lastUpdated: "2024-01-11",
    description: "Interview scheduled for January 15th, 2024",
  },
  {
    id: 3,
    jobTitle: "UI/UX Designer",
    company: COMPANY_NAME,
    appliedDate: "2024-01-05",
    status: "Rejected",
    lastUpdated: "2024-01-09",
    description: "Thank you for your interest. We have decided to move forward with other candidates.",
  },
  {
    id: 4,
    jobTitle: "Product Manager",
    company: COMPANY_NAME,
    appliedDate: "2024-01-03",
    status: "Under Review",
    lastUpdated: "2024-01-07",
    description: "Your application is currently under review",
  },
];

const statusColors = {
  "In Progress": "#3b82f6",
  "Interview Scheduled": "#10b981",
  "Rejected": "#ef4444",
  "Under Review": "#f59e0b",
  "Accepted": "#10b981",
};

export default function MyApplications() {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const toast = useToastNotifications();
  const { metrics, trackInteraction, updateRenderMetrics } = usePerformance("MyApplications");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));
        setIsLoading(false);
        updateRenderMetrics(); // Track initial render
        toast.showSuccess("Applications loaded successfully");
      } catch (error) {
        toast.showError("Failed to load applications");
        setIsLoading(false);
      }
    };

    loadData();
  }, [updateRenderMetrics, toast]);

  // Memoized filtered applications for better performance
  const filteredApplications = useMemo(() => {
    return mockApplications.filter((app) => {
      const matchesStatus = !selectedStatus || app.status === selectedStatus;
      const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.company.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [selectedStatus, searchTerm]);

  // Memoized stats for better performance
  const stats = useMemo(() => ({
    totalApplications: mockApplications.length,
    inProgress: mockApplications.filter(app => app.status === "In Progress").length,
    interviews: mockApplications.filter(app => app.status === "Interview Scheduled").length,
    rejected: mockApplications.filter(app => app.status === "Rejected").length
  }), []);

  // Memoized handlers for better performance
  const handleViewDetails = useCallback(async (application) => {
    trackInteraction('view-application-details');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 300));
      setSelectedApplication(application);
      toast.showInfo(`Viewing details for ${application.jobTitle}`);
    } catch (error) {
      toast.showError("Failed to load application details");
    }
  }, [trackInteraction, toast]);

  const handleViewInterview = useCallback(async (application) => {
    trackInteraction('view-interview');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 400));
      toast.showSuccess(`Opening interview details for ${application.jobTitle}`);
    } catch (error) {
      toast.showError("Failed to open interview details");
    }
  }, [trackInteraction, toast]);

  const handleWithdraw = useCallback(async (application) => {
    trackInteraction('withdraw-application');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 600));
      toast.showSuccess(`Application withdrawn for ${application.jobTitle}`);
    } catch (error) {
      toast.showError("Failed to withdraw application");
    }
  }, [trackInteraction, toast]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      updateRenderMetrics(); // Track refresh performance
      toast.showInfo("Applications refreshed");
    } catch (error) {
      toast.showError("Failed to refresh applications");
    } finally {
      setIsRefreshing(false);
    }
  }, [updateRenderMetrics, toast]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedStatus("");
    toast.showInfo("Filters cleared");
  }, [toast]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="is-container">
        <div className="is-header">
          <h1 className="is-title">My Applications</h1>
          <p className="is-subtitle">Track the status of your job applications</p>
        </div>
        
        <SkeletonTable rows={4} columns={1} />
      </div>
    );
  }

  return (
    <div className="is-container">
      <div className="is-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="is-title">My Applications</h1>
            <p className="is-subtitle">Track the status of your job applications</p>
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

      <div className="is-stats-display">
        <div className="is-stat-item">
          <div className="is-stat-number">{stats.totalApplications}</div>
          <div className="is-stat-label">Total Applications</div>
        </div>
        <div className="is-stat-item">
          <div className="is-stat-number">{stats.inProgress}</div>
          <div className="is-stat-label">In Progress</div>
        </div>
        <div className="is-stat-item">
          <div className="is-stat-number">{stats.interviews}</div>
          <div className="is-stat-label">Interviews</div>
        </div>
        <div className="is-stat-item">
          <div className="is-stat-number">{stats.rejected}</div>
          <div className="is-stat-label">Rejected</div>
        </div>
      </div>

      <div className="is-controls">
        <div className="is-filter-group">
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="is-search"
          />
        </div>
        <div className="is-filter-group">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="is-filter-select"
          >
            <option value="">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Under Review">Under Review</option>
            <option value="Rejected">Rejected</option>
            <option value="Accepted">Accepted</option>
          </select>
        </div>
      </div>

      <div className="is-results">
        {filteredApplications.map((application) => (
          <div key={application.id} className="is-card">
            <div className="is-card-header">
              <div className="is-card-title-section">
                <h3 className="is-card-title">{application.jobTitle}</h3>
                <p className="is-card-subtitle">{application.company}</p>
              </div>
              <div className="is-card-status-section">
                <span
                  className="is-status-tag"
                  style={{ backgroundColor: statusColors[application.status] }}
                >
                  {application.status}
                </span>
              </div>
            </div>

            <div className="is-card-content">
              <div className="is-card-meta">
                <div className="is-meta-item">
                  <span className="is-meta-label">Applied:</span>
                  <span className="is-meta-value">{application.appliedDate}</span>
                </div>
                <div className="is-meta-item">
                  <span className="is-meta-label">Last Updated:</span>
                  <span className="is-meta-value">{application.lastUpdated}</span>
                </div>
              </div>

              <div className="is-card-description">
                <p>{application.description}</p>
              </div>

              <div className="is-card-actions">
                <button 
                  className="is-action"
                  onClick={() => handleViewDetails(application)}
                >
                  View Details
                </button>
                {application.status === "Interview Scheduled" && (
                  <button 
                    className="is-action"
                    onClick={() => handleViewInterview(application)}
                  >
                    View Interview
                  </button>
                )}
                {application.status === "In Progress" && (
                  <button 
                    className="is-action"
                    onClick={() => handleWithdraw(application)}
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="is-empty-state">
          <p>No applications found matching your criteria.</p>
          <button
            onClick={handleClearFilters}
            className="is-action"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApplication && (
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
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Application Details</h2>
              <button
                onClick={() => setSelectedApplication(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Job Title:</label>
                <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>{selectedApplication.jobTitle}</span>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Company:</label>
                <span>{selectedApplication.company}</span>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Status:</label>
                <span
                  style={{ 
                    padding: '0.375rem 0.75rem',
                    backgroundColor: statusColors[selectedApplication.status],
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  {selectedApplication.status}
                </span>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Applied Date:</label>
                <span>{selectedApplication.appliedDate}</span>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Last Updated:</label>
                <span>{selectedApplication.lastUpdated}</span>
              </div>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Description:</label>
                <p style={{ color: '#475569', lineHeight: '1.6' }}>{selectedApplication.description}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setSelectedApplication(null)}
                className="is-button secondary"
              >
                Close
              </button>
              {selectedApplication.status === "Interview Scheduled" && (
                <button
                  onClick={() => handleViewInterview(selectedApplication)}
                  className="is-button"
                >
                  View Interview
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

"use client"

import React, { useState, useEffect } from "react";
import { LoadingSpinner, SkeletonTable } from "../../../../components/LoadingSpinner";
import { EmptySearchResults } from "../../../../components/EmptyState";
import { useToastNotifications } from "../../../../components/Toast";
import { usePerformance } from "../../../../lib/usePerformance";
import "../../../../styles/adminCss/interviewScheduler.css";
import "../../../../styles/adminCss/adminLayout.css";

const COMPANY_NAME = "Time Software";

const mockInterviews = [
  {
    id: 1,
    applicant: "Alice Johnson",
    email: "alice.johnson@email.com",
    jobTitle: "Frontend Developer",
    company: COMPANY_NAME,
    date: "2024-01-15",
    time: "10:00 AM",
    duration: "45 min",
    status: "Scheduled",
    interviewer: "Sarah Manager",
    type: "Technical",
    
  },
  {
    id: 2,
    applicant: "Bob Smith",
    email: "bob.smith@email.com",
    jobTitle: "Backend Engineer",
    company: COMPANY_NAME,
    date: "2024-01-16",
    time: "2:00 PM",
    duration: "60 min",
    status: "Pending",
    interviewer: "Mike Tech Lead",
    type: "Technical",
    
  },
  {
    id: 3,
    applicant: "Carol Lee",
    email: "carol.lee@email.com",
    jobTitle: "UI/UX Designer",
    company: COMPANY_NAME,
    date: "2024-01-17",
    time: "11:00 AM",
    duration: "45 min",
    status: "Scheduled",
    interviewer: "Lisa Designer",
    type: "Portfolio Review",
    
  },
  {
    id: 4,
    applicant: "David Wilson",
    email: "david.wilson@email.com",
    jobTitle: "Product Manager",
    company: COMPANY_NAME,
    date: "2024-01-18",
    time: "3:00 PM",
    duration: "60 min",
    status: "Rescheduled",
    interviewer: "John Product Lead",
    type: "Case Study",
    
  },
  {
    id: 5,
    applicant: "Emma Davis",
    email: "emma.davis@email.com",
    jobTitle: "Data Analyst",
    company: COMPANY_NAME,
    date: "2024-01-19",
    time: "9:00 AM",
    duration: "45 min",
    status: "Scheduled",
    interviewer: "Alex Data Lead",
    type: "Technical",
    
  },
];

const getStatusCount = (list, status) => {
  return list.filter(interview => interview.status === status).length;
};

const getStatusClass = (status) => {
  switch (status) {
    case "Scheduled":
      return "completed";
    case "Pending":
      return "pending";
    case "Rescheduled":
      return "warning";
    case "Completed":
      return "success";
    case "Cancelled":
      return "danger";
    default:
      return "pending";
  }
};

export default function InterviewScheduler() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  // interviewer filter removed with column
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [interviews, setInterviews] = useState(mockInterviews);
  const [reschedule, setReschedule] = useState(null);
  const toast = useToastNotifications();
  const { metrics, trackInteraction, updateRenderMetrics } = usePerformance("InterviewScheduler");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsLoading(false);
        updateRenderMetrics(); // Track initial render
        toast.showSuccess("Interview schedule loaded successfully");
      } catch (error) {
        toast.showError("Failed to load interview schedule");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      updateRenderMetrics(); // Track refresh performance
      toast.showInfo("Interview schedule refreshed");
    } catch (error) {
      toast.showError("Failed to refresh schedule");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleInterviewAction = async (action, interview) => {
    trackInteraction('interview-action');
    try {
      if (action === 'reschedule') {
        setReschedule({ id: interview.id, date: interview.date, time: interview.time });
        return;
      }
      if (action === 'cancel') {
        const confirmed = window.confirm(`Cancel interview for ${interview.applicant}?`);
        if (!confirmed) return;
        setInterviews(prev => prev.map(i => i.id === interview.id ? { ...i, status: 'Cancelled' } : i));
        toast.showSuccess(`Interview cancelled for ${interview.applicant}`);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 300));
      toast.showInfo(`${action} for ${interview.applicant}`);
    } catch (error) {
      toast.showError(`Failed to ${action} for ${interview.applicant}`);
    }
  };

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch = interview.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || interview.status === selectedStatus;
    const matchesDate = !selectedDate || interview.date === selectedDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h1 className="admin-dashboard-title">Interview Scheduler</h1>
          <p className="admin-dashboard-subtitle">
            Manage and schedule job interviews efficiently
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
            <h1 className="admin-dashboard-title">Interview Scheduler</h1>
            <p className="admin-dashboard-subtitle">
              Manage and schedule job interviews efficiently
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

      {/* Stats Overview */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card primary">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Total Interviews</div>
            <div className="admin-stat-icon">📅</div>
          </div>
          <div className="admin-stat-number">{interviews.length}</div>
          <div className="admin-stat-change positive">+2 this week</div>
        </div>
        <div className="admin-stat-card success">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Scheduled</div>
            <div className="admin-stat-icon">✅</div>
          </div>
          <div className="admin-stat-number">{getStatusCount(interviews, "Scheduled")}</div>
          <div className="admin-stat-change positive">+1 today</div>
        </div>
        <div className="admin-stat-card warning">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Pending</div>
            <div className="admin-stat-icon">⏳</div>
          </div>
          <div className="admin-stat-number">{getStatusCount(interviews, "Pending")}</div>
          <div className="admin-stat-change neutral">0 changes</div>
        </div>
        <div className="admin-stat-card danger">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Rescheduled</div>
            <div className="admin-stat-icon">🔄</div>
          </div>
          <div className="admin-stat-number">{getStatusCount(interviews, "Rescheduled")}</div>
          <div className="admin-stat-change negative">+1 today</div>
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
              placeholder="Search interviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="is-search-input"
            />
          </div>
          <div className="is-filter-select">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="is-filter-select-input"
            >
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Pending">Pending</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="is-filter-select">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="is-filter-select-input"
            >
              <option value="">All Dates</option>
              <option value="2024-01-15">Jan 15, 2024</option>
              <option value="2024-01-16">Jan 16, 2024</option>
              <option value="2024-01-17">Jan 17, 2024</option>
              <option value="2024-01-18">Jan 18, 2024</option>
              <option value="2024-01-19">Jan 19, 2024</option>
            </select>
          </div>
          {/* interviewer filter removed */}
        </div>
      </div>

      {/* Interviews Table */}
      <div className="admin-recent-activity">
        <div className="admin-activity-header">
          <h2 className="admin-activity-title">Interview Schedule</h2>
          <span className="admin-activity-subtitle">
            {filteredInterviews.length} interviews found
          </span>
        </div>
        
        {filteredInterviews.length === 0 ? (
          <EmptySearchResults
            searchTerm={searchTerm}
            onClearFilters={() => {
              setSearchTerm("");
              setSelectedStatus("");
              setSelectedDate("");
              setSelectedInterviewer("");
            }}
          />
        ) : (
          <div className="is-table-container">
            <table className="is-table">
              <thead className="is-table-header">
                <tr>
                  <th>Applicant</th>
                  <th>Job Title</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="is-table-body">
                {filteredInterviews.map((interview) => (
                  <tr key={interview.id} className="is-table-row">
                    <td>
                      <div>
                        <div className="is-table-cell-primary">{interview.applicant}</div>
                        <div className="is-table-cell-secondary">{interview.email}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="is-table-cell-primary">{interview.jobTitle}</div>
                        <div className="is-table-cell-secondary">{interview.company}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="is-table-cell-primary">{interview.date}</div>
                        <div className="is-table-cell-secondary">{interview.time} ({interview.duration})</div>
                      </div>
                    </td>
                    <td>{interview.type}</td>
                    <td>
                      <span className={`is-status-tag ${getStatusClass(interview.status)}`}>
                        {interview.status}
                      </span>
                    </td>
                    <td>
                      <div className="is-action-buttons">
                        <button
                          onClick={() => handleInterviewAction("reschedule", interview)}
                          className="is-button secondary small"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleInterviewAction("cancel", interview)}
                          className="is-button danger small"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

      {/* Reschedule Modal */}
      {reschedule && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Reschedule Interview</h2>
              <button onClick={() => setReschedule(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>New Date</label>
                <input className="is-search-input" type="date" value={reschedule.date} onChange={(e) => setReschedule(prev => ({ ...prev, date: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>New Time</label>
                <input className="is-search-input" type="time" value={reschedule.time} onChange={(e) => setReschedule(prev => ({ ...prev, time: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button className="is-button secondary" onClick={() => setReschedule(null)}>Cancel</button>
              <button className="is-button" onClick={() => {
                setInterviews(prev => prev.map(i => i.id === reschedule.id ? { ...i, date: reschedule.date, time: reschedule.time, status: 'Rescheduled' } : i));
                toast.showSuccess('Interview rescheduled');
                setReschedule(null);
              }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
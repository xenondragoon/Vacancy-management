"use client"

import React, { useState, useEffect } from "react";
import { LoadingSpinner, SkeletonTable } from "../../../../components/LoadingSpinner";
import EmptyState from "../../../../components/EmptyState";
import { useToastNotifications } from "../../../../components/Toast";
import { usePerformance } from "../../../../lib/usePerformance";
import "../../../../styles/adminCss/interviewScheduler.css";
import "../../../../styles/adminCss/adminLayout.css";
import "../../../../styles/components/popupModal.css";

const COMPANY_NAME = "Time Software";

const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    status: "Open",
    applicants: 12,
    deadline: "2024-07-15",
    company: COMPANY_NAME,
    
    type: "Full-time",
    experience: "3-5 years"
  },
  {
    id: 2,
    title: "Backend Engineer",
    status: "Closed",
    applicants: 8,
    deadline: "2024-06-30",
    company: COMPANY_NAME,
    
    type: "Full-time",
    experience: "5+ years"
  },
  {
    id: 3,
    title: "QA Tester",
    status: "Open",
    applicants: 5,
    deadline: "2024-07-20",
    company: COMPANY_NAME,
    
    type: "Contract",
    experience: "2-4 years"
  },
  {
    id: 4,
    title: "Product Manager",
    status: "Open",
    applicants: 15,
    deadline: "2024-08-01",
    company: COMPANY_NAME,
    
    type: "Full-time",
    experience: "7+ years"
  },
  {
    id: 5,
    title: "Data Analyst",
    status: "Draft",
    applicants: 0,
    deadline: "2024-08-15",
    company: COMPANY_NAME,
    
    type: "Full-time",
    experience: "2-5 years"
  }
];

const getStatusCount = (jobs, status) => {
  return jobs.filter(job => job.status === status).length;
};

const getStatusClass = (status) => {
  switch (status) {
    case "Open":
      return "completed";
    case "Closed":
      return "success";
    case "Draft":
      return "pending";
    default:
      return "pending";
  }
};

export default function ManageJobPosts() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [jobList, setJobList] = useState(mockJobs);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", type: "Full-time", experience: "0-2 years", deadline: "", status: "Open" });
  const [viewJob, setViewJob] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const toast = useToastNotifications();
  const { metrics, trackInteraction, updateRenderMetrics } = usePerformance("ManageJobPosts");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 900));
        setIsLoading(false);
        updateRenderMetrics(); // Track initial render
        toast.showSuccess("Job posts loaded successfully");
      } catch (error) {
        toast.showError("Failed to load job posts");
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
      toast.showInfo("Job posts refreshed");
    } catch (error) {
      toast.showError("Failed to refresh job posts");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateJob = () => {
    setShowCreateModal(true);
  };

  const handleViewJob = (job) => {
    setViewJob(job);
  };

  const handleEditJob = (job) => {
    setEditJob({ ...job });
  };

  const handleDeleteJob = (job) => {
    const confirmed = window.confirm(`Delete job "${job.title}"?`);
    if (!confirmed) return;
    setJobList(prev => prev.filter(j => j.id !== job.id));
    toast.showSuccess(`Job deleted: ${job.title}`);
  };

  const submitCreateJob = async () => {
    trackInteraction('create-job');
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      setJobList(prev => {
        const nextId = prev.length > 0 ? Math.max(...prev.map(j => j.id)) + 1 : 1;
        const created = {
          id: nextId,
          title: newJob.title.trim(),
          status: newJob.status,
          applicants: 0,
          deadline: newJob.deadline,
          company: COMPANY_NAME,
          
          type: newJob.type,
          experience: newJob.experience,
        };
        return [...prev, created];
      });
      setShowCreateModal(false);
      setNewJob({ title: "", type: "Full-time", experience: "0-2 years", deadline: "", status: "Open" });
      toast.showSuccess("New job post created successfully");
    } catch (error) {
      toast.showError("Failed to create job post");
    }
  };

  const submitEditJob = async () => {
    trackInteraction('edit-job');
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setJobList(prev => prev.map(j => j.id === editJob.id ? { ...j, ...editJob } : j));
      toast.showSuccess(`Updated job: ${editJob.title}`);
      setEditJob(null);
    } catch (error) {
      toast.showError("Failed to edit job");
    }
  };

  const filteredJobs = jobList.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? job.status === statusFilter : true) &&
      (typeFilter ? job.type === typeFilter : true)
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h1 className="admin-dashboard-title">Manage Job Posts</h1>
          <p className="admin-dashboard-subtitle">
            Create, edit, and manage job postings
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
            <h1 className="admin-dashboard-title">Manage Job Posts</h1>
            <p className="admin-dashboard-subtitle">
              Create, edit, and manage job postings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateJob}
              className="is-button"
            >
              💼 Create Job Post
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
            <div className="admin-stat-title">Total Jobs</div>
            <div className="admin-stat-icon">💼</div>
          </div>
          <div className="admin-stat-number">{jobList.length}</div>
          <div className="admin-stat-change positive">+2 this month</div>
        </div>
        <div className="admin-stat-card success">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Open Positions</div>
            <div className="admin-stat-icon">✅</div>
          </div>
          <div className="admin-stat-number">{getStatusCount(jobList, "Open")}</div>
          <div className="admin-stat-change positive">+1 today</div>
        </div>
        <div className="admin-stat-card warning">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Draft Posts</div>
            <div className="admin-stat-icon">📝</div>
          </div>
          <div className="admin-stat-number">{getStatusCount(jobList, "Draft")}</div>
          <div className="admin-stat-change neutral">0 changes</div>
        </div>
        <div className="admin-stat-card info">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Total Applicants</div>
            <div className="admin-stat-icon">👥</div>
          </div>
          <div className="admin-stat-number">{jobList.reduce((sum, job) => sum + job.applicants, 0)}</div>
          <div className="admin-stat-change positive">+8 this week</div>
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
              placeholder="Search job posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="is-search-input"
            />
          </div>
          <div className="is-filter-select">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="is-filter-select-input"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div className="is-filter-select">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="is-filter-select-input"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="admin-recent-activity">
        <div className="admin-activity-header">
          <h2 className="admin-activity-title">Job Posts</h2>
          <span className="admin-activity-subtitle">
            {filteredJobs.length} jobs found
          </span>
        </div>
        
        {filteredJobs.length === 0 ? (
          <EmptyState
            title="No job posts found"
            message="Try adjusting your filters or search term."
            buttonText="Clear Filters"
            onButtonClick={() => {
              setSearch("");
              setStatusFilter("");
              setTypeFilter("");
            }}
          />
        ) : (
          <div className="is-table-container compact-table">
            <table className="is-table">
              <thead className="is-table-header">
                <tr>
                  <th>Job Title</th>
                  <th>Type</th>
                  <th>Experience</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="is-table-body">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="is-table-row">
                    <td>
                      <div className="is-table-cell-primary">{job.title}</div>
                    </td>
                    <td>{job.type}</td>
                    <td>{job.experience}</td>
                    <td>{job.deadline}</td>
                    <td>
                      <span className={`is-status-tag ${getStatusClass(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>
                      <div className="is-action-buttons">
                        <button
                          onClick={() => handleViewJob(job)}
                          className="is-button primary small"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditJob(job)}
                          className="is-button secondary small"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job)}
                          className="is-button danger small"
                        >
                          Delete
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

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="popup-modal">
          <div className="popup-content">
            <div className="modal-header">
              <h2 className="modal-title">Create Job Post</h2>
              <button onClick={() => setShowCreateModal(false)} className="modal-close">
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-input-group">
                <input value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} placeholder="Job Title" className="is-search-input" />
                <select value={newJob.type} onChange={(e) => setNewJob({ ...newJob, type: e.target.value })} className="is-filter-select-input">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
                
                <input value={newJob.experience} onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })} placeholder="Experience (e.g., 3-5 years)" className="is-search-input" />
                <input value={newJob.deadline} onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })} placeholder="Deadline (YYYY-MM-DD)" className="is-search-input" />
                <select value={newJob.status} onChange={(e) => setNewJob({ ...newJob, status: e.target.value })} className="is-filter-select-input">
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="is-button secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="is-button" onClick={submitCreateJob} disabled={!newJob.title || !newJob.deadline}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* View Job Modal */}
      {viewJob && (
        <div className="popup-modal">
          <div className="popup-content">
            <div className="modal-header">
              <h2 className="modal-title">Job Details</h2>
              <button onClick={() => setViewJob(null)} className="modal-close">
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-detail">
                <strong>Title:</strong> {viewJob.title}
              </div>
              <div className="modal-detail">
                <strong>Status:</strong> {viewJob.status}
              </div>
              <div className="modal-detail">
                <strong>Type:</strong> {viewJob.type}
              </div>
              <div className="modal-detail">
                <strong>Experience:</strong> {viewJob.experience}
              </div>
              <div className="modal-detail">
                <strong>Deadline:</strong> {viewJob.deadline}
              </div>
              
              <div className="modal-detail">
                <strong>Applicants:</strong> {viewJob.applicants}
              </div>
            </div>
            <div className="modal-footer">
              <button className="is-button secondary" onClick={() => setViewJob(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editJob && (
        <div className="popup-modal">
          <div className="popup-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Job</h2>
              <button onClick={() => setEditJob(null)} className="modal-close">
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-input-group">
                <input value={editJob.title} onChange={(e) => setEditJob({ ...editJob, title: e.target.value })} placeholder="Job Title" className="is-search-input" />
                <select value={editJob.type} onChange={(e) => setEditJob({ ...editJob, type: e.target.value })} className="is-filter-select-input">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
                
                <input value={editJob.experience} onChange={(e) => setEditJob({ ...editJob, experience: e.target.value })} placeholder="Experience" className="is-search-input" />
                <input value={editJob.deadline} onChange={(e) => setEditJob({ ...editJob, deadline: e.target.value })} placeholder="Deadline (YYYY-MM-DD)" className="is-search-input" />
                <select value={editJob.status} onChange={(e) => setEditJob({ ...editJob, status: e.target.value })} className="is-filter-select-input">
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="is-button secondary" onClick={() => setEditJob(null)}>Cancel</button>
              <button className="is-button" onClick={submitEditJob} disabled={!editJob.title || !editJob.deadline}>Save</button>
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
            <div className="performance-metrics-grid">
              <div className="performance-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>
                {metrics.renderTime ? `${metrics.renderTime.toFixed(1)}ms` : 'N/A'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Render Time</div>
            </div>
              <div className="performance-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>
                {metrics.renderCount || 0}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Render Count</div>
            </div>
              <div className="performance-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💾</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>
                {metrics.memoryUsage ? `${metrics.memoryUsage.used}MB` : 'N/A'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Memory Usage</div>
            </div>
              <div className="performance-card">
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
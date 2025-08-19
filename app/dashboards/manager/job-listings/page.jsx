"use client";

import React, { useState, useEffect } from "react";
import { LoadingSpinner, SkeletonTable } from "../../../../components/LoadingSpinner";
import { EmptyState } from "../../../../components/EmptyState";
import { useToastNotifications } from "../../../../components/Toast";
import { usePerformance } from "../../../../lib/usePerformance";
import "../../../../styles/adminCss/interviewScheduler.css";
import "../../../../styles/managerCss/managerLayout.css";

const COMPANY_NAME = "Time Software";

const mockJobListings = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering",
    location: "New York, NY",
    type: "Full-time",
    status: "Active",
    applications: 12,
    postedDate: "2024-01-10",
    deadline: "2024-02-10",
    salary: "$80,000 - $100,000",
    experience: "3-5 years"
  },
  {
    id: 2,
    title: "Backend Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    status: "Active",
    applications: 8,
    postedDate: "2024-01-08",
    deadline: "2024-02-08",
    salary: "$90,000 - $120,000",
    experience: "5+ years"
  },
  {
    id: 3,
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Contract",
    status: "Draft",
    applications: 0,
    postedDate: "2024-01-05",
    deadline: "2024-02-05",
    salary: "$60,000 - $80,000",
    experience: "2-4 years"
  },
  {
    id: 4,
    title: "Product Manager",
    department: "Product",
    location: "Boston, MA",
    type: "Full-time",
    status: "Closed",
    applications: 25,
    postedDate: "2024-01-03",
    deadline: "2024-02-03",
    salary: "$100,000 - $140,000",
    experience: "7+ years"
  },
  {
    id: 5,
    title: "Data Scientist",
    department: "Analytics",
    location: "Austin, TX",
    type: "Full-time",
    status: "Active",
    applications: 15,
    postedDate: "2024-01-12",
    deadline: "2024-02-12",
    salary: "$85,000 - $110,000",
    experience: "4-6 years"
  }
];

const getStatusCount = (status) => {
  return mockJobListings.filter(job => job.status === status).length;
};

const getStatusClass = (status) => {
  switch (status) {
    case "Active":
      return "completed";
    case "Draft":
      return "pending";
    case "Closed":
      return "success";
    case "Pending":
      return "warning";
    default:
      return "pending";
  }
};

export default function JobListings() {
  const [jobListings, setJobListings] = useState(mockJobListings);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToastNotifications();
  const { metrics, trackInteraction, updateRenderMetrics } = usePerformance("JobListings");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        updateRenderMetrics(); // Track initial render
        toast.showSuccess("Job listings loaded successfully");
      } catch (error) {
        toast.showError("Failed to load job listings");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      updateRenderMetrics(); // Track refresh performance
      toast.showInfo("Job listings refreshed");
    } catch (error) {
      toast.showError("Failed to refresh job listings");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateJob = async () => {
    trackInteraction('create-job');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.showSuccess("New job listing created successfully");
      setShowCreateForm(false);
    } catch (error) {
      toast.showError("Failed to create job listing");
    }
  };

  const handleEditJob = async (job) => {
    trackInteraction('edit-job');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 600));
      toast.showSuccess(`Editing job: ${job.title}`);
    } catch (error) {
      toast.showError("Failed to edit job");
    }
  };

  const handleDeleteJob = async (job) => {
    trackInteraction('delete-job');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 700));
      toast.showSuccess(`Job deleted: ${job.title}`);
    } catch (error) {
      toast.showError("Failed to delete job");
    }
  };

  const handleViewApplications = async (job) => {
    trackInteraction('view-applications');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.showInfo(`Viewing applications for: ${job.title}`);
    } catch (error) {
      toast.showError("Failed to view applications");
    }
  };

  const filteredJobListings = jobListings.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedStatus ? job.status === selectedStatus : true) &&
      (selectedDepartment ? job.department === selectedDepartment : true)
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h1 className="admin-dashboard-title">Job Listings</h1>
          <p className="admin-dashboard-subtitle">
            Manage and monitor job postings
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
            <h1 className="admin-dashboard-title">Job Listings</h1>
            <p className="admin-dashboard-subtitle">
              Manage and monitor job postings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="is-button"
            >
              💼 Create Job
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
          <div className="admin-stat-number">{jobListings.length}</div>
          <div className="admin-stat-change positive">+2 this month</div>
        </div>
        <div className="admin-stat-card success">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Active Jobs</div>
            <div className="admin-stat-icon">✅</div>
          </div>
          <div className="admin-stat-number">{getStatusCount("Active")}</div>
          <div className="admin-stat-change positive">+1 today</div>
        </div>
        <div className="admin-stat-card warning">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Draft Jobs</div>
            <div className="admin-stat-icon">📝</div>
          </div>
          <div className="admin-stat-number">{getStatusCount("Draft")}</div>
          <div className="admin-stat-change neutral">0 changes</div>
        </div>
        <div className="admin-stat-card info">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Total Applications</div>
            <div className="admin-stat-icon">👥</div>
          </div>
          <div className="admin-stat-number">{jobListings.reduce((sum, job) => sum + job.applications, 0)}</div>
          <div className="admin-stat-change positive">+15 this week</div>
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
              placeholder="Search job listings..."
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
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Closed">Closed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="is-filter-select">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="is-filter-select-input"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Product">Product</option>
              <option value="Analytics">Analytics</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Listings Table */}
      <div className="admin-recent-activity">
        <div className="admin-activity-header">
          <h2 className="admin-activity-title">Job Listings</h2>
          <span className="admin-activity-subtitle">
            {filteredJobListings.length} jobs found
          </span>
        </div>
        
        {filteredJobListings.length === 0 ? (
          <EmptySearchResults
            searchTerm={searchTerm}
            onClearFilters={() => {
              setSearchTerm("");
              setSelectedStatus("");
              setSelectedDepartment("");
            }}
          />
        ) : (
          <div className="is-table-container">
            <table className="is-table">
              <thead className="is-table-header">
                <tr>
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Applications</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="is-table-body">
                {filteredJobListings.map((job) => (
                  <tr key={job.id} className="is-table-row">
                    <td>
                      <div>
                        <div className="is-table-cell-primary">{job.title}</div>
                        <div className="is-table-cell-secondary">{job.salary} • {job.experience}</div>
                      </div>
                    </td>
                    <td>{job.department}</td>
                    <td>{job.location}</td>
                    <td>{job.type}</td>
                    <td>
                      <span className="is-status-tag info">{job.applications} applicants</span>
                    </td>
                    <td>{job.deadline}</td>
                    <td>
                      <span className={`is-status-tag ${getStatusClass(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>
                      <div className="is-action-buttons">
                        <button
                          onClick={() => handleViewApplications(job)}
                          className="is-button primary small"
                        >
                          View Apps
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

      {/* Create Job Form Modal */}
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
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Create New Job</h2>
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
                placeholder="Job Title"
                className="is-search-input"
              />
              <select className="is-filter-select-input">
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Analytics">Analytics</option>
              </select>
              <input
                type="text"
                placeholder="Location"
                className="is-search-input"
              />
              <select className="is-filter-select-input">
                <option value="">Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
              <input
                type="text"
                placeholder="Salary Range"
                className="is-search-input"
              />
              <input
                type="text"
                placeholder="Experience Required"
                className="is-search-input"
              />
            </div>
            
            <textarea
              placeholder="Job Description"
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                resize: 'vertical',
                marginBottom: '1.5rem'
              }}
            />
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateForm(false)}
                className="is-button secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateJob}
                className="is-button"
              >
                Create Job
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

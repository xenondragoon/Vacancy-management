"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner, SkeletonTable } from "../../../../components/LoadingSpinner";
import { EmptySearchResults } from "../../../../components/EmptyState";
import { useToastNotifications } from "../../../../components/Toast";
import { usePerformance } from "../../../../lib/usePerformance";
import "../../../../styles/adminCss/interviewScheduler.css";
import "../../../../styles/adminCss/adminLayout.css";

const COMPANY_NAME = "Time Software";

const mockApplicants = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    jobTitle: "Frontend Developer",
    company: COMPANY_NAME,
    status: "New",
    appliedDate: "2024-01-15",
    experience: "3 years",
    skills: ["React", "JavaScript", "CSS", "HTML"],
    avatar: "AJ"
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@email.com",
    jobTitle: "Backend Engineer",
    company: COMPANY_NAME,
    status: "Shortlisted",
    appliedDate: "2024-01-14",
    experience: "5 years",
    skills: ["Node.js", "Python", "PostgreSQL", "AWS"],
    avatar: "BS"
  },
  {
    id: 3,
    name: "Carol Lee",
    email: "carol.lee@email.com",
    jobTitle: "UI/UX Designer",
    company: COMPANY_NAME,
    status: "Interview",
    appliedDate: "2024-01-13",
    experience: "4 years",
    skills: ["Figma", "Adobe Creative Suite", "User Research"],
    avatar: "CL"
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@email.com",
    jobTitle: "Product Manager",
    company: COMPANY_NAME,
    status: "Rejected",
    appliedDate: "2024-01-12",
    experience: "6 years",
    skills: ["Product Strategy", "Agile", "Data Analysis"],
    avatar: "DW"
  },
  {
    id: 5,
    name: "Emma Davis",
    email: "emma.davis@email.com",
    jobTitle: "Data Analyst",
    company: COMPANY_NAME,
    status: "New",
    appliedDate: "2024-01-11",
    experience: "2 years",
    skills: ["Python", "SQL", "Tableau", "Statistics"],
    avatar: "ED"
  },
  {
    id: 6,
    name: "Frank Miller",
    email: "frank.miller@email.com",
    jobTitle: "DevOps Engineer",
    company: COMPANY_NAME,
    status: "Shortlisted",
    appliedDate: "2024-01-10",
    experience: "4 years",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    avatar: "FM"
  }
];

const getStatusCount = (list, status) => {
  return list.filter(app => app.status === status).length;
};

const getStatusClass = (status) => {
  switch (status) {
    case "New":
      return "pending";
    case "Shortlisted":
      return "completed";
    case "Interview":
      return "warning";
    case "Rejected":
      return "danger";
    default:
      return "pending";
  }
};

export default function ViewApplicants() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [applicants, setApplicants] = useState(mockApplicants);
  const [viewApplicant, setViewApplicant] = useState(null);
  const toast = useToastNotifications();
  const { metrics, trackInteraction, updateRenderMetrics } = usePerformance("ViewApplicants");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1100));
        setIsLoading(false);
        updateRenderMetrics(); // Track initial render
        toast.showSuccess("Applicants data loaded successfully");
      } catch (error) {
        toast.showError("Failed to load applicants data");
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
      toast.showInfo("Applicants data refreshed");
    } catch (error) {
      toast.showError("Failed to refresh applicants data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleApplicantAction = async (action, applicant) => {
    trackInteraction('applicant-action');
    try {
      if (action === 'view') {
        setViewApplicant(applicant);
        return;
      }

      if (action === 'shortlist') {
        await new Promise(resolve => setTimeout(resolve, 250));
        setApplicants(prev => prev.map(a => a.id === applicant.id ? { ...a, status: 'Shortlisted' } : a));
        toast.showSuccess(`${applicant.name} shortlisted`);
        return;
      }

      if (action === 'reject') {
        await new Promise(resolve => setTimeout(resolve, 250));
        setApplicants(prev => prev.map(a => a.id === applicant.id ? { ...a, status: 'Rejected' } : a));
        toast.showInfo(`${applicant.name} rejected`);
        return;
      }

      if (action === 'schedule interview' || action === 'interview') {
        const applicantName = encodeURIComponent(applicant.name);
        const jobTitle = encodeURIComponent(applicant.jobTitle || '');
        router.push(`/dashboards/admin/interview-scheduler?applicant=${applicantName}&job=${jobTitle}`);
        return;
      }

      // Fallback simulated action
      await new Promise(resolve => setTimeout(resolve, 400));
      toast.showSuccess(`${action} for ${applicant.name} completed successfully`);
    } catch (error) {
      toast.showError(`Failed to ${action} for ${applicant.name}`);
    }
  };

  const filteredApplicants = applicants.filter((applicant) => {
    const lower = search.toLowerCase();
    const matchesSearch = (
      applicant.name.toLowerCase().includes(lower) ||
      applicant.email.toLowerCase().includes(lower) ||
      (applicant.jobTitle || "").toLowerCase().includes(lower)
    );
    const matchesStatus = statusFilter ? applicant.status === statusFilter : true;
    const matchesJob = jobFilter ? applicant.jobTitle === jobFilter : true;
    return matchesSearch && matchesStatus && matchesJob;
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h1 className="admin-dashboard-title">View Applicants</h1>
          <p className="admin-dashboard-subtitle">
            Review and manage job applications
          </p>
        </div>
        
        <SkeletonTable rows={7} columns={8} />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <div className="admin-dashboard-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="admin-dashboard-title">View Applicants</h1>
            <p className="admin-dashboard-subtitle">
              Review and manage job applications
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
            <div className="admin-stat-title">Total Applicants</div>
            <div className="admin-stat-icon">👥</div>
          </div>
          <div className="admin-stat-number">{applicants.length}</div>
          <div className="admin-stat-change positive">+3 this week</div>
        </div>
        <div className="admin-stat-card warning">
          <div className="admin-stat-header">
            <div className="admin-stat-title">New Applications</div>
            <div className="admin-stat-icon">🆕</div>
          </div>
          <div className="admin-stat-number">{getStatusCount(applicants, "New")}</div>
          <div className="admin-stat-change positive">+2 today</div>
        </div>
        <div className="admin-stat-card success">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Shortlisted</div>
            <div className="admin-stat-icon">✅</div>
          </div>
          <div className="admin-stat-number">{getStatusCount(applicants, "Shortlisted")}</div>
          <div className="admin-stat-change positive">+1 today</div>
        </div>
        <div className="admin-stat-card info">
          <div className="admin-stat-header">
            <div className="admin-stat-title">In Interview</div>
            <div className="admin-stat-icon">📅</div>
          </div>
          <div className="admin-stat-number">{getStatusCount(applicants, "Interview")}</div>
          <div className="admin-stat-change neutral">0 changes</div>
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
              placeholder="Search applicants..."
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
              <option value="New">New</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="is-filter-select">
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="is-filter-select-input"
            >
              <option value="">All Jobs</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="admin-recent-activity">
        <div className="admin-activity-header">
          <h2 className="admin-activity-title">Applicants</h2>
          <span className="admin-activity-subtitle">
            {filteredApplicants.length} applicants found
          </span>
        </div>
        
        {filteredApplicants.length === 0 ? (
          <EmptySearchResults
            searchTerm={search}
            onClearFilters={() => {
              setSearch("");
              setStatusFilter("");
              setJobFilter("");
            }}
          />
        ) : (
          <div className="is-table-container applicants-compact">
            <table className="is-table">
              <thead className="is-table-header">
                <tr>
                  <th>Applicant</th>
                  <th>Job Details</th>
                  <th>Experience</th>
                  <th>Skills</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="is-table-body">
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant.id} className="is-table-row">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '0.875rem'
                        }}>
                          {applicant.avatar}
                        </div>
                        <div>
                          <div className="is-table-cell-primary">{applicant.name}</div>
                          <div className="is-table-cell-secondary">{applicant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="is-table-cell-primary">{applicant.jobTitle}</div>
                        <div className="is-table-cell-secondary">{applicant.company}</div>
                      </div>
                    </td>
                    <td>{applicant.experience}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {applicant.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: '#f1f5f9',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              color: '#475569'
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                        {applicant.skills.length > 3 && (
                          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                            +{applicant.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{applicant.appliedDate}</td>
                    <td>
                      <span className={`is-status-tag ${getStatusClass(applicant.status)}`}>
                        {applicant.status}
                      </span>
                    </td>
                    <td>
                      <div className="is-action-buttons">
                        <button
                          onClick={() => handleApplicantAction("view", applicant)}
                          className="is-button primary small"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleApplicantAction("shortlist", applicant)}
                          className="is-button secondary small"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleApplicantAction("schedule interview", applicant)}
                          className="is-button warning small"
                        >
                          Interview
                        </button>
                        <button
                          onClick={() => handleApplicantAction("reject", applicant)}
                          className="is-button danger small"
                        >
                          Reject
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
      {/* View Applicant Modal */}
      {viewApplicant && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '720px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Applicant Details</h2>
              <button onClick={() => setViewApplicant(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div><strong>Name:</strong> {viewApplicant.name}</div>
              <div><strong>Email:</strong> {viewApplicant.email}</div>
              <div><strong>Job Title:</strong> {viewApplicant.jobTitle}</div>
              <div><strong>Applied:</strong> {viewApplicant.appliedDate}</div>
              <div><strong>Experience:</strong> {viewApplicant.experience}</div>
              <div><strong>Status:</strong> {viewApplicant.status}</div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Skills:</strong> {Array.isArray(viewApplicant.skills) ? viewApplicant.skills.join(', ') : ''}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button className="is-button secondary" onClick={() => setViewApplicant(null)}>Close</button>
              <button className="is-button warning" onClick={() => { setViewApplicant(null); handleApplicantAction('schedule interview', viewApplicant); }}>Schedule Interview</button>
              <button className="is-button" onClick={() => { setViewApplicant(null); handleApplicantAction('shortlist', viewApplicant); }}>Shortlist</button>
              <button className="is-button danger" onClick={() => { setViewApplicant(null); handleApplicantAction('reject', viewApplicant); }}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
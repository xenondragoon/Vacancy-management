"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner, SkeletonTable } from "../../../../components/LoadingSpinner";
import { EmptyState } from "../../../../components/EmptyState";
import { useToastNotifications } from "../../../../components/Toast";
import { usePerformance } from "../../../../lib/usePerformance";
import "../../../../styles/adminCss/interviewScheduler.css";
import "../../../../styles/managerCss/managerLayout.css";

const mockApplicants = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    position: "Frontend Developer",
    status: "Under Review",
    appliedDate: "2024-01-10",
    experience: "3 years",
    skills: ["React", "JavaScript", "CSS", "HTML"],
    resume: "john_doe_resume.pdf",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1 (555) 987-6543",
    position: "Backend Engineer",
    status: "Interview Scheduled",
    appliedDate: "2024-01-08",
    experience: "5 years",
    skills: ["Node.js", "Python", "PostgreSQL", "AWS"],
    resume: "jane_smith_resume.pdf",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "+1 (555) 456-7890",
    position: "UI/UX Designer",
    status: "Rejected",
    appliedDate: "2024-01-05",
    experience: "2 years",
    skills: ["Figma", "Adobe Creative Suite", "User Research"],
    resume: "mike_johnson_resume.pdf",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "+1 (555) 789-0123",
    position: "Product Manager",
    status: "Shortlisted",
    appliedDate: "2024-01-03",
    experience: "7 years",
    skills: ["Product Strategy", "Agile", "Data Analysis", "Leadership"],
    resume: "sarah_wilson_resume.pdf",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@email.com",
    phone: "+1 (555) 321-6540",
    position: "Frontend Developer",
    status: "Under Review",
    appliedDate: "2024-01-12",
    experience: "4 years",
    skills: ["Vue.js", "TypeScript", "Sass", "Webpack"],
    resume: "david_brown_resume.pdf",
  },
];

const getStatusCount = (status) => {
  return mockApplicants.filter(app => app.status === status).length;
};

const getStatusClass = (status) => {
  switch (status) {
    case "Under Review":
      return "pending";
    case "Interview Scheduled":
      return "warning";
    case "Shortlisted":
      return "completed";
    case "Rejected":
      return "danger";
    case "Hired":
      return "success";
    default:
      return "pending";
  }
};

export default function Applicants() {
  const router = useRouter();
  const [applicants, setApplicants] = useState(mockApplicants);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToastNotifications();
  const { metrics, trackInteraction, updateRenderMetrics } = usePerformance("Applicants");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 950));
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
      await new Promise(resolve => setTimeout(resolve, 550));
      updateRenderMetrics(); // Track refresh performance
      toast.showInfo("Applicants data refreshed");
    } catch (error) {
      toast.showError("Failed to refresh applicants data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStatusChange = async (applicantId, newStatus) => {
    trackInteraction('status-change');
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 600));
      setApplicants(prev =>
        prev.map(applicant =>
          applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant
        )
      );
      toast.showSuccess(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.showError("Failed to update status");
    }
  };

  const handleViewResume = async (applicant) => {
    trackInteraction('view-resume');
    try {
      await new Promise(resolve => setTimeout(resolve, 250));
      setSelectedApplicant(applicant);
    } catch (error) {
      toast.showError("Failed to open resume");
    }
  };

  const handleDownloadResume = (applicant) => {
    const content = `Resume for ${applicant.name}\nEmail: ${applicant.email}\nPhone: ${applicant.phone}\nPosition: ${applicant.position}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = applicant.resume || `${applicant.name.replace(/\s+/g, '_')}_resume.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.showSuccess('Resume download started');
  };

  const handleScheduleInterview = async (applicant) => {
    trackInteraction('schedule-interview');
    try {
      const applicantName = encodeURIComponent(applicant.name);
      const position = encodeURIComponent(applicant.position || "");
      router.push(`/dashboards/admin/interview-scheduler?applicant=${applicantName}&position=${position}`);
    } catch (error) {
      toast.showError("Failed to open scheduler");
    }
  };

  const handleSendEmail = async (applicant) => {
    trackInteraction('send-email');
    try {
      const subject = encodeURIComponent(`Regarding your application for ${applicant.position}`);
      const body = encodeURIComponent(`Hi ${applicant.name},%0D%0A%0D%0A`);
      window.location.href = `mailto:${applicant.email}?subject=${subject}&body=${body}`;
    } catch (error) {
      toast.showError("Failed to open email client");
    }
  };

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesStatus = !selectedStatus || applicant.status === selectedStatus;
    const matchesPosition = !selectedPosition || applicant.position === selectedPosition;
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPosition && matchesSearch;
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h1 className="admin-dashboard-title">Applicants</h1>
          <p className="admin-dashboard-subtitle">
            Review and manage job applications
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
            <h1 className="admin-dashboard-title">Applicants</h1>
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
            <div className="admin-stat-title">Under Review</div>
            <div className="admin-stat-icon">🔍</div>
          </div>
          <div className="admin-stat-number">{getStatusCount("Under Review")}</div>
          <div className="admin-stat-change positive">+2 today</div>
        </div>
        <div className="admin-stat-card success">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Shortlisted</div>
            <div className="admin-stat-icon">✅</div>
          </div>
          <div className="admin-stat-number">{getStatusCount("Shortlisted")}</div>
          <div className="admin-stat-change positive">+1 today</div>
        </div>
        <div className="admin-stat-card info">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Interview Scheduled</div>
            <div className="admin-stat-icon">📅</div>
          </div>
          <div className="admin-stat-number">{getStatusCount("Interview Scheduled")}</div>
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
              <option value="Under Review">Under Review</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
          </div>
          <div className="is-filter-select">
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="is-filter-select-input"
            >
              <option value="">All Positions</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Product Manager">Product Manager</option>
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
            searchTerm={searchTerm}
            onClearFilters={() => {
              setSearchTerm("");
              setSelectedStatus("");
              setSelectedPosition("");
            }}
          />
        ) : (
          <div className="is-table-container">
            <table className="is-table">
              <thead className="is-table-header">
                <tr>
                  <th>Applicant</th>
                  <th>Position</th>
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
                      <div>
                        <div className="is-table-cell-primary">{applicant.name}</div>
                        <div className="is-table-cell-secondary">{applicant.email}</div>
                        <div className="is-table-cell-secondary">{applicant.phone}</div>
                      </div>
                    </td>
                    <td>{applicant.position}</td>
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
                          onClick={() => handleViewResume(applicant)}
                          className="is-button primary small"
                        >
                          Resume
                        </button>
                        <button
                          onClick={() => handleScheduleInterview(applicant)}
                          className="is-button secondary small"
                        >
                          Interview
                        </button>
                        <button
                          onClick={() => handleSendEmail(applicant)}
                          className="is-button warning small"
                        >
                          Email
                        </button>
                        <select
                          value={applicant.status}
                          onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                          className="is-filter-select-input"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Hired">Hired</option>
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

      {/* Resume Preview Modal */}
      {selectedApplicant && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '720px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Resume - {selectedApplicant.name}</h2>
              <button onClick={() => setSelectedApplicant(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', color: '#475569', marginBottom: '1rem' }}>
              File: {selectedApplicant.resume || 'resume.txt'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="is-button secondary" onClick={() => setSelectedApplicant(null)}>Close</button>
              <button className="is-button warning" onClick={() => handleScheduleInterview(selectedApplicant)}>Schedule Interview</button>
              <button className="is-button" onClick={() => handleDownloadResume(selectedApplicant)}>Download</button>
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

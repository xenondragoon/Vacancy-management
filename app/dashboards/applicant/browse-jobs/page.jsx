"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { LoadingSpinner, SkeletonTable } from "../../../../components/LoadingSpinner";
import { EmptyState } from "../../../../components/EmptyState";
import { useToastNotifications } from "../../../../components/Toast";
import { usePerformance } from "../../../../lib/usePerformance";
import "../../../../styles/adminCss/interviewScheduler.css";
import "../../../../styles/applicantCss/applicantLayout.css";
import "../../../../styles/components/popupModal.css";

// Memoized mock data for better performance
const COMPANY_NAME = "Time Software";

const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: COMPANY_NAME,
    
    type: "Full-time",
    salary: "$80,000 - $100,000",
    description: "We are looking for a skilled Frontend Developer to join our team and help build amazing user experiences. You'll work with modern technologies like React, TypeScript, and CSS-in-JS.",
    requirements: ["React", "JavaScript", "CSS", "HTML", "TypeScript"],
    postedDate: "2024-01-15",
    experience: "3-5 years",
    benefits: ["Health Insurance", "401k", "Remote Work", "Flexible Hours"]
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: COMPANY_NAME,
    
    type: "Full-time",
    salary: "$90,000 - $120,000",
    description: "Join our growing team as a Backend Engineer and help scale our infrastructure. You'll work with cutting-edge technologies and have a real impact on our product.",
    requirements: ["Node.js", "Python", "PostgreSQL", "AWS", "Docker"],
    postedDate: "2024-01-14",
    experience: "5+ years",
    benefits: ["Equity", "Health Insurance", "Unlimited PTO", "Home Office Setup"]
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: COMPANY_NAME,
    
    type: "Contract",
    salary: "$60,000 - $80,000",
    description: "Creative UI/UX Designer needed for exciting projects. You'll work on user research, wireframing, prototyping, and creating beautiful, functional designs.",
    requirements: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
    postedDate: "2024-01-13",
    experience: "2-4 years",
    benefits: ["Flexible Schedule", "Project-based Work", "Creative Freedom"]
  },
  {
    id: 4,
    title: "Product Manager",
    company: COMPANY_NAME,
    
    type: "Full-time",
    salary: "$100,000 - $140,000",
    description: "Lead product strategy and execution for our innovative products. You'll work closely with engineering, design, and business teams to deliver exceptional user experiences.",
    requirements: ["Product Strategy", "Agile", "Data Analysis", "User Research", "Stakeholder Management"],
    postedDate: "2024-01-12",
    experience: "7+ years",
    benefits: ["Competitive Salary", "Health Benefits", "Professional Development", "Team Events"]
  },
  {
    id: 5,
    title: "Data Analyst",
    company: COMPANY_NAME,
    
    type: "Full-time",
    salary: "$70,000 - $90,000",
    description: "Transform raw data into actionable insights. You'll work with large datasets, create visualizations, and help drive data-informed decisions across the organization.",
    requirements: ["Python", "SQL", "Tableau", "Statistics", "Excel"],
    postedDate: "2024-01-11",
    experience: "2-5 years",
    benefits: ["Health Insurance", "401k", "Learning Budget", "Flexible Work"]
  }
];

export default function BrowseJobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  
  const [selectedExperience, setSelectedExperience] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [applications, setApplications] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyJobId, setApplyJobId] = useState(null);
  const [applyExperience, setApplyExperience] = useState("");
  const [applySkills, setApplySkills] = useState("");
  const [applyResume, setApplyResume] = useState(null);
  const [sortBy, setSortBy] = useState("title");
  const [showSavedJobsModal, setShowSavedJobsModal] = useState(false);
  const [showJobAlertsModal, setShowJobAlertsModal] = useState(false);
  const [alertKeywords, setAlertKeywords] = useState("");
  const [alertFrequency, setAlertFrequency] = useState("Daily");
  const toast = useToastNotifications();
  const { metrics, trackInteraction, updateRenderMetrics } = usePerformance("BrowseJobs");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsLoading(false);
        updateRenderMetrics(); // Track initial render
        toast.showSuccess("Job listings loaded successfully");
      } catch (error) {
        toast.showError("Failed to load job listings");
        setIsLoading(false);
      }
    };

    loadData();
  }, [updateRenderMetrics, toast]);

  // Memoized filtered jobs for better performance
  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || job.type === selectedType;
      const matchesExperience = !selectedExperience || job.experience === selectedExperience;
      
      return matchesSearch && matchesType && matchesExperience;
    });
  }, [searchTerm, selectedType, selectedExperience]);

  const sortedJobs = useMemo(() => {
    const jobs = [...filteredJobs];
    if (sortBy === "date") {
      jobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    } else if (sortBy === "title") {
      jobs.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "salary") {
      // Extract min salary for sorting
      jobs.sort((a, b) => {
        const getMinSalary = (salary) => {
          const match = salary.match(/\$(\d{1,3}(,\d{3})*)(?: - \$(\d{1,3}(,\d{3})*)|)/);
          return match ? parseInt(match[1].replace(/,/g, ""), 10) : 0;
        };
        return getMinSalary(b.salary) - getMinSalary(a.salary);
      });
    }
    return jobs;
  }, [filteredJobs, sortBy]);

  // Memoized stats for better performance
  const stats = useMemo(() => ({
    totalJobs: mockJobs.length,
    fullTimeJobs: mockJobs.filter(job => job.type === "Full-time").length,
    contractJobs: mockJobs.filter(job => job.type === "Contract").length,
    remoteJobs: 0
  }), []);

  // Memoized handlers for better performance
  const handleApply = useCallback(async (jobId) => {
    trackInteraction('job-apply');
    try {
      // Simulate application processing
      await new Promise(resolve => setTimeout(resolve, 600));
      setApplications(prev => {
        if (!prev.includes(jobId)) {
          return [...prev, jobId];
        }
        return prev;
      });
      toast.showSuccess("Application submitted successfully!");
    } catch (error) {
      toast.showError("Failed to submit application");
    }
  }, [trackInteraction, toast]);

  const handleSaveJob = useCallback(async (jobId) => {
    trackInteraction('job-save');
    try {
      // Simulate save processing
      await new Promise(resolve => setTimeout(resolve, 400));
      setSavedJobs(prev => {
        const newSet = new Set(prev);
        if (newSet.has(jobId)) {
          newSet.delete(jobId);
          toast.showInfo("Job removed from saved jobs");
        } else {
          newSet.add(jobId);
          toast.showSuccess("Job saved successfully!");
        }
        return newSet;
      });
    } catch (error) {
      toast.showError("Failed to save job");
    }
  }, [trackInteraction, toast]);

  const handleShareJob = useCallback(async (job) => {
    trackInteraction('job-share');
    try {
      // Simulate share processing
      await new Promise(resolve => setTimeout(resolve, 300));
      if (navigator.share) {
        await navigator.share({
          title: job.title,
          text: `Check out this job opportunity: ${job.title} at ${job.company}`,
          url: window.location.href
        });
        toast.showSuccess("Job shared successfully!");
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(`${job.title} at ${job.company} - ${window.location.href}`);
        toast.showSuccess("Job link copied to clipboard!");
      }
    } catch (error) {
      toast.showError("Failed to share job");
    }
  }, [trackInteraction, toast]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      updateRenderMetrics(); // Track refresh performance
      toast.showInfo("Job listings refreshed");
    } catch (error) {
      toast.showError("Failed to refresh job listings");
    } finally {
      setIsRefreshing(false);
    }
  }, [updateRenderMetrics, toast]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedType("");
    
    setSelectedExperience("");
    toast.showInfo("Filters cleared");
  }, [toast]);

  const openApplyModal = (jobId) => {
    setApplyJobId(jobId);
    setShowApplyModal(true);
    setApplyExperience("");
    setApplySkills("");
    setApplyResume(null);
  };

  const closeApplyModal = () => {
    setShowApplyModal(false);
    setApplyJobId(null);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    trackInteraction('job-apply');
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setApplications(prev => {
        if (!prev.includes(applyJobId)) {
          return [...prev, applyJobId];
        }
        return prev;
      });
      toast.showSuccess("Application submitted successfully!");
      closeApplyModal();
    } catch (error) {
      toast.showError("Failed to submit application");
    }
  };

  const openSavedJobsModal = () => setShowSavedJobsModal(true);
  const closeSavedJobsModal = () => setShowSavedJobsModal(false);
  const openJobAlertsModal = () => setShowJobAlertsModal(true);
  const closeJobAlertsModal = () => setShowJobAlertsModal(false);

  const handleAlertSave = (e) => {
    e.preventDefault();
    toast.showSuccess("Job alert preferences saved!");
    closeJobAlertsModal();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="interview-scheduler-container">
        <div className="interview-scheduler-header">
          <h1 className="is-title">Browse Available Jobs</h1>
          <p className="is-subtitle">Find your next career opportunity from our curated job listings</p>
        </div>
        
        <SkeletonTable rows={5} columns={1} />
      </div>
    );
  }

  return (
    <div className="interview-scheduler-container">
      {/* Header Section */}
      <div className="interview-scheduler-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="is-title">Browse Available Jobs</h1>
            <p className="is-subtitle">Find your next career opportunity from our curated job listings</p>
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
      <div className="is-stats-display">
        <div className="is-stat-item">
          <div className="is-stat-number">{stats.totalJobs}</div>
          <div className="is-stat-label">Total Jobs</div>
        </div>
        <div className="is-stat-item">
          <div className="is-stat-number">{stats.fullTimeJobs}</div>
          <div className="is-stat-label">Full-time</div>
        </div>
        <div className="is-stat-item">
          <div className="is-stat-number">{stats.contractJobs}</div>
          <div className="is-stat-label">Contract</div>
        </div>
        <div className="is-stat-item">
          <div className="is-stat-number">{stats.remoteJobs}</div>
          <div className="is-stat-label">Remote</div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="is-controls">
        <div className="is-controls-header">
          <h2 className="is-controls-title">Job Search</h2>
          <div className="is-controls-actions">
            <button className="is-button" onClick={openSavedJobsModal}>
              <span className="is-button-icon">💾</span>
              Saved Jobs ({savedJobs.size})
            </button>
            <button className="is-button secondary" onClick={openJobAlertsModal}>
              <span className="is-button-icon">📊</span>
              Job Alerts
            </button>
          </div>
        </div>
        
        <div className="is-filter-group">
          <input
            type="text"
            placeholder="Search jobs or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="is-search"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="is-filter-select"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          
          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="is-filter-select"
          >
            <option value="">All Experience Levels</option>
            <option value="0-2 years">Entry Level (0-2 years)</option>
            <option value="2-4 years">Mid Level (2-4 years)</option>
            <option value="4-6 years">Senior (4-6 years)</option>
            <option value="7+ years">Expert (7+ years)</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="is-controls">
        <div className="is-controls-header">
          <div className="is-controls-title">
            Showing {filteredJobs.length} of {mockJobs.length} jobs
          </div>
          <div className="is-filter-group">
            <label style={{ color: '#64748b', fontWeight: '600', marginRight: '0.5rem' }}>
              Sort by:
            </label>
            <select className="is-filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="date">Posted Date</option>
              <option value="title">Job Title</option>
              <option value="salary">Salary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="jobs-list">
        {sortedJobs.map((job) => (
          <div key={job.id} style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            transition: 'all 0.2s ease-in-out'
          }}>
            {/* Job Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>
                  {job.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: '600', color: '#374151' }}>🏢 {job.company}</div>
                  
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ 
                    padding: '0.375rem 0.75rem', 
                    background: '#f1f5f9', 
                    color: '#475569',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {job.type}
                  </span>
                  <span style={{ 
                    padding: '0.375rem 0.75rem', 
                    background: '#fef3c7', 
                    color: '#92400e',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    💰 {job.salary}
                  </span>
                  <span style={{ 
                    padding: '0.375rem 0.75rem', 
                    background: '#dbeafe', 
                    color: '#1e40af',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    ⏱️ {job.experience}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="is-action"
                  onClick={() => handleSaveJob(job.id)}
                  title={savedJobs.has(job.id) ? "Remove from Saved" : "Save Job"}
                  style={{ 
                    background: savedJobs.has(job.id) ? '#fef3c7' : '#f1f5f9', 
                    color: savedJobs.has(job.id) ? '#92400e' : '#475569' 
                  }}
                >
                  {savedJobs.has(job.id) ? '💾 Saved' : '💾 Save'}
                </button>
                <button
                  className="is-action"
                  onClick={() => handleShareJob(job)}
                  title="Share Job"
                  style={{ background: '#f1f5f9', color: '#475569' }}
                >
                  📤 Share
                </button>
              </div>
            </div>
            
            {/* Job Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '1rem' }}>
                {job.description}
              </p>
            </div>
            
            {/* Requirements */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.75rem' }}>Requirements:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {job.requirements.map((req, index) => (
                  <span key={index} style={{
                    padding: '0.375rem 0.75rem',
                    background: '#f8fafc',
                    color: '#475569',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: '1px solid #e2e8f0'
                  }}>
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.75rem' }}>Benefits:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {job.benefits.map((benefit, index) => (
                  <span key={index} style={{
                    padding: '0.375rem 0.75rem',
                    background: '#f0fdf4',
                    color: '#166534',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: '1px solid #bbf7d0'
                  }}>
                    ✅ {benefit}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Job Footer */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingTop: '1rem',
              borderTop: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                📅 Posted: {job.postedDate} • {Math.floor((new Date() - new Date(job.postedDate)) / (1000 * 60 * 60 * 24))} days ago
              </div>
              <button
                onClick={() => openApplyModal(job.id)}
                className="is-button"
                disabled={applications.includes(job.id)}
              >
                {applications.includes(job.id) ? "Applied" : "🚀 Apply Now"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Jobs Found */}
      {filteredJobs.length === 0 && (
        <div className="is-controls">
          <div className="is-controls-header">
            <div className="is-controls-title">
              No jobs found matching your criteria.
            </div>
            <div className="is-filter-group">
              <button 
                className="is-button secondary"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="is-controls">
        <div className="is-controls-header">
          <div className="is-controls-title">Navigation</div>
          <div className="is-filter-group">
            <button className="is-button secondary" disabled>
              ← Previous
            </button>
            <button className="is-button" style={{ minWidth: 'auto', padding: '0.75rem 1rem' }}>
              1
            </button>
            <button className="is-button secondary" style={{ minWidth: 'auto', padding: '0.75rem 1rem' }}>
              2
            </button>
            <button className="is-button secondary" style={{ minWidth: 'auto', padding: '0.75rem 1rem' }}>
              3
            </button>
            <button className="is-button secondary">
              Next →
            </button>
          </div>
        </div>
      </div>

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
     

      
      {showApplyModal && (
        <div className="popup-modal">
          <form onSubmit={handleApplySubmit} className="popup-content modal-form">
            <h2 className="modal-title">Apply for Job</h2>
            <div className="modal-input-group">
              <label>Experience</label>
              <input
                type="text"
                value={applyExperience}
                onChange={e => setApplyExperience(e.target.value)}
                required
                placeholder="e.g. 3 years as Frontend Developer"
              />
            </div>
            <div className="modal-input-group">
              <label>Skills</label>
              <input
                type="text"
                value={applySkills}
                onChange={e => setApplySkills(e.target.value)}
                required
                placeholder="e.g. React, JavaScript, CSS"
              />
            </div>
            <div className="modal-input-group">
              <label>Resume</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={e => setApplyResume(e.target.files[0])}
                required
              />
            </div>
            <div className="modal-footer">
              <button type="button" onClick={closeApplyModal} className="is-button secondary">Cancel</button>
              <button type="submit" className="is-button primary">Submit Application</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

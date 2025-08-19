"use client";

import React, { useState, useEffect } from "react";
import { LoadingSpinner, SkeletonStats } from "../../../../components/LoadingSpinner";
import { EmptyState } from "../../../../components/EmptyState";
import { useToastNotifications } from "../../../../components/Toast";
import { usePerformance } from "../../../../lib/usePerformance";
import "../../../../styles/adminCss/interviewScheduler.css";
import "../../../../styles/managerCss/managerLayout.css";

const mockReportData = {
  applications: {
    total: 156,
    thisMonth: 23,
    lastMonth: 18,
    growth: "+27.8%",
  },
  interviews: {
    total: 45,
    thisMonth: 8,
    lastMonth: 6,
    growth: "+33.3%",
  },
  hires: {
    total: 12,
    thisMonth: 2,
    lastMonth: 1,
    growth: "+100%",
  },
  positions: {
    total: 8,
    active: 5,
    closed: 3,
  },
};

const mockChartData = {
  applicationsByMonth: [
    { month: "Jan", count: 15 },
    { month: "Feb", count: 18 },
    { month: "Mar", count: 22 },
    { month: "Apr", count: 19 },
    { month: "May", count: 25 },
    { month: "Jun", count: 23 },
  ],
  applicationsByPosition: [
    { position: "Frontend Developer", count: 45 },
    { position: "Backend Engineer", count: 32 },
    { position: "UI/UX Designer", count: 28 },
    { position: "Product Manager", count: 25 },
    { position: "Data Analyst", count: 26 },
  ],
  statusDistribution: [
    { status: "Under Review", count: 35, percentage: 22.4 },
    { status: "Interview Scheduled", count: 28, percentage: 17.9 },
    { status: "Shortlisted", count: 42, percentage: 26.9 },
    { status: "Rejected", count: 38, percentage: 24.4 },
    { status: "Hired", count: 13, percentage: 8.3 },
  ],
};

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const toast = useToastNotifications();
  const { metrics, trackInteraction, updateRenderMetrics } = usePerformance("Reports");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        setIsLoading(false);
        updateRenderMetrics(); // Track initial render
        toast.showSuccess("Reports data loaded successfully");
      } catch (error) {
        toast.showError("Failed to load reports data");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      updateRenderMetrics(); // Track refresh performance
      toast.showInfo("Reports data refreshed");
    } catch (error) {
      toast.showError("Failed to refresh reports data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGenerateReport = async (reportType) => {
    trackInteraction('generate-report');
    setIsGeneratingReport(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.showSuccess(`${reportType} report generated successfully`);
    } catch (error) {
      toast.showError("Failed to generate report");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleExportReport = async (format) => {
    trackInteraction('export-report');
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.showSuccess(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.showError("Failed to export report");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h1 className="admin-dashboard-title">Reports & Analytics</h1>
          <p className="admin-dashboard-subtitle">
            Comprehensive hiring insights and performance metrics
          </p>
        </div>
        
        <SkeletonStats count={4} />
        
        <div style={{ marginTop: '2rem' }}>
          <div className="admin-recent-activity">
            <div className="admin-activity-header">
              <h2 className="admin-activity-title">Loading Reports...</h2>
            </div>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <LoadingSpinner size="lg" type="dots" />
            </div>
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
            <h1 className="admin-dashboard-title">Reports & Analytics</h1>
            <p className="admin-dashboard-subtitle">
              Comprehensive hiring insights and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleGenerateReport("Comprehensive")}
              disabled={isGeneratingReport}
              className="is-button"
            >
              {isGeneratingReport ? (
                <LoadingSpinner size="sm" type="dots" />
              ) : (
                "📊 Generate Report"
              )}
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
            <div className="admin-stat-title">Total Applications</div>
            <div className="admin-stat-icon">📋</div>
          </div>
          <div className="admin-stat-number">{mockReportData.applications.total}</div>
          <div className="admin-stat-change positive">{mockReportData.applications.growth}</div>
        </div>
        <div className="admin-stat-card success">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Interviews Conducted</div>
            <div className="admin-stat-icon">📅</div>
          </div>
          <div className="admin-stat-number">{mockReportData.interviews.total}</div>
          <div className="admin-stat-change positive">{mockReportData.interviews.growth}</div>
        </div>
        <div className="admin-stat-card warning">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Successful Hires</div>
            <div className="admin-stat-icon">✅</div>
          </div>
          <div className="admin-stat-number">{mockReportData.hires.total}</div>
          <div className="admin-stat-change positive">{mockReportData.hires.growth}</div>
        </div>
        <div className="admin-stat-card info">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Active Positions</div>
            <div className="admin-stat-icon">💼</div>
          </div>
          <div className="admin-stat-number">{mockReportData.positions.active}</div>
          <div className="admin-stat-change neutral">of {mockReportData.positions.total}</div>
        </div>
      </div>

      {/* Report Controls */}
      <div className="admin-recent-activity">
        <div className="admin-activity-header">
          <h2 className="admin-activity-title">Report Controls</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="is-filter-select">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="is-filter-select-input"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="is-filter-select">
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="is-filter-select-input"
            >
              <option value="overview">Overview</option>
              <option value="applications">Applications</option>
              <option value="interviews">Interviews</option>
              <option value="hires">Hires</option>
              <option value="positions">Positions</option>
            </select>
          </div>
          <button
            onClick={() => handleExportReport("pdf")}
            className="is-button secondary"
          >
            📄 Export PDF
          </button>
          <button
            onClick={() => handleExportReport("excel")}
            className="is-button secondary"
          >
            📊 Export Excel
          </button>
        </div>
      </div>

      {/* Applications by Month Chart */}
      <div className="admin-recent-activity">
        <div className="admin-activity-header">
          <h2 className="admin-activity-title">Applications by Month</h2>
        </div>
        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
          {mockChartData.applicationsByMonth.map((data) => (
            <div key={data.month} style={{ textAlign: 'center', padding: '1rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>{data.count}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{data.month}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Applications by Position */}
      <div className="admin-recent-activity">
        <div className="admin-activity-header">
          <h2 className="admin-activity-title">Applications by Position</h2>
        </div>
        <div style={{ padding: '2rem' }}>
          {mockChartData.applicationsByPosition.map((data) => (
            <div key={data.position} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600', color: '#1e293b' }}>{data.position}</span>
                <span style={{ fontWeight: '700', color: '#3b82f6' }}>{data.count}</span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                background: '#e2e8f0', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${(data.count / Math.max(...mockChartData.applicationsByPosition.map(d => d.count))) * 100}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Distribution */}
      <div className="admin-recent-activity">
        <div className="admin-activity-header">
          <h2 className="admin-activity-title">Application Status Distribution</h2>
        </div>
        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {mockChartData.statusDistribution.map((data) => (
            <div key={data.status} style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {data.status === "Under Review" && "🔍"}
                {data.status === "Interview Scheduled" && "📅"}
                {data.status === "Shortlisted" && "✅"}
                {data.status === "Rejected" && "❌"}
                {data.status === "Hired" && "🎉"}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>{data.count}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>{data.status}</div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: '#3b82f6' }}>{data.percentage}%</div>
            </div>
          ))}
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

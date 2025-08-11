import React from "react";
import "../../../styles/managerCss/dashboardOverview.css";

const overviewCards = [
  { title: "Total Job Posts", value: 18 },
  { title: "Active Applications", value: 42 },
  { title: "Scheduled Interviews", value: 7 },
  { title: "Active Admins", value: 3 },
];

const funnel = [
  { label: "Applications", value: 120 },
  { label: "Shortlisted", value: 30 },
  { label: "Interviews", value: 12 },
  { label: "Hired", value: 4 },
];

const activityFeed = [
  "Admin Liya updated application for DevOps Engineer",
  "Applicant Alem was scheduled for interview",
  "Job Mobile Developer was archived",
];

export default function ManagerDashboardOverview() {
  return (
    <div>
      <div className="manager-dashboard-header">Dashboard Overview</div>
      <div className="manager-overview-cards">
        {overviewCards.map((card) => (
          <div key={card.title} className="manager-overview-card">
            <div className="manager-overview-card-title">{card.title}</div>
            <div className="manager-overview-card-value">{card.value}</div>
          </div>
        ))}
      </div>
      <div className="manager-funnel">
        <div className="manager-funnel-title">Hiring Funnel Snapshot</div>
        <div className="manager-funnel-steps">
          {funnel.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className="manager-funnel-step">
                <div className="manager-funnel-step-value">{step.value}</div>
                <div>{step.label}</div>
              </div>
              {idx < funnel.length - 1 && (
                <span className="manager-funnel-arrow">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="manager-activity-feed">
        <div className="manager-activity-title">Recent Activity</div>
        <ul>
          {activityFeed.map((item, idx) => (
            <li key={idx} className="manager-activity-item">
              <span className="manager-activity-dot">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 
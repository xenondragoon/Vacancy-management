import React from "react";
import "../../../styles/applicantCss/applicantDashboard.css";

const applicantName = "Jane Doe";
const overviewCards = [
  { title: "Applications in Progress", value: 2 },
  { title: "Interviews Scheduled", value: 1 },
  { title: "Total Applications Submitted", value: 5 },
  { title: "Rejections", value: 1 },
];

const activityFeed = [
  "You applied for Mobile App Developer",
  "Interview scheduled for QA Engineer",
  "Application for Product Designer was rejected",
];

export default function ApplicantDashboard() {
  return (
    <div className="applicant-dashboard-wrapper">
      <div className="applicant-dashboard-title">My Dashboard</div>
      <div className="applicant-dashboard-welcome">Welcome, {applicantName}</div>
      <div className="applicant-overview-cards">
        {overviewCards.map((card) => (
          <div key={card.title} className="applicant-overview-card">
            <div className="applicant-overview-card-title">{card.title}</div>
            <div className="applicant-overview-card-value">{card.value}</div>
          </div>
        ))}
      </div>
      <div className="applicant-activity-feed">
        <div className="applicant-activity-title">Recent Activity</div>
        <ul>
          {activityFeed.map((item, idx) => (
            <li key={idx} className="applicant-activity-item">
              <span className="applicant-activity-dot">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 
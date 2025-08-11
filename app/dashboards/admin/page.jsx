import React from "react";
import PageHeader from "../../../components/PageHeader";
import "../../../styles/adminCss/adminDashboard.css";

const overviewCards = [
  { title: "Total Job Posts", value: 24 },
  { title: "Upcoming Interviews", value: 5 },
  { title: "Applications Needing Action", value: 8 },
];

const recentApplications = [
  { name: "Alice Johnson", job: "Frontend Developer", status: "New", action: "View" },
  { name: "Bob Smith", job: "Backend Engineer", status: "Shortlisted", action: "Forward" },
  { name: "Carol Lee", job: "UI/UX Designer", status: "Pending", action: "View" },
];

const notifications = [
  "Interview with Alice Johnson scheduled for tomorrow at 10:00 AM.",
  "New applicant: Bob Smith for Backend Engineer.",
  "Job post 'QA Tester' is expiring in 2 days.",
];

const statusClass = (status) => {
  switch (status) {
    case "New":
      return "admin-status-tag new";
    case "Shortlisted":
      return "admin-status-tag shortlisted";
    case "Pending":
      return "admin-status-tag pending";
    default:
      return "admin-status-tag";
  }
};

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard-overview">
      <PageHeader 
        title="Admin Dashboard" 
        subtitle="Manage users, roles, and system settings"
      />
      {/* Overview Cards and Table */}
      <div>
        <div className="admin-overview-cards">
          {overviewCards.map((card) => (
            <div key={card.title} className="admin-overview-card">
              <div className="admin-overview-card-title">{card.title}</div>
              <div className="admin-overview-card-value">{card.value}</div>
            </div>
          ))}
        </div>
        {/* Recent Applications Table */}
        <table className="admin-applications-table">
          <thead>
            <tr>
              <th>Applicant Name</th>
              <th>Job Title</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentApplications.map((app, idx) => (
              <tr key={idx}>
                <td>{app.name}</td>
                <td>{app.job}</td>
                <td>
                  <span className={statusClass(app.status)}>{app.status}</span>
                </td>
                <td>
                  <button className="admin-app-action">{app.action}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Notifications Panel */}
      <div className="admin-notifications-panel">
        <div className="admin-notifications-title">Notifications</div>
        <ul>
          {notifications.map((note, idx) => (
            <li key={idx} className="admin-notification-item">
              <span className="admin-notification-dot">•</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 
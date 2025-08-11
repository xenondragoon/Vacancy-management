"use client"

import React from "react";
import "../../../styles/applicantCss/myApplications.css";

const mockApplications = [
  {
    id: 1,
    job: "Frontend Developer",
    appliedOn: "2024-06-10",
    status: "submitted",
    interview: null,
  },
  {
    id: 2,
    job: "QA Engineer",
    appliedOn: "2024-06-08",
    status: "interview",
    interview: "2024-07-01",
  },
  {
    id: 3,
    job: "Product Designer",
    appliedOn: "2024-06-01",
    status: "rejected",
    interview: null,
  },
  {
    id: 4,
    job: "Backend Developer",
    appliedOn: "2024-05-20",
    status: "review",
    interview: null,
  },
  {
    id: 5,
    job: "UI/UX Designer",
    appliedOn: "2024-05-10",
    status: "hired",
    interview: null,
  },
];

const statusClass = (status) => {
  switch (status) {
    case "submitted":
      return "my-app-status-tag submitted";
    case "review":
      return "my-app-status-tag review";
    case "interview":
      return "my-app-status-tag interview";
    case "rejected":
      return "my-app-status-tag rejected";
    case "hired":
      return "my-app-status-tag hired";
    default:
      return "my-app-status-tag";
  }
};

const statusLabel = (status) => {
  switch (status) {
    case "submitted":
      return "Submitted";
    case "review":
      return "Under Review";
    case "interview":
      return "Interview Scheduled";
    case "rejected":
      return "Rejected";
    case "hired":
      return "Hired";
    default:
      return status;
  }
};

export default function MyApplications() {
  return (
    <div className="my-applications-wrapper">
      <div className="my-applications-title">My Applications</div>
      <div className="my-applications-table-wrapper">
        <table className="my-applications-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Applied On</th>
              <th>Status</th>
              <th>Interview Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockApplications.map((app) => (
              <tr key={app.id}>
                <td>{app.job}</td>
                <td>{app.appliedOn}</td>
                <td>
                  <span className={statusClass(app.status)}>{statusLabel(app.status)}</span>
                </td>
                <td>{app.interview ? app.interview : "-"}</td>
                <td>
                  <button className="my-app-action">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
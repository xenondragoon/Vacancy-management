"use client"

import React, { useState } from "react";
import PageHeader from "../../../components/PageHeader";
import "../../../styles/managerCss/applicants.css";

const mockApplicants = [
  {
    id: 1,
    name: "Alem Kebede",
    job: "Frontend Developer",
    status: "submitted",
    interview: null,
  },
  {
    id: 2,
    name: "Liya Tesfaye",
    job: "QA Engineer",
    status: "interview",
    interview: "2024-07-01",
  },
  {
    id: 3,
    name: "Samuel Bekele",
    job: "Product Designer",
    status: "shortlisted",
    interview: null,
  },
  {
    id: 4,
    name: "Marta Abebe",
    job: "Backend Developer",
    status: "rejected",
    interview: null,
  },
  {
    id: 5,
    name: "Helen Fikru",
    job: "UI/UX Designer",
    status: "hired",
    interview: null,
  },
];

const jobs = [...new Set(mockApplicants.map((a) => a.job))];
const statuses = ["submitted", "shortlisted", "interview", "rejected", "hired"];

const statusClass = (status) => {
  switch (status) {
    case "submitted":
      return "manager-app-status-tag submitted";
    case "shortlisted":
      return "manager-app-status-tag shortlisted";
    case "interview":
      return "manager-app-status-tag interview";
    case "rejected":
      return "manager-app-status-tag rejected";
    case "hired":
      return "manager-app-status-tag hired";
    default:
      return "manager-app-status-tag";
  }
};

const statusLabel = (status) => {
  switch (status) {
    case "submitted":
      return "Submitted";
    case "shortlisted":
      return "Shortlisted";
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

export default function ManagerApplicants() {
  const [jobFilter, setJobFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [profile, setProfile] = useState(null);

  const filteredApplicants = mockApplicants.filter(
    (app) =>
      (jobFilter ? app.job === jobFilter : true) &&
      (statusFilter ? app.status === statusFilter : true)
  );

  return (
    <div>
      <PageHeader 
        title="Applicants" 
        subtitle="Review and manage job applications"
      />
      <div className="manager-applicants-filters">
        <select
          className="manager-applicants-select"
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
        >
          <option value="">All Jobs</option>
          {jobs.map((j) => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>
        <select
          className="manager-applicants-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{statusLabel(s)}</option>
          ))}
        </select>
      </div>
      <div className="manager-applicants-table-wrapper">
        <table className="manager-applicants-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Job Title</th>
              <th>Status</th>
              <th>Interview Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map((app) => (
              <tr key={app.id}>
                <td>{app.name}</td>
                <td>{app.job}</td>
                <td>
                  <span className={statusClass(app.status)}>{statusLabel(app.status)}</span>
                </td>
                <td>{app.interview ? app.interview : "-"}</td>
                <td>
                  <button className="manager-app-action" onClick={() => setProfile(app)}>View</button>
                  <button className="manager-app-action approve">Approve</button>
                  <button className="manager-app-action reject">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {profile && (
        <div className="manager-app-profile-modal">
          <div className="manager-app-profile-title">Applicant Profile</div>
          <div className="manager-app-profile-section">
            <span className="manager-app-profile-label">Name:</span>
            <span className="manager-app-profile-value">{profile.name}</span>
          </div>
          <div className="manager-app-profile-section">
            <span className="manager-app-profile-label">Job Title:</span>
            <span className="manager-app-profile-value">{profile.job}</span>
          </div>
          <div className="manager-app-profile-section">
            <span className="manager-app-profile-label">Status:</span>
            <span className={statusClass(profile.status)}>{statusLabel(profile.status)}</span>
          </div>
          <div className="manager-app-profile-section">
            <span className="manager-app-profile-label">Interview Date:</span>
            <span className="manager-app-profile-value">{profile.interview ? profile.interview : "-"}</span>
          </div>
          <div className="manager-app-profile-btns">
            <button className="manager-app-action approve">Approve</button>
            <button className="manager-app-action reject">Reject</button>
            <button className="manager-app-action" onClick={() => setProfile(null)} style={{background:'#6b7280'}}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}


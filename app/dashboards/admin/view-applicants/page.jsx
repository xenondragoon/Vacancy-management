"use client"

import React, { useState } from "react";
import "../../../../styles/adminCss/viewApplicants.css";

const mockApplicants = [
  {
    id: 1,
    name: "Alice Johnson",
    job: "Frontend Developer",
    status: "New",
    interview: "2024-07-10 10:00 AM",
  },
  {
    id: 2,
    name: "Bob Smith",
    job: "Backend Engineer",
    status: "Shortlisted",
    interview: "2024-07-12 2:00 PM",
  },
  {
    id: 3,
    name: "Carol Lee",
    job: "UI/UX Designer",
    status: "Pending",
    interview: "-",
  },
];

const statusClass = (status) => {
  switch (status) {
    case "New":
      return "va-status-tag new";
    case "Shortlisted":
      return "va-status-tag shortlisted";
    case "Pending":
      return "va-status-tag pending";
    default:
      return "va-status-tag";
  }
};

export default function ViewApplicants() {
  const [search, setSearch] = useState("");
  const filteredApplicants = mockApplicants.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="view-applicants-container">
      <h1 className="va-title">View Applicants</h1>
      <div className="va-controls">
        <input
          type="text"
          placeholder="Search by applicant name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="va-search"
        />
      </div>
      <div className="va-table-wrapper">
        <table className="va-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Job Title</th>
              <th>Status</th>
              <th>Interview</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map((app) => (
              <tr key={app.id}>
                <td>{app.name}</td>
                <td>{app.job}</td>
                <td>
                  <span className={statusClass(app.status)}>{app.status}</span>
                </td>
                <td>{app.interview}</td>
                <td>
                  <button className="va-action">View</button>
                  <button className="va-action">Shortlist</button>
                  <button className="va-action">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
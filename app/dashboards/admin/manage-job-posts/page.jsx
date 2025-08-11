"use client"

import React, { useState } from "react";
import "../../../../styles/adminCss/manageJobPosts.css";

const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    status: "Open",
    applicants: 12,
    deadline: "2024-07-15",
  },
  {
    id: 2,
    title: "Backend Engineer",
    status: "Closed",
    applicants: 8,
    deadline: "2024-06-30",
  },
  {
    id: 3,
    title: "QA Tester",
    status: "Open",
    applicants: 5,
    deadline: "2024-07-20",
  },
];

const statusClass = (status) => {
  switch (status) {
    case "Open":
      return "mjp-status-tag open";
    case "Closed":
      return "mjp-status-tag closed";
    default:
      return "mjp-status-tag";
  }
};

export default function ManageJobPosts() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredJobs = mockJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? job.status === statusFilter : true)
  );

  return (
    <div className="manage-job-posts-container">
      <h1 className="mjp-title">Manage Job Posts</h1>
      {/* Search & Filter Controls */}
      <div className="mjp-controls">
        <input
          type="text"
          placeholder="Search by job title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mjp-search"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="mjp-select"
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        <button className="mjp-create-btn">
          ➕ Create New Job
        </button>
      </div>
      {/* Job Table */}
      <div className="mjp-table-wrapper">
        <table className="mjp-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Status</th>
              <th>Applicants</th>
              <th>Deadline</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>
                  <span className={statusClass(job.status)}>{job.status}</span>
                </td>
                <td>{job.applicants}</td>
                <td>{job.deadline}</td>
                <td>
                  <button className="mjp-action">View</button>
                  <button className="mjp-action">Edit</button>
                  <button className="mjp-action">Archive</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal or separate page for Create/Edit Job (placeholder) */}
      {/* Implement modal or routing as needed */}
    </div>
  );
} 
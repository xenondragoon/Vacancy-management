"use client"

import React, { useState } from "react";
import "../../../styles/managerCss/jobListings.css";

const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering",
    status: "open",
    applicants: 12,
    deadline: "2024-08-01",
  },
  {
    id: 2,
    title: "QA Engineer",
    department: "Quality Assurance",
    status: "closed",
    applicants: 8,
    deadline: "2024-07-20",
  },
  {
    id: 3,
    title: "Product Designer",
    department: "Design",
    status: "open",
    applicants: 5,
    deadline: "2024-07-15",
  },
];

export default function ManagerJobListings() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="manager-job-listings-header">Job Listings</div>
      <button className="manager-job-create-btn" onClick={() => setShowModal(true)}>
        ➕ Create New Job
      </button>
      <div className="manager-job-listings-table-wrapper">
        <table className="manager-job-listings-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Department</th>
              <th>Status</th>
              <th>Applicants</th>
              <th>Deadline</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockJobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.department}</td>
                <td>
                  <span className={`manager-job-status-tag ${job.status}`}>{job.status === "open" ? "Open" : "Closed"}</span>
                </td>
                <td>{job.applicants}</td>
                <td>{job.deadline}</td>
                <td>
                  <button className="manager-job-action">View</button>
                  <button className="manager-job-action edit">Edit</button>
                  <button className="manager-job-action archive">Archive</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="manager-job-form-modal">
          <div className="manager-job-form-title">Create/Edit Job</div>
          <form className="manager-job-form">
            <input type="text" placeholder="Title" required />
            <textarea placeholder="Description" required />
            <textarea placeholder="Requirements" required />
            <select required>
              <option value="">Assign Admin</option>
              <option value="Liya">Liya</option>
              <option value="Alem">Alem</option>
            </select>
            <input type="date" required />
            <select required>
              <option value="">Employment Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
            <select required>
              <option value="">Visibility</option>
              <option value="Public">Public</option>
              <option value="Internal">Internal</option>
            </select>
            <button type="submit" className="manager-job-form-btn">Save</button>
            <button type="button" className="manager-job-form-btn" onClick={() => setShowModal(false)} style={{background:'#6b7280'}}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
} 
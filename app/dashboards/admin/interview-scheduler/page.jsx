"use client"

import React, { useState } from "react";
import "../../../../styles/adminCss/interviewScheduler.css";

const mockInterviews = [
  {
    id: 1,
    applicant: "Alice Johnson",
    job: "Frontend Developer",
    date: "2024-07-10",
    time: "10:00 AM",
    status: "Scheduled",
  },
  {
    id: 2,
    applicant: "Bob Smith",
    job: "Backend Engineer",
    date: "2024-07-12",
    time: "2:00 PM",
    status: "Pending",
  },
  {
    id: 3,
    applicant: "Carol Lee",
    job: "UI/UX Designer",
    date: "2024-07-15",
    time: "11:00 AM",
    status: "Scheduled",
  },
];

const statusClass = (status) => {
  switch (status) {
    case "Scheduled":
      return "is-status-tag scheduled";
    case "Pending":
      return "is-status-tag pending";
    default:
      return "is-status-tag";
  }
};

export default function InterviewScheduler() {
  const [search, setSearch] = useState("");
  const filteredInterviews = mockInterviews.filter((interview) =>
    interview.applicant.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="interview-scheduler-container">
      <h1 className="is-title">Interview Scheduler</h1>
      <div className="is-controls">
        <input
          type="text"
          placeholder="Search by applicant name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="is-search"
        />
      </div>
      <div className="is-table-wrapper">
        <table className="is-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Job Title</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInterviews.map((interview) => (
              <tr key={interview.id}>
                <td>{interview.applicant}</td>
                <td>{interview.job}</td>
                <td>{interview.date}</td>
                <td>{interview.time}</td>
                <td>
                  <span className={statusClass(interview.status)}>{interview.status}</span>
                </td>
                <td>
                  <button className="is-action">View</button>
                  <button className="is-action">Reschedule</button>
                  <button className="is-action">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
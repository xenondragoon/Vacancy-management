"use client"

import React, { useState } from "react";
import PageHeader from "../../../components/PageHeader";
import "../../../styles/applicantCss/browseJobs.css";

const companyName = "Acme Corp";
const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    experience: "Junior",
    deadline: "2024-08-01",
    status: "open",
    applied: false,
  },
  {
    id: 2,
    title: "QA Engineer",
    department: "Quality Assurance",
    location: "On-site",
    experience: "Mid",
    deadline: "2024-07-20",
    status: "open",
    applied: true,
  },
  {
    id: 3,
    title: "Product Designer",
    department: "Design",
    location: "Hybrid",
    experience: "Senior",
    deadline: "2024-07-15",
    status: "closed",
    applied: false,
  },
];

export default function BrowseJobs() {
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");

  const departments = [...new Set(mockJobs.map((j) => j.department))];
  const locations = [...new Set(mockJobs.map((j) => j.location))];
  const experiences = [...new Set(mockJobs.map((j) => j.experience))];

  const filteredJobs = mockJobs.filter(
    (job) =>
      (department ? job.department === department : true) &&
      (location ? job.location === location : true) &&
      (experience ? job.experience === experience : true)
  );

  return (
    <div className="browse-jobs-wrapper">
      <PageHeader 
        title="Available Positions" 
        subtitle={`You can only apply to open roles listed by ${companyName}`}
      />
      <div className="browse-jobs-filters">
        <select
          className="browse-jobs-select"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          className="browse-jobs-select"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          className="browse-jobs-select"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <option value="">All Experience Levels</option>
          {experiences.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>
      <div className="job-listings">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-card-info">
              <div className="job-card-title">{job.title}</div>
              <div className="job-card-meta">
                {job.department} | {job.location} | {job.experience} | Deadline: {job.deadline}
              </div>
            </div>
            <div>
              {job.status === "open" && !job.applied && (
                <span className="job-card-status open">Open to Apply</span>
              )}
              {job.status === "open" && job.applied && (
                <span className="job-card-status applied">Already Applied</span>
              )}
              {job.status === "closed" && (
                <span className="job-card-status closed">Closed</span>
              )}
            </div>
            <div>
              {job.status === "open" && !job.applied && (
                <button className="job-card-btn">Apply</button>
              )}
              {job.status === "open" && job.applied && (
                <button className="job-card-btn view" disabled>View</button>
              )}
              {job.status === "closed" && (
                <button className="job-card-btn view" disabled>View</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
"use client"

import React, { useState } from "react";
import "../../../styles/managerCss/adminUsers.css";

const mockAdmins = [
  {
    id: 1,
    name: "Liya Tesfaye",
    email: "liya@company.com",
    jobs: ["Frontend Developer", "QA Engineer"],
    role: "Admin",
    status: "active",
  },
  {
    id: 2,
    name: "Alem Kebede",
    email: "alem@company.com",
    jobs: ["Product Designer"],
    role: "Admin",
    status: "active",
  },
  {
    id: 3,
    name: "Samuel Bekele",
    email: "samuel@company.com",
    jobs: ["Backend Developer"],
    role: "Admin",
    status: "disabled",
  },
];

export default function ManagerAdminUsers() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="manager-admin-users-header">Admin Users</div>
      <button className="manager-job-create-btn" onClick={() => setShowModal(true)}>
        Assign Admin
      </button>
      <div className="manager-admin-users-table-wrapper">
        <table className="manager-admin-users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Assigned Jobs</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockAdmins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.jobs.join(", ")}</td>
                <td>{admin.role}</td>
                <td>
                  <span className={`manager-admin-status-tag ${admin.status}`}>{admin.status === "active" ? "Active" : "Disabled"}</span>
                </td>
                <td>
                  <button className="manager-admin-action promote">Promote</button>
                  <button className="manager-admin-action remove">Remove</button>
                  <button className="manager-admin-action reassign">Reassign</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="manager-admin-modal">
          <div className="manager-admin-modal-title">Assign Admin</div>
          <form className="manager-admin-modal-form">
            <select required>
              <option value="">Select Job</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="Product Designer">Product Designer</option>
            </select>
            <select required>
              <option value="">Choose Admin</option>
              <option value="Liya Tesfaye">Liya Tesfaye</option>
              <option value="Alem Kebede">Alem Kebede</option>
              <option value="Samuel Bekele">Samuel Bekele</option>
            </select>
            <button type="submit" className="manager-admin-modal-btn">Assign</button>
            <button type="button" className="manager-admin-modal-btn" onClick={() => setShowModal(false)} style={{background:'#6b7280'}}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
} 
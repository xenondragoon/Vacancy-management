"use client"

import React, { useState } from "react";
import "../../../styles/applicantCss/notifications.css";

const mockNotifications = [
  "You have been shortlisted for Backend Developer",
  "Interview scheduled for August 5",
  "Application rejected for UI Designer",
];

const mockMessages = [
  { sender: "HR Team", text: "Please upload your updated resume." },
  { sender: "Manager", text: "Congrats! You have been moved to the next round." },
];

export default function Notifications() {
  const [tab, setTab] = useState("notifications");

  return (
    <div className="notifications-wrapper">
      <div className="notifications-title">Notifications & Messages</div>
      <div className="notifications-tabs">
        <button
          className={"notifications-tab" + (tab === "notifications" ? " active" : "")}
          onClick={() => setTab("notifications")}
        >
          Notifications
        </button>
        <button
          className={"notifications-tab" + (tab === "messages" ? " active" : "")}
          onClick={() => setTab("messages")}
        >
          Messages
        </button>
      </div>
      <div className="notifications-list">
        {tab === "notifications" && (
          <ul>
            {mockNotifications.map((note, idx) => (
              <li key={idx} className="notification-item">
                <span className="notification-dot">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        )}
        {tab === "messages" && (
          <ul>
            {mockMessages.map((msg, idx) => (
              <li key={idx} className="message-item">
                <span className="message-sender">{msg.sender}:</span>
                <span>{msg.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

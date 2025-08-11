import React from "react";
import "../../../styles/managerCss/reports.css";

const metrics = [
  { title: "Applications per Job", value: 24 },
  { title: "Avg. Time to Hire (days)", value: 18 },
  { title: "Drop-off Rate", value: "12%" },
  { title: "Interview-to-Hire Ratio", value: "3:1" },
];

export default function ManagerReports() {
  return (
    <div>
      <div className="manager-reports-header">Reports & Analytics</div>
      <div className="manager-reports-metrics">
        {metrics.map((m) => (
          <div key={m.title} className="manager-reports-metric-card">
            <div className="manager-reports-metric-title">{m.title}</div>
            <div className="manager-reports-metric-value">{m.value}</div>
          </div>
        ))}
      </div>
      <div className="manager-reports-charts">
        <div className="manager-reports-chart">
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Applications Over Time</div>
          <div style={{ color: '#888', marginTop: 24 }}>[Line Chart Placeholder]</div>
        </div>
        <div className="manager-reports-chart">
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Status Distribution</div>
          <div style={{ color: '#888', marginTop: 24 }}>[Pie Chart Placeholder]</div>
        </div>
      </div>
      <div className="manager-reports-export-btns">
        <button className="manager-reports-export-btn">Export as Excel</button>
        <button className="manager-reports-export-btn">Export as CSV</button>
        <button className="manager-reports-export-btn">Export as PDF</button>
      </div>
    </div>
  );
} 
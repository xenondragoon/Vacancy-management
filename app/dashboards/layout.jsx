import '../../styles/dashboard.css';
import Sidebar from '../../components/Sidebar';

export default function DashboardsLayout({ children }) {
  return ( 
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">{children}</div>
    </div>
  );
}

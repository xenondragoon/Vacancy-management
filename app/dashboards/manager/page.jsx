import RoleGuard from '../../../components/RoleGuard';

export default function ManagerDashboard() {
  return (
    <RoleGuard allowedRoles={['manager']}>
      <h2>Manager Dashboard</h2>
      <div className="card">
        <h3>Welcome, Manager!</h3>
        <p>Open vacancies: <b>3</b> (placeholder)</p>
      </div>
    </RoleGuard>
  );
}

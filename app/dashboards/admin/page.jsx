import RoleGuard from '../../../components/RoleGuard';

export default function AdminDashboard() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <h2>Admin Dashboard</h2>
      <div className="card">
        <h3>Welcome, Admin!</h3>
        <p>Manage users, settings, and oversee the platform.</p>
      </div>
    </RoleGuard>
  );
}

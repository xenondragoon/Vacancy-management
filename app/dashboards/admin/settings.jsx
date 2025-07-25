import RoleGuard from '../../../components/RoleGuard';

export default function AdminSettings() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <h2>Admin Settings</h2>
      <div className="card">
        <p>Settings for admin (placeholder).</p>
      </div>
    </RoleGuard>
  );
}

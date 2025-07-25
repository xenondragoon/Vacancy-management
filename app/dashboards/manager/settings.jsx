import RoleGuard from '../../../components/RoleGuard';

export default function ManagerSettings() {
  return (
    <RoleGuard allowedRoles={['manager']}>
      <h2>Manager Settings</h2>
      <div className="card">
        <p>Settings for manager (placeholder).</p>
      </div>
    </RoleGuard>
  );
}

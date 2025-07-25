import RoleGuard from '../../../components/RoleGuard';

export default function ManagerOverview() {
  return (
    <RoleGuard allowedRoles={['manager']}>
      <h2>Overview</h2>
      <div className="card">
        <p>Applications received: <b>12</b> (placeholder)</p>
      </div>
    </RoleGuard>
  );
}

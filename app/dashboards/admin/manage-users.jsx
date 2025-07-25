import RoleGuard from '../../../components/RoleGuard';

export default function ManageUsers() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <h2>Manage Users</h2>
      <div className="card">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>admin</td><td>admin</td><td>Active</td></tr>
            <tr><td>manager</td><td>manager</td><td>Active</td></tr>
            <tr><td>applicant</td><td>applicant</td><td>Active</td></tr>
          </tbody>
        </table>
      </div>
    </RoleGuard>
  );
}

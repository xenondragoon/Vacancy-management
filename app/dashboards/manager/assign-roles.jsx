import RoleGuard from '../../../components/RoleGuard';

export default function AssignRoles() {
  return (
    <RoleGuard allowedRoles={['manager']}>
      <h2>Assign Roles</h2>
      <div className="card">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Current Role</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>applicant1</td><td>applicant</td><td><button>Make Manager</button></td></tr>
            <tr><td>applicant2</td><td>applicant</td><td><button>Make Manager</button></td></tr>
          </tbody>
        </table>
      </div>
    </RoleGuard>
  );
}

import RoleGuard from '../../../components/RoleGuard';

export default function ApplicantDashboard() {
  return (
    <RoleGuard allowedRoles={['applicant']}>
      <h2>Applicant Dashboard</h2>
      <div className="card">
        <h3>Welcome, Applicant!</h3>
        <p>Your application status: <b>Pending</b></p>
      </div>
    </RoleGuard>
  );
}

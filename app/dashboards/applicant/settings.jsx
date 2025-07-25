import RoleGuard from '../../../components/RoleGuard';

export default function ApplicantSettings() {
  return (
    <RoleGuard allowedRoles={['applicant']}>
      <h2>Applicant Settings</h2>
      <div className="card">
        <p>Settings for applicant (placeholder).</p>
      </div>
    </RoleGuard>
  );
}

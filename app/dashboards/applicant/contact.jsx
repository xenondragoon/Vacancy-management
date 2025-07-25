import RoleGuard from '../../../components/RoleGuard';

export default function ApplicantContact() {
  return (
    <RoleGuard allowedRoles={['applicant']}>
      <h2>Contact HR</h2>
      <div className="card">
        <p>For any queries, contact hr@vacancy.com or fill the form below (placeholder).</p>
      </div>
    </RoleGuard>
  );
}

import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Vacancy Management</h1>
      <p>Streamline your hiring process with our modern vacancy management platform.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/login">
          <button>Login</button>
        </Link>
        <Link href="/signup">
          <button>Signup</button>
        </Link>
      </div>
    </main>
  );
}

"use client";
import Link from 'next/link';
import { getUser, logout } from '../lib/auth';
import { getDashboardPath } from '../lib/roles';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/">
          <img src="/logo.png" alt="Logo" height={32} />
        </Link>
        <span className="navbar-title">Vacancy Management</span>
      </div>
      <div className="navbar-links">
        <Link href="/">Home</Link>
        {!user && <Link href="/login">Login</Link>}
        {!user && <Link href="/signup">Signup</Link>}
        {user && (
          <Link href={getDashboardPath(user.role)}>Dashboard</Link>
        )}
        {user && (
          <span className="navbar-user">{user.username}</span>
        )}
        {user && (
          <button className="navbar-logout" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

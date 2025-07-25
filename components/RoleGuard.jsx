"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '../lib/auth';
import { getDashboardPath } from '../lib/roles';

export default function RoleGuard({ allowedRoles, children }) {
  const router = useRouter();
  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.replace('/login');
    } else if (!allowedRoles.includes(user.role)) {
      router.replace(getDashboardPath(user.role));
    }
  }, [allowedRoles, router]);
  return children;
}

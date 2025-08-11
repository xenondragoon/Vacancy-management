"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '../lib/auth';
import { getDashboardPath } from '../lib/roles';
import LoadingSpinner from './LoadingSpinner';

export default function RoleGuard({ allowedRoles, children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = getUser();
      if (!user) {
        router.replace('/login');
        return;
      }
      
      if (!allowedRoles.includes(user.role)) {
        router.replace(getDashboardPath(user.role));
        return;
      }
      
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="role-guard-loading">
        <LoadingSpinner size="large" text="Checking permissions..." />
      </div>
    );
  }

  return isAuthorized ? children : null;
}

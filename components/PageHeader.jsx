"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiHome, FiChevronRight } from "react-icons/fi";

export default function PageHeader({ title, subtitle, breadcrumbs = [] }) {
  const pathname = usePathname();
  
  // Generate breadcrumbs from pathname if not provided
  const generateBreadcrumbs = () => {
    if (breadcrumbs.length > 0) return breadcrumbs;
    
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbItems = [];
    
    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const isLast = index === paths.length - 1;
      
      let label = path.charAt(0).toUpperCase() + path.slice(1);
      
      // Customize labels for better UX
      if (path === 'dashboards') label = 'Dashboard';
      if (path === 'admin') label = 'Admin';
      if (path === 'manager') label = 'Manager';
      if (path === 'applicant') label = 'Applicant';
      if (path === 'manage-job-posts') label = 'Manage Job Posts';
      if (path === 'view-applicants') label = 'View Applicants';
      if (path === 'interview-scheduler') label = 'Interview Scheduler';
      if (path === 'browse-jobs') label = 'Browse Jobs';
      if (path === 'my-applications') label = 'My Applications';
      if (path === 'job-listings') label = 'Job Listings';
      if (path === 'admin-users') label = 'Admin Users';
      if (path === 'reports') label = 'Reports';
      
      breadcrumbItems.push({
        label,
        path: isLast ? null : currentPath,
        isLast
      });
    });
    
    return breadcrumbItems;
  };

  const breadcrumbItems = generateBreadcrumbs();

  return (
    <div className="page-header">
      <div className="page-header-content">
        <div className="page-breadcrumbs">
          <Link href="/dashboards" className="breadcrumb-item">
            <FiHome size={16} />
            <span>Home</span>
          </Link>
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="breadcrumb-separator">
              <FiChevronRight size={16} />
            </div>
          ))}
          {breadcrumbItems.map((item, index) => (
            item.isLast ? (
              <span key={index} className="breadcrumb-item current">
                {item.label}
              </span>
            ) : (
              <Link key={index} href={item.path} className="breadcrumb-item">
                {item.label}
              </Link>
            )
          ))}
        </div>
        
        <div className="page-title-section">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
} 
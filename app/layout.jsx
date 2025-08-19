// import { Inter } from 'next/font/google'
import '../styles/globals.css'
import '../styles/components.css'
import '../styles/NavBar.css'
import '../styles/Sidebar.css'
import '../styles/login.css'
import '../styles/signup.css'
import '../styles/adminCss/adminLayout.css'
import '../styles/adminCss/adminDashboard.css'
import '../styles/adminCss/interviewScheduler.css'
import '../styles/adminCss/manageJobPosts.css'
import '../styles/adminCss/viewApplicants.css'
import '../styles/applicantCss/applicantLayout.css'
import '../styles/applicantCss/browseJobs.css'
import '../styles/applicantCss/myApplications.css'
import '../styles/applicantCss/notifications.css'
import '../styles/managerCss/managerLayout.css'
import '../styles/managerCss/dashboardOverview.css'
import '../styles/managerCss/jobListings.css'
import '../styles/managerCss/applicants.css'
import '../styles/managerCss/reports.css'
import { ToastProvider } from '../components/Toast'

// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Vacancy Management System',
  description: 'A comprehensive vacancy management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
} 
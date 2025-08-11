// import { Inter } from 'next/font/google'
import '../styles/globals.css'

// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Vacancy Management System',
  description: 'A comprehensive vacancy management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import ThemeToggle from '../components/ThemeToggle';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}

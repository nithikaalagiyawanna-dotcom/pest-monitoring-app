
import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Pest Monitoring', description: 'Inspector app' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>
      <nav style={{padding:'8px', borderBottom:'1px solid #eee'}}>
        <Link href="/login">Login</Link>{' | '}
        <Link href="/inspect">Inspect</Link>{' | '}
        <Link href="/map">Map</Link>{' | '}
        <Link href="/dashboard">Dashboard</Link>
      </nav>
      <main style={{padding:'16px'}}>{children}</main>
    </body></html>
  );
}

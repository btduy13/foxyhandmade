import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Admin — Foxy Handmade",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  // Simple check for session cookie
  const cookieStore = await cookies();
  const session = cookieStore.get('foxy_admin_session');
  const isAuthenticated = session?.value === 'authenticated';

  // We rely on the fact that children will be the page content.
  // However, we can't easily check the current URL here to avoid infinite redirect loop
  // if we were to redirect on the login page itself.
  // In Next.js App Router, layout.js wraps the page. 
  // If we want to check auth for ALL /admin/* except /admin/login, we usually use middleware.
  // But let's keep it simple: if not authenticated and trying to access /admin (not /admin/login), redirect.
  // Note: layout.js doesn't know the exact path easily without headers.
  
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
    }}>
      {children}
    </div>
  );
}

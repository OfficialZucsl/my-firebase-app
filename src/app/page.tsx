import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import SidebarNav from '@/components/sidebar-nav';
import Dashboard from '@/components/dashboard';
import { getAuthenticatedUser } from '@/lib/firebase-admin';

export default async function HomePage() {
  const user = await getAuthenticatedUser();

  // Middleware should redirect non-authenticated users,
  // but this is a fallback.
  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-background p-4 md:p-6 lg:p-8">
            <Dashboard userId={user.uid} />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

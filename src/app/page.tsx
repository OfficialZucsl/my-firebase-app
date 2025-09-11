
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import SidebarNav from '@/components/sidebar-nav';
import Dashboard from '@/components/dashboard';
import { getAuthenticatedUser } from '@/lib/firebase-admin';
import { Toaster } from '@/components/ui/toaster';


export default async function HomePage() {
  const user = await getAuthenticatedUser();

  // This check is important. If no user is found on the server,
  // the middleware will handle the redirect, but we shouldn't try to render.
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
          <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

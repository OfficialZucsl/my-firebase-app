
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import SidebarNav from '@/components/sidebar-nav';
import CashTracker from '@/components/cash-tracker';
import { getAuthenticatedUser } from '@/lib/firebase-admin';

export default async function TransactionsPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-background p-4 md:p-6 lg:p-8">
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold">Cash Management</h1>
              <p className="text-muted-foreground">Track your personal income and expenses to better manage your finances.</p>
              <CashTracker userId={user.uid} />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

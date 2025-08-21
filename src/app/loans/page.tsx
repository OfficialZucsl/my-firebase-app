import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import SidebarNav from '@/components/sidebar-nav';
import LoanHistory from '@/components/loan-history';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoansPage() {
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
              <h1 className="text-2xl font-semibold">My Loans</h1>
              <LoanHistory />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

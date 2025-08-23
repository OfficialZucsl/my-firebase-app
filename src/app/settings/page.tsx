import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import SidebarNav from '@/components/sidebar-nav';
import ProfileForm from '@/components/profile-form';

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-background p-4 md:p-6 lg:p-8">
            <div className="space-y-4 max-w-2xl mx-auto">
              <div>
                <h1 className="text-2xl font-semibold">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and personal information.</p>
              </div>
              <ProfileForm />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

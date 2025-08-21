'use client';
import {
  Home,
  FileText,
  CreditCard,
  Settings,
  BadgeDollarSign,
  BookOpen,
} from 'lucide-react';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import FiduciaLendLogo from './fiducia-lend-logo';
import { usePathname } from 'next/navigation';

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <FiduciaLendLogo className="size-8 text-primary" />
          <span className="text-lg font-semibold text-primary">
            FiduciaLend
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton href="/" isActive={pathname === '/'}>
              <Home />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/loans" isActive={pathname === '/loans'}>
              <FileText />
              Loans
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/payments" isActive={pathname === '/payments'}>
              <CreditCard />
              Payments
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/offers" isActive={pathname === '/offers'}>
              <BadgeDollarSign />
              Offers
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/articles" isActive={pathname === '/articles'}>
              <BookOpen />
              Articles
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <Settings />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

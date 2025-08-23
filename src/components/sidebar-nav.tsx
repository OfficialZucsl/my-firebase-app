
'use client';
import {
  Home,
  FileText,
  CreditCard,
  Settings,
  BadgeDollarSign,
  BookOpen,
  ArrowRightLeft,
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
import Link from 'next/link';

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
            <Link href="/" passHref>
              <SidebarMenuButton asChild isActive={pathname === '/'}>
                <span>
                  <Home />
                  Dashboard
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/loans" passHref>
              <SidebarMenuButton asChild isActive={pathname === '/loans'}>
                <span>
                  <FileText />
                  Loans
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/payments" passHref>
              <SidebarMenuButton asChild isActive={pathname === '/payments'}>
                <span>
                  <CreditCard />
                  Payments
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/transactions" passHref>
              <SidebarMenuButton asChild isActive={pathname === '/transactions'}>
                <span>
                  <ArrowRightLeft />
                  Transactions
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/offers" passHref>
              <SidebarMenuButton asChild isActive={pathname === '/offers'}>
                <span>
                  <BadgeDollarSign />
                  Offers
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/articles" passHref>
              <SidebarMenuButton asChild isActive={pathname === '/articles'}>
                <span>
                  <BookOpen />
                  Articles
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/settings" passHref>
                <SidebarMenuButton asChild isActive={pathname === '/settings'}>
                    <span>
                        <Settings />
                        Settings
                    </span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

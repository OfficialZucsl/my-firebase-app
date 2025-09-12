
'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import SidebarNav from '@/components/sidebar-nav';
import LoanHistory from '@/components/loan-history';
import { useLoanStore } from '@/hooks/use-loan-store';
import { Button } from '@/components/ui/button';
import { updateLoanStatus } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function LoansPage() {
  const { loans, updateLoan, fetchLoans, loading } = useLoanStore();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLoans(user.uid);
    }
  }, [user, fetchLoans]);


  const handleUpdateStatus = async (id: string, status: 'Active' | 'Rejected') => {
    try {
      const result = await updateLoanStatus(id, status);
      if (result.success) {
        updateLoan(id, result.updatedLoan!);
        toast({
          title: 'Success!',
          description: `Loan #${id} has been ${status === 'Active' ? 'approved' : 'declined'}.`,
        });
      } else {
        throw new Error('Failed to update loan status');
      }
    } catch (error) {
       toast({
          title: 'Error',
          description: 'Failed to update loan status.',
          variant: 'destructive',
        });
    }
  };


  const loanActions = (loan: any) => {
    if (loan.status === 'Pending') {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(loan.id, 'Active')}>
            Approve
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(loan.id, 'Rejected')}>
            Decline
          </Button>
        </div>
      );
    }
    return null;
  };

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
              <LoanHistory loans={loans} actions={loanActions} loading={loading} />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

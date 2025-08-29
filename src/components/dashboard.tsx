'use client';
import { useEffect } from 'react';
import LoanHistory from './loan-history';
import LoanSummaryCard from './loan-summary-card';
import PersonalizedTipsForm from './personalized-tips-form';
import RepaymentChart from './repayment-chart';
import { useLoanStore } from '@/hooks/use-loan-store';
import { useAuth } from '@/hooks/use-auth';

export default function Dashboard({ userId }: { userId: string }) {
  const { loans = [], fetchLoans, loading } = useLoanStore();
  const { user } = useAuth();
  
  useEffect(() => {
    // Ensure we use the userId passed from the server component for the initial fetch
    if (userId) {
      fetchLoans(userId);
    }
  }, [userId, fetchLoans]);

  // If you need to react to client-side user changes (though less likely on this page)
  // you could add another useEffect block dependent on `user`.

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8">
      <div className="lg:col-span-1 xl:col-span-1 space-y-4 md:space-y-8">
        <LoanSummaryCard loans={loans} loading={loading} />
        <RepaymentChart loans={loans} loading={loading} />
      </div>
      <div className="lg:col-span-2 xl:col-span-3 space-y-4 md:space-y-8">
        <PersonalizedTipsForm />
        <div className="lg:col-span-2 xl:col-span-3">
          <LoanHistory loans={loans} loading={loading} />
        </div>
      </div>
    </div>
  );
}

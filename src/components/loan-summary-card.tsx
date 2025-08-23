'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Calendar, TrendingUp, Info } from 'lucide-react';
import { RequestLoanDialog } from './request-loan-dialog';
import { Progress } from '@/components/ui/progress';
import type { Loan } from '@/lib/types';
import { useMemo } from 'react';
import { Skeleton } from './ui/skeleton';

export default function LoanSummaryCard({ loans, loading }: { loans: Loan[], loading: boolean }) {
  const activeLoan = useMemo(() => loans.find(loan => loan.status === 'Active'), [loans]);
  
  // Mocking payment progress for demonstration. In a real app, this would come from payment history.
  const totalLoanAmount = activeLoan ? activeLoan.amount * (1 + activeLoan.interestRate) : 0;
  const outstandingBalance = activeLoan ? activeLoan.nextPaymentAmount * (activeLoan.termInWeeks - 1) : 0; // Simplified
  const amountPaid = totalLoanAmount - outstandingBalance;
  const progressPercentage = totalLoanAmount > 0 ? (amountPaid / totalLoanAmount) * 100 : 0;


  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="mt-4">
            <Skeleton className="h-2 w-full" />
            <div className="mt-2 flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                 <Skeleton className="h-5 w-1/2 mb-1" />
                 <Skeleton className="h-6 w-3/4" />
              </div>
               <div>
                 <Skeleton className="h-5 w-1/2 mb-1" />
                 <Skeleton className="h-6 w-3/4" />
              </div>
          </div>
        </div>
      );
    }
    
    if (!activeLoan) {
      return (
        <div className="text-center text-muted-foreground py-8">
          <Info className="mx-auto h-8 w-8 mb-2" />
          <p>No active loans at the moment.</p>
          <p className="text-xs">Request a new loan to get started.</p>
        </div>
      );
    }

    return (
      <>
        <div className="text-2xl font-bold">
          ZMW {outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <p className="text-xs text-muted-foreground">
          Remaining balance of ZMW {totalLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <div className="mt-4">
          <Progress value={progressPercentage} className="h-2" />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Paid: ZMW {amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span>{progressPercentage.toFixed(0)}% Complete</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <DollarSign className="size-4 text-primary" />
              <span>Next Payment</span>
            </div>
            <p className="text-lg font-semibold">ZMW {activeLoan.nextPaymentAmount.toFixed(2)}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="size-4 text-primary" />
              <span>Due Date</span>
            </div>
            <p className="text-lg font-semibold">{activeLoan.nextPaymentDate}</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Loan Tracker</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {renderContent()}
        <RequestLoanDialog>
          <Button className="mt-6 w-full">Request New Loan</Button>
        </RequestLoanDialog>
      </CardContent>
    </Card>
  );
}

'use client';

import { useAuth } from '@/hooks/use-auth';
import { useLoanStore } from '@/hooks/use-loan-store';
import { useEffect } from 'react';
import { LoanSummaryCard } from '@/components/loan-summary-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RequestLoanDialog } from './request-loan-dialog';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  Plus,
  History,
  User,
  Settings,
  AlertCircle,
} from 'lucide-react';
import { Toaster } from './ui/toaster';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function Dashboard({ userId }: { userId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    loans,
    payments,
    loading: dataLoading,
    error,
    fetchLoans,
    fetchPayments,
    getTotalDebt,
    getRecentPayments,
  } = useLoanStore();

  // Fetch data when component mounts with a valid userId
  useEffect(() => {
    if (userId) {
      console.log('Fetching data for user:', userId);
      fetchLoans(userId);
      fetchPayments(userId);
    }
  }, [userId, fetchLoans, fetchPayments]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: `Failed to load dashboard data: ${error}`,
        variant: 'destructive',
      });
    }
  }, [error, toast]);


  // Safe data getters
  const totalDebt = getTotalDebt();
  const recentPayments = getRecentPayments(3);
  const activeLoans = loans.filter(
    (loan) => loan.status === 'Active'
  );
  const completedLoans = loans.filter((loan) => loan.status === 'Paid Off');

  // Format currency safely
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
    }).format(amount || 0);
  };

  // Format date safely
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    // The date is already a string in 'yyyy-MM-dd' format from the server action
    return dateString;
  };


  if (dataLoading && loans.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalDebt)}
              </div>
              <p className="text-xs text-muted-foreground">
                Sum of all active loan balances.
              </p>
            </CardContent>
          </Card>

           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {activeLoans.length}
              </div>
               <p className="text-xs text-muted-foreground">
                Currently outstanding loans.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Loans</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {completedLoans.length}
              </div>
               <p className="text-xs text-muted-foreground">
                Loans you have fully paid off.
              </p>
            </CardContent>
          </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {payments.length}
              </div>
               <p className="text-xs text-muted-foreground">
                Number of payments made.
              </p>
            </CardContent>
          </Card>
      </div>
      
       <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <LoanSummaryCard />
        </div>
         <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <RequestLoanDialog>
                  <Button className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Apply for New Loan
                  </Button>
                </RequestLoanDialog>
                <Link href="/payments" passHref>
                  <Button className="w-full justify-start" variant="outline">
                    <History className="w-4 h-4 mr-2" />
                    View Payment History
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentPayments.length > 0 ? (
                  <div className="space-y-4">
                    {recentPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(payment.date)}</p>
                        </div>
                        <Badge
                          className={
                            payment.status === 'successful'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-4" />
                    <p>No recent payments</p>
                  </div>
                )}
              </CardContent>
            </Card>
         </div>
       </div>

    </>
  );
}

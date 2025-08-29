'use client';

import { useAuth } from '@/hooks/use-auth';
import { useLoanStore } from '@/hooks/use-loan-store';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, DollarSign, Calendar, AlertCircle } from 'lucide-react';

export function LoanSummaryCard() {
  const { user } = useAuth();
  const { 
    loans, 
    loading, 
    error, 
    fetchLoans, 
    getActiveLoan, 
    getTotalDebt, 
    getNextPaymentAmount 
  } = useLoanStore();

  // Fetch loans when user becomes available
  useEffect(() => {
    if (user?.uid) {
      fetchLoans(user.uid);
    }
  }, [user?.uid, fetchLoans]);

  // Safe getter for active loan with null checks
  const activeLoan = getActiveLoan();
  const totalDebt = getTotalDebt();
  const nextPaymentAmount = getNextPaymentAmount();

  // Loading state
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Loan Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="w-full border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            Error Loading Loans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <Button 
            onClick={() => user?.uid && fetchLoans(user.uid)}
            variant="outline"
            size="sm"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No active loans state
  if (!activeLoan) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Loan Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Active Loans</h3>
            <p className="text-sm text-gray-500 mb-4">
              You don't have any active loans at the moment.
            </p>
            <Button size="sm">
              Apply for Loan
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format currency safely
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  // Format date safely
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Not set';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'defaulted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Loan Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Loan Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <Badge className={getStatusColor(activeLoan.status)}>
              {activeLoan.status.charAt(0).toUpperCase() + activeLoan.status.slice(1)}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Loan Amount</p>
            <p className="text-lg font-semibold">{formatCurrency(activeLoan.amount)}</p>
          </div>
        </div>

        {/* Financial Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Outstanding</span>
            </div>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(activeLoan.remainingBalance)}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Next Payment</span>
            </div>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(nextPaymentAmount)}
            </p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Next Payment Due</span>
            <span className="text-sm font-medium">
              {formatDate(activeLoan.nextPaymentDate)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Monthly Payment</span>
            <span className="text-sm font-medium">
              {formatCurrency(activeLoan.monthlyPayment)}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>
                {Math.round(((activeLoan.amount - activeLoan.remainingBalance) / activeLoan.amount) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, ((activeLoan.amount - activeLoan.remainingBalance) / activeLoan.amount) * 100)}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button className="flex-1" size="sm">
            Make Payment
          </Button>
          <Button variant="outline" className="flex-1" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { RequestLoanDialog } from './request-loan-dialog';
import { Progress } from '@/components/ui/progress';

export default function LoanSummaryCard() {
  // Mock data for an active loan
  const totalLoanAmount = 20000;
  const outstandingBalance = 12500;
  const amountPaid = totalLoanAmount - outstandingBalance;
  const progressPercentage = (amountPaid / totalLoanAmount) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Loan Tracker</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <p className="text-xs text-muted-foreground">
          Remaining balance of ${totalLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <div className="mt-4">
          <Progress value={progressPercentage} className="h-2" />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Paid: ${amountPaid.toLocaleString()}</span>
            <span>{progressPercentage.toFixed(0)}% Complete</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <DollarSign className="size-4 text-primary" />
              <span>Next Payment</span>
            </div>
            <p className="text-lg font-semibold">$498.30</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="size-4 text-primary" />
              <span>Due Date</span>
            </div>
            <p className="text-lg font-semibold">Aug 15, 2024</p>
          </div>
        </div>
        <RequestLoanDialog>
          <Button className="mt-6 w-full">Request New Loan</Button>
        </RequestLoanDialog>
      </CardContent>
    </Card>
  );
}

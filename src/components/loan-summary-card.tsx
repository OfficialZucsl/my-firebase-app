
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { RequestLoanDialog } from './request-loan-dialog';

export default function LoanSummaryCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Loan Overview</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$20,000.00</div>
        <p className="text-xs text-muted-foreground">Total outstanding balance</p>
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

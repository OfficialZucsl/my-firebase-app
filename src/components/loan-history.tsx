import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Loan } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PaymentDialog } from './payment-dialog';
import { cn } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-react';

const mockLoans: Loan[] = [
  {
    id: 'LN75643',
    amount: 5000,
    interestRate: 5.5,
    term: 24,
    status: 'Active',
    nextPaymentDate: '2024-08-15',
    nextPaymentAmount: 220.5,
  },
  {
    id: 'LN62841',
    amount: 15000,
    interestRate: 4.2,
    term: 60,
    status: 'Active',
    nextPaymentDate: '2024-08-20',
    nextPaymentAmount: 277.8,
  },
  {
    id: 'LN45239',
    amount: 2500,
    interestRate: 7.0,
    term: 12,
    status: 'Paid Off',
    nextPaymentDate: 'N/A',
    nextPaymentAmount: 0,
  },
  {
    id: 'LN98123',
    amount: 1000,
    interestRate: 8.1,
    term: 6,
    status: 'Overdue',
    nextPaymentDate: '2024-07-10',
    nextPaymentAmount: 170.6,
  },
];

export default function LoanHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Button variant="ghost" size="sm"><ArrowUpDown className="mr-2 h-4 w-4" />ID</Button></TableHead>
              <TableHead className="text-right"><Button variant="ghost" size="sm"><ArrowUpDown className="mr-2 h-4 w-4" />Amount</Button></TableHead>
              <TableHead><Button variant="ghost" size="sm"><ArrowUpDown className="mr-2 h-4 w-4" />Status</Button></TableHead>
              <TableHead>Next Payment</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLoans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className="font-medium">{loan.id}</TableCell>
                <TableCell className="text-right">
                  ${loan.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn({
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400': loan.status === 'Paid Off',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400': loan.status === 'Active',
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400': loan.status === 'Overdue',
                    })}
                  >
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell>
                    {loan.nextPaymentDate}
                </TableCell>
                <TableCell className="text-right">
                  {loan.status !== 'Paid Off' && (
                    <PaymentDialog loan={loan}>
                      <Button size="sm">Make Payment</Button>
                    </PaymentDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


'use client';

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

export default function LoanHistory({
  loans,
  actions,
}: {
  loans: Loan[];
  actions?: (loan: Loan) => React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  ID
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Amount
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Status
                </Button>
              </TableHead>
              <TableHead>Next Payment</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className="font-medium">{loan.id}</TableCell>
                <TableCell className="text-right">
                  ZMW {loan.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn({
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400':
                        loan.status === 'Paid Off',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400':
                        loan.status === 'Active',
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400':
                        loan.status === 'Overdue' || loan.status === 'Rejected',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400':
                        loan.status === 'Pending',
                    })}
                  >
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell>{loan.nextPaymentDate}</TableCell>
                <TableCell className="text-right">
                  {actions
                    ? actions(loan)
                    : loan.status !== 'Paid Off' &&
                      loan.status !== 'Pending' &&
                      loan.status !== 'Rejected' && (
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

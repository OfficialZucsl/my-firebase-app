
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
import { cn } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const mockTransactions = [
  {
    id: 'TRN-001',
    type: 'loan_disbursal',
    amount: 5000,
    description: 'Loan disbursement for LN75643',
    date: '2024-07-01',
  },
  {
    id: 'TRN-002',
    type: 'repayment',
    amount: 650.50,
    description: 'Payment for loan LN75643',
    date: '2024-07-15',
  },
  {
    id: 'TRN-003',
    type: 'income',
    amount: 2500,
    description: 'Monthly Salary',
    date: '2024-07-25',
  },
  {
    id: 'TRN-004',
    type: 'expense',
    amount: 300,
    description: 'Groceries',
    date: '2024-07-26',
  },
   {
    id: 'TRN-005',
    type: 'repayment',
    amount: 1005.80,
    description: 'Payment for loan LN62841',
    date: '2024-07-20',
  },
];

const transactionTypeDetails = {
    income: {
        label: "Income",
        icon: ArrowDownLeft,
        color: "text-green-500",
    },
    expense: {
        label: "Expense",
        icon: ArrowUpRight,
        color: "text-red-500",
    },
    repayment: {
        label: "Repayment",
        icon: ArrowUpRight,
        color: "text-red-500",
    },
    loan_disbursal: {
        label: "Loan Disbursal",
        icon: ArrowDownLeft,
        color: "text-green-500",
    }
}


export default function TransactionHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((transaction) => {
                const details = transactionTypeDetails[transaction.type as keyof typeof transactionTypeDetails];
                const Icon = details.icon;
              return (
              <TableRow key={transaction.id}>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <div className={cn("rounded-full p-1.5 bg-muted", details.color)}>
                            <Icon className="size-4" />
                        </div>
                        <span className="font-medium">{details.label}</span>
                    </div>
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell className={cn("text-right font-semibold", details.color)}>
                    {transaction.type === 'income' || transaction.type === 'loan_disbursal' ? '+' : '-'}
                    ZMW {transaction.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

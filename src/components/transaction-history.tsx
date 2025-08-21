
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { PersonalTransaction } from '@/lib/types';

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
}

export default function PersonalTransactionsTable({ transactions }: { transactions: PersonalTransaction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
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
                <TableCell><span className="text-xs font-semibold uppercase">{transaction.category}</span></TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell className={cn("text-right font-semibold", details.color)}>
                    {transaction.type === 'income' ? '+' : '-'}
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

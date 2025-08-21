
'use client';

import { useState } from 'react';
import type { PersonalTransaction } from '@/lib/types';
import BalanceCard from './balance-card';
import ExpensePieChart from './expense-pie-chart';
import PersonalTransactionsTable from './transaction-history';
import { AddTransactionDialog } from './add-transaction-dialog';

const mockPersonalTransactions: PersonalTransaction[] = [
  { id: 'PT-001', type: 'income', amount: 3000, description: 'Monthly Salary', category: 'Salary', date: '2024-08-01' },
  { id: 'PT-002', type: 'expense', amount: 80, description: 'Bus Fare', category: 'Transport', date: '2024-08-02' },
  { id: 'PT-003', type: 'expense', amount: 250, description: 'Groceries', category: 'Food', date: '2024-08-03' },
  { id: 'PT-004', type: 'expense', amount: 120, description: 'Outing with friends', category: 'Entertainment', date: '2024-08-05' },
  { id: 'PT-005', type: 'expense', amount: 500, description: 'Rent', category: 'Housing', date: '2024-08-05' },
];

export default function CashTracker() {
  const [transactions, setTransactions] = useState(mockPersonalTransactions);

  const balance = transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);

  const expenses = transactions.filter(t => t.type === 'expense');

  const handleAddTransaction = (newTransaction: Omit<PersonalTransaction, 'id' | 'date'>) => {
    const transaction: PersonalTransaction = {
      ...newTransaction,
      id: `PT-00${transactions.length + 1}`,
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8">
      <div className="lg:col-span-1 xl:col-span-1 space-y-4 md:space-y-8">
        <BalanceCard balance={balance} />
        <ExpensePieChart transactions={expenses} />
      </div>
      <div className="lg:col-span-2 xl:col-span-3 space-y-4 md:space-y-8">
        <div className="flex justify-end">
            <AddTransactionDialog onAddTransaction={handleAddTransaction} />
        </div>
        <PersonalTransactionsTable transactions={transactions} />
      </div>
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';
import type { PersonalTransaction } from '@/lib/types';
import BalanceCard from './balance-card';
import ExpensePieChart from './expense-pie-chart';
import PersonalTransactionsTable from './transaction-history';
import { AddTransactionDialog } from './add-transaction-dialog';
import { getTransactions, addTransaction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';


export default function CashTracker({ userId }: { userId: string }) {
  const [transactions, setTransactions] = useState<PersonalTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const fetchedTransactions = await getTransactions(userId);
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        toast({
          title: "Error",
          description: "Could not fetch transaction history.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    if (userId) {
      fetchTransactions();
    }
  }, [userId, toast]);


  const balance = transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);

  const expenses = transactions.filter(t => t.type === 'expense');

  const handleAddTransaction = async (newTransactionData: Omit<PersonalTransaction, 'id' | 'date' | 'userId'>) => {
    try {
      const transactionWithUser = { ...newTransactionData, userId };
      const newTransaction = await addTransaction(transactionWithUser);
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
       toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    }
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
        {loading ? (
          <p className="text-muted-foreground">Loading transactions...</p>
        ) : (
          <PersonalTransactionsTable transactions={transactions} />
        )}
      </div>
    </div>
  );
}

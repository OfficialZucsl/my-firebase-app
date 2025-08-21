import { create } from 'zustand';
import type { Loan } from '@/lib/types';

const mockLoans: Loan[] = [
  {
    id: 'LN75643',
    amount: 5000,
    interestRate: 5.5,
    termInWeeks: 8,
    status: 'Active',
    nextPaymentDate: '2024-08-15',
    nextPaymentAmount: 650.5,
  },
  {
    id: 'LN62841',
    amount: 15000,
    interestRate: 4.2,
    termInWeeks: 16,
    status: 'Active',
    nextPaymentDate: '2024-08-20',
    nextPaymentAmount: 1005.8,
  },
  {
    id: 'LN45239',
    amount: 2500,
    interestRate: 7.0,
    termInWeeks: 4,
    status: 'Paid Off',
    nextPaymentDate: 'N/A',
    nextPaymentAmount: 0,
  },
  {
    id: 'LN98123',
    amount: 1000,
    interestRate: 8.1,
    termInWeeks: 2,
    status: 'Overdue',
    nextPaymentDate: '2024-07-10',
    nextPaymentAmount: 550.6,
  },
];

type LoanState = {
  loans: Loan[];
  addLoan: (loan: Loan) => void;
  updateLoan: (id: string, updates: Partial<Loan>) => void;
};

export const useLoanStore = create<LoanState>((set) => ({
  loans: mockLoans,
  addLoan: (loan) => set((state) => ({ loans: [loan, ...state.loans] })),
  updateLoan: (id, updates) =>
    set((state) => ({
      loans: state.loans.map((loan) =>
        loan.id === id ? { ...loan, ...updates } : loan
      ),
    })),
}));

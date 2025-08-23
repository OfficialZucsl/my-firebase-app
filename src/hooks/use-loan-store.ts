import { create } from 'zustand';
import type { Loan } from '@/lib/types';
import { getLoans } from '@/app/actions';

type LoanState = {
  loans: Loan[];
  loading: boolean;
  fetchLoans: () => Promise<void>;
  addLoan: (loan: Loan) => void;
  updateLoan: (id: string, updates: Partial<Loan>) => void;
};

export const useLoanStore = create<LoanState>((set) => ({
  loans: [],
  loading: true,
  fetchLoans: async () => {
    try {
      set({ loading: true });
      const loans = await getLoans();
      set({ loans, loading: false });
    } catch (error) {
      console.error("Failed to fetch loans:", error);
      set({ loading: false });
    }
  },
  addLoan: (loan) => set((state) => ({ loans: [loan, ...state.loans] })),
  updateLoan: (id, updates) =>
    set((state) => ({
      loans: state.loans.map((loan) =>
        loan.id === id ? { ...loan, ...updates } : loan
      ),
    })),
}));

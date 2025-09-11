import { create } from 'zustand';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Loan as LoanType, Payment as PaymentType } from '@/lib/types';


export interface Loan extends LoanType {
  remainingBalance: number;
  monthlyPayment: number;
  totalPaid: number;
}
export interface Payment extends PaymentType {}

interface LoanStore {
  loans: Loan[];
  payments: Payment[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchLoans: (userId: string | undefined) => Promise<void>;
  fetchPayments: (userId: string | undefined) => Promise<void>;
  addLoan: (loan: LoanType) => void;
  updateLoan: (id: string, updates: Partial<LoanType>) => void;
  makePayment: (paymentData: Omit<Payment, 'id' | 'date'>) => Promise<void>;
  
  // Selectors
  getActiveLoan: () => Loan | null;
  getTotalDebt: () => number;
  getNextPaymentAmount: () => number;
  getRecentPayments: (limit?: number) => Payment[];
}

export const useLoanStore = create<LoanStore>((set, get) => ({
  loans: [],
  payments: [],
  loading: false,
  error: null,

  fetchLoans: async (userId: string | undefined) => {
    if (!userId) {
      console.warn('fetchLoans called without userId, skipping fetch');
      return;
    }

    set({ loading: true, error: null });
    
    try {
      const loansRef = collection(db, 'loans');
      // Simplified query to avoid index requirement
      const q = query(
        loansRef, 
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const loans: Loan[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const amount = data.amount || 0;
        const totalPaid = data.totalPaid || 0;
        return {
          id: doc.id,
          ...data,
          applicationDate: data.applicationDate?.toDate(),
          approvalDate: data.approvalDate?.toDate(),
          nextPaymentDate: data.nextPaymentDate?.toDate(),
          remainingBalance: amount - totalPaid, // Calculate remaining balance
          monthlyPayment: data.nextPaymentAmount || 0
        }
      }) as Loan[];

      // Sort client-side
      loans.sort((a, b) => (b.applicationDate?.getTime() || 0) - (a.applicationDate?.getTime() || 0));

      set({ loans, loading: false });
    } catch (error) {
      console.error('Error fetching loans:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch loans',
        loading: false 
      });
    }
  },

  fetchPayments: async (userId: string | undefined) => {
    if (!userId) {
      console.warn('fetchPayments called without userId, skipping fetch');
      return;
    }

    set({ loading: true, error: null });
    
    try {
      const paymentsRef = collection(db, 'payments');
      const q = query(
        paymentsRef, 
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const payments: Payment[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
      })) as Payment[];

      set({ payments, loading: false });
    } catch (error) {
      console.error('Error fetching payments:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch payments',
        loading: false 
      });
    }
  },
  
  addLoan: (loan) => {
    set((state) => ({
      loans: [
        { ...loan, remainingBalance: loan.amount, totalPaid: 0, monthlyPayment: loan.nextPaymentAmount },
        ...state.loans
      ]
    }));
  },
  
  updateLoan: (id, updates) => {
    set((state) => ({
      loans: state.loans.map(loan => 
        loan.id === id ? { ...loan, ...updates } as Loan : loan
      )
    }));
  },


  makePayment: async (paymentData) => {
    set({ loading: true, error: null });
    
    try {
      const newPayment = {
        ...paymentData,
        date: new Date(),
      };

      await addDoc(collection(db, 'payments'), newPayment);
      
      const loanRef = doc(db, 'loans', paymentData.loanId);
      const loanDoc = await getDoc(loanRef);
      
      if (loanDoc.exists()) {
        const loanData = loanDoc.data() as Loan;
        const newBalance = (loanData.remainingBalance || loanData.amount) - paymentData.amount;
        const newTotalPaid = (loanData.totalPaid || 0) + paymentData.amount;
        
        await updateDoc(loanRef, {
          remainingBalance: Math.max(0, newBalance),
          totalPaid: newTotalPaid,
          status: newBalance <= 0 ? 'completed' : loanData.status,
        });
      }
      
      if (paymentData.userId) {
        await Promise.all([
          get().fetchLoans(paymentData.userId),
          get().fetchPayments(paymentData.userId)
        ]);
      }
      
      set({ loading: false });
    } catch (error) {
      console.error('Error making payment:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to make payment',
        loading: false 
      });
    }
  },

  getActiveLoan: () => {
    const { loans } = get();
    return loans.find(loan => 
      loan.status === 'Active' || loan.status === 'approved'
    ) || null;
  },

  getTotalDebt: () => {
    const { loans } = get();
    return loans
      .filter(loan => loan.status === 'Active' || loan.status === 'approved')
      .reduce((total, loan) => total + (loan.remainingBalance || 0), 0);
  },

  getNextPaymentAmount: () => {
    const activeLoan = get().getActiveLoan();
    if (!activeLoan) return 0;
    return Math.min(activeLoan.monthlyPayment, activeLoan.remainingBalance);
  },

  getRecentPayments: (limitCount = 5) => {
    const { payments } = get();
    return payments
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limitCount);
  },
}));

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

export interface Loan {
  id: string;
  userId: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'defaulted';
  applicationDate: Date;
  approvalDate?: Date;
  nextPaymentDate?: Date;
  remainingBalance: number;
  monthlyPayment: number;
  totalPaid: number;
}

export interface Payment {
  id: string;
  loanId: string;
  userId: string;
  amount: number;
  paymentDate: Date;
  status: 'completed' | 'pending' | 'failed';
  method: 'bank_transfer' | 'mobile_money' | 'cash';
}

interface LoanStore {
  loans: Loan[];
  payments: Payment[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchLoans: (userId: string | undefined) => Promise<void>;
  fetchPayments: (userId: string | undefined) => Promise<void>;
  applyForLoan: (loanData: Omit<Loan, 'id' | 'applicationDate' | 'status' | 'remainingBalance' | 'totalPaid'>) => Promise<void>;
  makePayment: (paymentData: Omit<Payment, 'id' | 'paymentDate'>) => Promise<void>;
  
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
    // Early return if userId is not available
    if (!userId) {
      console.warn('fetchLoans called without userId, skipping fetch');
      return;
    }

    set({ loading: true, error: null });
    
    try {
      const loansRef = collection(db, 'loans');
      const q = query(
        loansRef, 
        where('userId', '==', userId),
        orderBy('applicationDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const loans: Loan[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        applicationDate: doc.data().applicationDate?.toDate(),
        approvalDate: doc.data().approvalDate?.toDate(),
        nextPaymentDate: doc.data().nextPaymentDate?.toDate(),
      })) as Loan[];

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
    // Early return if userId is not available
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
        orderBy('paymentDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const payments: Payment[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        paymentDate: doc.data().paymentDate?.toDate(),
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

  applyForLoan: async (loanData) => {
    set({ loading: true, error: null });
    
    try {
      const newLoan = {
        ...loanData,
        applicationDate: new Date(),
        status: 'pending' as const,
        remainingBalance: loanData.amount,
        totalPaid: 0,
      };

      const docRef = await addDoc(collection(db, 'loans'), newLoan);
      
      // Refresh loans after adding
      if (loanData.userId) {
        await get().fetchLoans(loanData.userId);
      }
      
      set({ loading: false });
    } catch (error) {
      console.error('Error applying for loan:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to apply for loan',
        loading: false 
      });
    }
  },

  makePayment: async (paymentData) => {
    set({ loading: true, error: null });
    
    try {
      const newPayment = {
        ...paymentData,
        paymentDate: new Date(),
      };

      await addDoc(collection(db, 'payments'), newPayment);
      
      // Update loan balance
      const loanRef = doc(db, 'loans', paymentData.loanId);
      const loanDoc = await getDoc(loanRef);
      
      if (loanDoc.exists()) {
        const loanData = loanDoc.data() as Loan;
        const newBalance = loanData.remainingBalance - paymentData.amount;
        const newTotalPaid = loanData.totalPaid + paymentData.amount;
        
        await updateDoc(loanRef, {
          remainingBalance: Math.max(0, newBalance),
          totalPaid: newTotalPaid,
          status: newBalance <= 0 ? 'completed' : loanData.status,
        });
      }
      
      // Refresh data
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

  // Selectors with safe defaults
  getActiveLoan: () => {
    const { loans } = get();
    return loans.find(loan => 
      loan.status === 'active' || loan.status === 'approved'
    ) || null;
  },

  getTotalDebt: () => {
    const { loans } = get();
    return loans
      .filter(loan => loan.status === 'active' || loan.status === 'approved')
      .reduce((total, loan) => total + loan.remainingBalance, 0);
  },

  getNextPaymentAmount: () => {
    const activeLoan = get().getActiveLoan();
    return activeLoan ? Math.min(activeLoan.monthlyPayment, activeLoan.remainingBalance) : 0;
  },

  getRecentPayments: (limitCount = 5) => {
    const { payments } = get();
    return payments
      .sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime())
      .slice(0, limitCount);
  },
}));

export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  term: number; // in months
  status: 'Active' | 'Paid Off' | 'Overdue';
  nextPaymentDate: string;
  nextPaymentAmount: number;
}

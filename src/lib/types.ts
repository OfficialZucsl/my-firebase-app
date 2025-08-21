
export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  termInWeeks: number;
  status: 'Active' | 'Paid Off' | 'Overdue';
  nextPaymentDate: string;
  nextPaymentAmount: number;
}

export interface LoanRequest {
  amount: number;
  durationInWeeks: number;
}

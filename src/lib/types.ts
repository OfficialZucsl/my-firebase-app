
export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  termInWeeks: number;
  status: 'Active' | 'Paid Off' | 'Overdue' | 'Pending' | 'Rejected';
  nextPaymentDate: string;
  nextPaymentAmount: number;
}

export interface LoanRequest {
  amount: number;
  durationInWeeks: number;
}

export type TransactionType = 'income' | 'expense';

export interface PersonalTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface Article {
  id:string;
  title: string;
  author: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  dataAiHint?: string;
  createdAt: string;
}

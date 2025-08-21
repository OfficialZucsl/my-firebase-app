import type { Timestamp } from 'firebase/firestore';

/**
 * @fileOverview Firestore database schema for the FiduciaLend application.
 *
 * This file defines the TypeScript interfaces for the documents stored in Firestore.
 * Using these interfaces helps ensure data consistency and provides type safety.
 */

/**
 * Represents a user document in the 'users' collection.
 */
export interface User {
  id: string; // Corresponds to Firebase Auth UID
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  financialGoals?: string; // User's stated financial goals
}

/**
 * Represents a loan application document in the 'loanApplications' collection.
 */
export interface LoanApplication {
  id: string;
  userId: string; // Foreign key to the 'users' collection
  amount: number;
  purpose: string;
  termInWeeks: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Represents a loan document in the 'loans' collection.
 */
export interface Loan {
  id: string;
  userId: string; // Foreign key to the 'users' collection
  loanApplicationId: string; // Foreign key to the 'loanApplications' collection
  amount: number; // The principal amount of the loan
  interestRate: number; // Annual interest rate (e.g., 5.5 for 5.5%)
  termInWeeks: number;
  status: 'Active' | 'Paid Off' | 'Overdue';
  startDate: Timestamp; // The date the loan was disbursed
  nextPaymentDate: Timestamp;
  nextPaymentAmount: number;
  outstandingBalance: number;
}

/**
 * Represents a payment document in the 'payments' sub-collection of a loan.
 * Path: /loans/{loanId}/payments/{paymentId}
 */
export interface Payment {
  id: string;
  loanId: string; // The loan this payment is for
  userId: string; // The user who made the payment
  amount: number;
  paymentDate: Timestamp;
  status: 'successful' | 'failed' | 'pending';
}

/**
 * Represents a transaction document in the 'cashactivities' collection.
 * This is used for digital receipts and cash management tracking.
 */
export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense' | 'loan_disbursal' | 'repayment';
  amount: number;
  description: string;
  date: Timestamp;
  relatedLoanId?: string; // Optional link to a loan
}

/**
 * Represents an article in the 'articles' collection for personal finance learning.
 */
export interface Article {
  id: string;
  title: string;
  author: string;
  content: string; // Can be markdown or plain text
  tags: string[];
  createdAt: Timestamp;
  imageUrl?: string;
}


'use server';

import {
  generatePersonalizedTips,
  type GeneratePersonalizedTipsInput,
} from '@/ai/flows/generate-personalized-tips';
import type { Loan, LoanRequest } from '@/lib/types';
import { useLoanStore } from '@/hooks/use-loan-store';
import { addDays, format } from 'date-fns';

export async function getPersonalizedTips(
  input: GeneratePersonalizedTipsInput
) {
  const { personalizedTips } = await generatePersonalizedTips(input);
  return personalizedTips;
}

export async function submitLoanRequest(
  loanDetails: LoanRequest & { weeklyPayment: number }
): Promise<{ success: boolean; message: string; newLoan: Loan }> {
  console.log('New loan request received:', loanDetails);

  const newLoan: Loan = {
    id: `LN${Math.floor(Math.random() * 90000) + 10000}`,
    amount: loanDetails.amount,
    interestRate: 0, // This should be calculated based on duration
    termInWeeks: loanDetails.durationInWeeks,
    status: 'Pending',
    nextPaymentDate: 'N/A',
    nextPaymentAmount: loanDetails.weeklyPayment, // Assuming weekly payments for now
  };

  return {
    success: true,
    message: `Your loan request for ZMW ${loanDetails.amount} has been submitted for review.`,
    newLoan,
  };
}

export async function updateLoanStatus(loanId: string, status: 'Active' | 'Rejected'): Promise<{ success: boolean, updatedLoan: Partial<Loan> }> {
  let updatedFields: Partial<Loan> = { status };

  if (status === 'Active') {
    updatedFields.nextPaymentDate = format(addDays(new Date(), 7), 'yyyy-MM-dd');
  }

  return {
    success: true,
    updatedLoan: updatedFields,
  };
}

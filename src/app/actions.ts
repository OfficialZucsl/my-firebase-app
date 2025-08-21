
'use server';

import {
  generatePersonalizedTips,
  type GeneratePersonalizedTipsInput,
} from '@/ai/flows/generate-personalized-tips';
import type { LoanRequest } from '@/lib/types';

export async function getPersonalizedTips(
  input: GeneratePersonalizedTipsInput
) {
  const { personalizedTips } = await generatePersonalizedTips(input);
  return personalizedTips;
}

export async function submitLoanRequest(
  loanDetails: LoanRequest
): Promise<{ success: boolean; message: string }> {
  console.log('New loan request received:', loanDetails);
  // In a real application, you would save this to Firestore
  // and trigger the rest of Workflow 1.
  // For now, we'll just simulate a successful submission.
  return {
    success: true,
    message: `Your loan request for ZMW ${loanDetails.amount} has been submitted for review.`,
  };
}

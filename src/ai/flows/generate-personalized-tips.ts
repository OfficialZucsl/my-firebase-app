// src/ai/flows/generate-personalized-tips.ts
'use server';

/**
 * @fileOverview Provides personalized financial tips based on loan application and repayment behavior.
 *
 * - generatePersonalizedTips - A function that generates personalized financial tips.
 * - GeneratePersonalizedTipsInput - The input type for the generatePersonalizedTips function.
 * - GeneratePersonalizedTipsOutput - The return type for the generatePersonalizedTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedTipsInputSchema = z.object({
  loanApplicationDetails: z
    .string()
    .describe('Details of the loan application, including amount, purpose, and duration.'),
  repaymentBehavior: z
    .string()
    .describe('Description of the user repayment behavior, including on-time payments, delays, and defaults.'),
  financialGoals: z.string().describe('The user financial goals'),
});
export type GeneratePersonalizedTipsInput = z.infer<typeof GeneratePersonalizedTipsInputSchema>;

const GeneratePersonalizedTipsOutputSchema = z.object({
  personalizedTips: z
    .string()
    .describe('Personalized financial tips tailored to the user loan application and repayment behavior.'),
});
export type GeneratePersonalizedTipsOutput = z.infer<typeof GeneratePersonalizedTipsOutputSchema>;

export async function generatePersonalizedTips(
  input: GeneratePersonalizedTipsInput
): Promise<GeneratePersonalizedTipsOutput> {
  return generatePersonalizedTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedTipsPrompt',
  input: {schema: GeneratePersonalizedTipsInputSchema},
  output: {schema: GeneratePersonalizedTipsOutputSchema},
  prompt: `You are a financial advisor providing personalized tips to users based on their loan application, repayment behavior and financial goals.

  Loan Application Details: {{{loanApplicationDetails}}}
  Repayment Behavior: {{{repaymentBehavior}}}
  Financial goals: {{{financialGoals}}}

  Provide personalized financial tips to help the user improve their financial literacy and manage their loan more effectively. Focus on actionable advice.
  Length should not exceed 200 words.
  `, // Updated prompt
});

const generatePersonalizedTipsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedTipsFlow',
    inputSchema: GeneratePersonalizedTipsInputSchema,
    outputSchema: GeneratePersonalizedTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

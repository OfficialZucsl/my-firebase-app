'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { getPersonalizedTips } from '@/app/actions';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  loanApplicationDetails: z.string().min(10, {
    message: 'Please provide more detail about your loan application.',
  }),
  repaymentBehavior: z.string().min(10, {
    message: 'Please describe your repayment behavior in more detail.',
  }),
  financialGoals: z.string().min(10, {
    message: 'Please tell us more about your financial goals.',
  }),
});

export default function PersonalizedTipsForm() {
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanApplicationDetails: '',
      repaymentBehavior: '',
      financialGoals: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setTips(null);
    try {
      const result = await getPersonalizedTips(values);
      setTips(result);
    } catch (error) {
      console.error('Failed to get tips:', error);
      setTips('Sorry, we were unable to generate tips at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="text-primary size-6" />
          <CardTitle>Personalized Financial Tips</CardTitle>
        </div>
        <CardDescription>
          Tell us about your situation to receive AI-powered financial advice.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="loanApplicationDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Application Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Applied for a $5,000 personal loan for home improvements over 36 months."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repaymentBehavior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repayment Behavior</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I always pay on time, but sometimes struggle with the amount."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="financialGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financial Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I want to improve my credit score and start saving for a down payment on a house."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {tips && (
                <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>Your Personalized Tips</AlertTitle>
                    <AlertDescription>
                        {tips}
                    </AlertDescription>
                </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Get Tips'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

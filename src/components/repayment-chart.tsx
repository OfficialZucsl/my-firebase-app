'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { Loan } from '@/lib/types';
import { useMemo } from 'react';
import { subMonths, format } from 'date-fns';
import { Skeleton } from './ui/skeleton';


const chartConfig = {
  principal: {
    label: 'Principal',
    color: 'hsl(var(--chart-1))',
  },
  interest: {
    label: 'Interest',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function RepaymentChart({ loans, loading }: { loans: Loan[], loading: boolean }) {

  const activeLoan = useMemo(() => loans.find(loan => loan.status === 'Active'), [loans]);

  // Generate mock historical data based on the active loan for demonstration
  const chartData = useMemo(() => {
    if (!activeLoan) {
      // Create empty chart data for the last 6 months
      return Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(new Date(), 5 - i);
        return { month: format(d, 'MMM'), principal: 0, interest: 0 };
      });
    }

    const weeklyInterest = (activeLoan.amount * activeLoan.interestRate) / activeLoan.termInWeeks;
    const weeklyPrincipal = (activeLoan.nextPaymentAmount - weeklyInterest);

    return Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(new Date(), 5 - i);
        // Simulate some payments for past months for chart visibility
        const paymentsMade = activeLoan.termInWeeks > i ? 4 : 0; 
        return {
            month: format(d, 'MMM'),
            principal: weeklyPrincipal * paymentsMade,
            interest: weeklyInterest * paymentsMade,
        };
    });
  }, [activeLoan]);
  
  if (loading) {
      return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="min-h-[200px] w-full" />
            </CardContent>
        </Card>
      )
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Repayment Analytics</CardTitle>
        <CardDescription>Last 6 Months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="principal" fill="var(--color-principal)" radius={4} />
            <Bar dataKey="interest" fill="var(--color-interest)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

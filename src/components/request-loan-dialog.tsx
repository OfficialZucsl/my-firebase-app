
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { submitLoanRequest } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const INTEREST_RATE = 0.055; // 5.5% annual interest rate

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

export function RequestLoanDialog({ children }: { children: React.ReactNode }) {
  const [amount, setAmount] = useState(5000);
  const [duration, setDuration] = useState(24);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const monthlyInterestRate = INTEREST_RATE / 12;
  const monthlyPayment =
    (amount *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, duration)) /
    (Math.pow(1 + monthlyInterestRate, duration) - 1);

  const totalRepayment = monthlyPayment * duration;

  const amortizationData = Array.from({ length: duration }, (_, i) => {
    const month = i + 1;
    // This is a simplified calculation for visualization
    let remainingBalance = amount;
    for (let j = 0; j < i; j++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
    }
    const interestPayment = remainingBalance * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    return {
      month: month.toString(),
      principal: parseFloat(principalPayment.toFixed(2)),
      interest: parseFloat(interestPayment.toFixed(2)),
    };
  });

  const handleAmountChange = (value: number[]) => {
    setAmount(value[0]);
  };

  const handleDurationChange = (value: number[]) => {
    setDuration(value[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await submitLoanRequest({ amount, duration });
      toast({
        title: result.success ? 'Success!' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      if (result.success) {
        setOpen(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Request a New Loan</DialogTitle>
          <DialogDescription>
            Adjust the sliders to select your desired loan amount and duration.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="amount">Amount</Label>
              <span className="font-semibold">
                ${amount.toLocaleString()}
              </span>
            </div>
            <Slider
              id="amount"
              min={500}
              max={50000}
              step={100}
              value={[amount]}
              onValueChange={handleAmountChange}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="duration">Duration (Months)</Label>
              <span className="font-semibold">{duration}</span>
            </div>
            <Slider
              id="duration"
              min={6}
              max={72}
              step={1}
              value={[duration]}
              onValueChange={handleDurationChange}
            />
          </div>
          <div className="mt-4 rounded-lg border bg-muted p-4 space-y-2">
            <h4 className="font-semibold text-sm">Loan Estimate</h4>
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Payment</span>
                <span>${monthlyPayment.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Repayment</span>
                <span>${totalRepayment.toFixed(2)}</span>
            </div>
             <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Interest Rate</span>
                <span>{(INTEREST_RATE * 100).toFixed(1)}% APR</span>
            </div>
          </div>
           <div className="mt-4 rounded-lg border bg-muted p-4">
             <h4 className="font-semibold text-sm mb-2">Repayment Schedule</h4>
             <div className="h-[200px] w-full">
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={amortizationData} stackOffset="sign" margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8}
                    tickFormatter={(value, index) => {
                      if (duration <= 12) return value;
                      // Show ticks for every year
                      return (index + 1) % 12 === 0 ? `Yr ${Math.floor((index + 1) / 12)}` : "";
                    }}/>
                  <YAxis type="number" domain={['dataMin', 'auto']} tickFormatter={(value) => `$${value}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="principal" fill="var(--color-principal)" stackId="a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="interest" fill="var(--color-interest)" stackId="a" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
           </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

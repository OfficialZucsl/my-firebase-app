
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
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { submitLoanRequest } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ScrollArea } from './ui/scroll-area';
import { useLoanStore } from '@/hooks/use-loan-store';
import { Textarea } from './ui/textarea';
import { useAuth } from '@/hooks/use-auth';


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

// Function to calculate interest rate based on duration in weeks
const calculateInterestRate = (durationInWeeks: number) => {
  if (durationInWeeks === 1) return 0.15;
  if (durationInWeeks === 2) return 0.20;
  if (durationInWeeks === 3) return 0.25;
  if (durationInWeeks >= 4) {
    // For 4 weeks, it's 0.30. For longer durations, we apply compound interest.
    const baseRate = 0.30;
    const periods = Math.ceil(durationInWeeks / 4);
    return Math.pow(1 + baseRate, periods) - 1;
  }
  return 0.15; // Default for less than 1 week (should not happen with slider min)
};


export function RequestLoanDialog({ children }: { children: React.ReactNode }) {
  const [amount, setAmount] = useState(5000);
  const [durationInWeeks, setDurationInWeeks] = useState(4);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const addLoan = useLoanStore(state => state.addLoan);
  const { user } = useAuth();

  const interestRate = calculateInterestRate(durationInWeeks);
  const totalInterest = amount * interestRate;
  const totalRepayment = amount + totalInterest;
  const weeklyPayment = totalRepayment / durationInWeeks;

  const amortizationData = Array.from({ length: durationInWeeks }, (_, i) => {
    const week = i + 1;
    
    // Simplified amortization for visualization
    const interestPayment = totalInterest / durationInWeeks;
    const principalPayment = weeklyPayment - interestPayment;

    return {
      week: `W${week}`,
      principal: parseFloat(principalPayment.toFixed(2)),
      interest: parseFloat(interestPayment.toFixed(2)),
    };
  });

  const handleAmountChange = (value: number[]) => {
    setAmount(value[0]);
  };

  const handleDurationChange = (value: number[]) => {
    setDurationInWeeks(value[0]);
  };

  const handleSubmit = async () => {
    if (!user) {
        toast({ title: 'Error', description: 'You must be logged in to request a loan.', variant: 'destructive' });
        return;
    }
    if (!reason) {
        toast({
          title: 'Error',
          description: 'Please provide a reason for the loan.',
          variant: 'destructive',
        });
        return;
    }
    setLoading(true);
    try {
      const result = await submitLoanRequest({ userId: user.uid, amount, durationInWeeks, reason, weeklyPayment, interestRate });
      if (result.success) {
        addLoan(result.newLoan);
        toast({
          title: 'Success!',
          description: result.message,
        });
        setOpen(false);
        setReason(''); // Reset reason
      } else {
         toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
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
        <ScrollArea className="h-[60vh] pr-6">
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="amount">Amount</Label>
                <span className="font-semibold">
                  ZMW {amount.toLocaleString()}
                </span>
              </div>
              <Slider
                id="amount"
                min={200}
                max={50000}
                step={100}
                value={[amount]}
                onValue-change={handleAmountChange}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="duration">Duration (Weeks)</Label>
                <span className="font-semibold">{durationInWeeks}</span>
              </div>
              <Slider
                id="duration"
                min={1}
                max={16}
                step={1}
                value={[durationInWeeks]}
                onValue-change={handleDurationChange}
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="reason">Reason for Loan</Label>
                <Textarea
                    id="reason"
                    placeholder="e.g., School fees, business expansion, emergency medical expenses..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[100px]"
                />
            </div>
            <div className="mt-4 rounded-lg border bg-muted p-4 space-y-2">
              <h4 className="font-semibold text-sm">Loan Estimate</h4>
              <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weekly Payment</span>
                  <span>ZMW {weeklyPayment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Repayment</span>
                  <span>ZMW {totalRepayment.toFixed(2)}</span>
              </div>
               <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Interest Rate</span>
                  <span>{(interestRate * 100).toFixed(2)}%</span>
              </div>
               <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Interest</span>
                  <span>ZMW {totalInterest.toFixed(2)}</span>
              </div>
            </div>
             <div className="mt-4 rounded-lg border bg-muted p-4">
               <h4 className="font-semibold text-sm mb-2">Repayment Schedule</h4>
               <div className="h-[200px] w-full">
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                  <BarChart accessibilityLayer data={amortizationData} stackOffset="sign" margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis type="number" domain={['auto', 'auto']} tickFormatter={(value) => `ZMW ${value}`} />
                    <ChartTooltip content={<ChartTooltipContent formatter={(value) => `ZMW ${value}`}/>} />
                    <Bar dataKey="principal" fill="var(--color-principal)" stackId="a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="interest" fill="var(--color-interest)" stackId="a" radius={[0, 0, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
             </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Finalize Loan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

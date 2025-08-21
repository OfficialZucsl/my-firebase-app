
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

const INTEREST_RATE = 0.055; // 5.5% annual interest rate

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
      <DialogContent className="sm:max-w-[425px]">
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

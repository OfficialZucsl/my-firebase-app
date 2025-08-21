'use client';

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
import type { Loan } from '@/lib/types';
import { CreditCard, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PaymentDialog({ loan, children }: { loan: Loan, children: React.ReactNode }) {
  const { toast } = useToast();

  const handlePayment = () => {
    toast({
      title: "Payment Successful!",
      description: `Your payment of $${loan.nextPaymentAmount.toFixed(2)} for loan #${loan.id} has been processed.`,
    })
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make a Payment</DialogTitle>
          <DialogDescription>
            Enter your payment details for loan #{loan.id}. The next payment amount is ${loan.nextPaymentAmount.toFixed(2)}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="card-name" className="text-right">
              Name
            </Label>
            <Input id="card-name" defaultValue="John Doe" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="card-number" className="text-right">
              Card
            </Label>
            <div className="relative col-span-3">
              <Input id="card-number" defaultValue="4242 4242 4242 4242" />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="expiry" className="text-right">Expiry</Label>
                <Input id="expiry" defaultValue="12/26" />
             </div>
             <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="cvc" className="text-right">CVC</Label>
                <Input id="cvc" defaultValue="123" />
             </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handlePayment}>
            <DollarSign className="mr-2" />
            Pay ${loan.nextPaymentAmount.toFixed(2)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import { Label } from '@/components/ui/label';
import type { Loan } from '@/lib/types';
import { Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function PaymentDialog({ loan, children }: { loan: Loan, children: React.ReactNode }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handlePayment = () => {
    toast({
      title: "Payment Initiated!",
      description: `Your payment of ZMW ${loan.nextPaymentAmount.toFixed(2)} for loan #${loan.id} has been processed.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make a Payment</DialogTitle>
          <DialogDescription>
            Please send your payment to the mobile money number below. Your next payment is ZMW {loan.nextPaymentAmount.toFixed(2)}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Recipient Name</Label>
            <p className="font-semibold">FiduciaLend Zambia</p>
          </div>
          <div className="space-y-2">
            <Label>Mobile Money Number</Label>
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground" />
              <p className="font-semibold">0977402171</p>
            </div>
          </div>
           <p className="text-sm text-muted-foreground">
              After sending the payment, please allow up to 24 hours for it to reflect on your account.
           </p>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handlePayment}>
            Confirm Payment Sent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

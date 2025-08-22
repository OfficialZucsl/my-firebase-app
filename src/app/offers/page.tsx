
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import SidebarNav from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getOffers } from '../actions';
import { RequestLoanDialog } from '@/components/request-loan-dialog';
import type { Offer } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const fetchedOffers = await getOffers();
        setOffers(fetchedOffers);
      } catch (error) {
        console.error("Failed to fetch offers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-background p-4 md:p-6 lg:p-8">
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold">Special Offers</h1>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <p className="text-muted-foreground col-span-full">Loading offers...</p>
                ) : offers.length > 0 ? (
                  offers.map((offer) => (
                    <Card key={offer.id}>
                        <CardHeader>
                            <CardTitle>{offer.title}</CardTitle>
                            <CardDescription>{offer.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="font-semibold text-primary">{offer.discount}</div>
                        </CardContent>
                        <CardFooter>
                            <RequestLoanDialog>
                              <Button>Claim Offer</Button>
                            </RequestLoanDialog>
                        </CardFooter>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-full">No active offers found. Add some in the Firestore 'offers' collection to see them here.</p>
                )}
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

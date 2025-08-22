
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

export default async function OffersPage() {
  const offers = await getOffers();

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
                {offers.length > 0 ? (
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
                            <Button>Claim Offer</Button>
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

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import SidebarNav from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mockOffers = [
    {
        title: "Holiday Loan Special",
        description: "Get a 10% discount on interest for any loan taken this month. Perfect for your holiday shopping!",
        discount: "10% Off Interest"
    },
    {
        title: "Loyalty Bonus",
        description: "As a thank you for your on-time payments, get pre-approved for a loan up to ZMW 25,000.",
        discount: "Pre-approved up to ZMW 25,000"
    },
    {
        title: "Refer a Friend",
        description: "Refer a friend to FiduciaLend and get ZMW 100 off your next payment when they get their first loan.",
        discount: "ZMW 100 Off"
    }
]

export default function OffersPage() {
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
                {mockOffers.map((offer, index) => (
                    <Card key={index}>
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
                ))}
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

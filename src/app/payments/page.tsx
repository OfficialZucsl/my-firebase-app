import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import SidebarNav from '@/components/sidebar-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


const mockPayments = [
    {id: 'PAY-001', loanId: 'LN75643', amount: 650.50, date: '2024-07-15', status: 'successful'},
    {id: 'PAY-002', loanId: 'LN62841', amount: 1005.80, date: '2024-07-20', status: 'successful'},
    {id: 'PAY-003', loanId: 'LN98123', amount: 550.60, date: '2024-07-09', status: 'failed'},
    {id: 'PAY-004', loanId: 'LN45239', amount: 250.00, date: '2024-06-30', status: 'successful'},
]

export default function PaymentsPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-background p-4 md:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                   <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Loan ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockPayments.map(payment => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">{payment.id}</TableCell>
                                    <TableCell>{payment.loanId}</TableCell>
                                    <TableCell>{payment.date}</TableCell>
                                    <TableCell className="text-right">ZMW {payment.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={cn({
                                            'bg-green-100 text-green-800': payment.status === 'successful',
                                            'bg-red-100 text-red-800': payment.status === 'failed',
                                            })}
                                        >
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                   </Table>
                </CardContent>
            </Card>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import SidebarNav from '@/components/sidebar-nav';
import { diagnoseFirebaseSetup } from '@/lib/firebase-diagnostic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default async function TestFirebasePage() {
  const diagnosticResult = await diagnoseFirebaseSetup();
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-background p-4 md:p-6 lg:p-8">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Firebase Admin SDK Diagnostic</CardTitle>
                <CardDescription>
                  This page tests the server-side initialization of the Firebase Admin SDK.
                  Check your server console for more detailed logs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Alert variant={diagnosticResult.success ? 'default' : 'destructive'}>
                  {diagnosticResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertTitle>{diagnosticResult.success ? 'Success!' : 'Failed!'}</AlertTitle>
                  <AlertDescription>
                    {diagnosticResult.success 
                      ? "The Firebase Admin SDK was initialized successfully on the server."
                      : `The Firebase Admin SDK failed to initialize. Error: ${diagnosticResult.error}`
                    }
                  </AlertDescription>
                </Alert>
                
                <h3 className="font-semibold">Diagnostic Details:</h3>
                <div className="bg-muted p-4 rounded-md text-sm font-mono overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(diagnosticResult.details, null, 2)}
                  </pre>
                </div>
                
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

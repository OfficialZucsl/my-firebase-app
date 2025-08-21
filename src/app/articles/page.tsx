import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import SidebarNav from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const mockArticles = [
    {
        id: "1",
        title: "Understanding Compound Interest",
        author: "Jane Doe",
        createdAt: "2024-08-20",
        imageUrl: "https://placehold.co/600x400.png",
        dataAiHint: "finance graph",
        excerpt: "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it. Learn how to make it work for you."
    },
    {
        id: "2",
        title: "Budgeting 101: A Beginner's Guide",
        author: "John Smith",
        createdAt: "2024-08-18",
        imageUrl: "https://placehold.co/600x400.png",
        dataAiHint: "piggy bank",
        excerpt: "Creating a budget is the first step towards financial freedom. This guide will walk you through the basics of setting up a personal budget that works."
    },
    {
        id: "3",
        title: "How to Improve Your Credit Score",
        author: "Emily White",
        createdAt: "2024-08-15",
        imageUrl: "https://placehold.co/600x400.png",
        dataAiHint: "credit score",
        excerpt: "Your credit score is a crucial factor in your financial life. Discover actionable steps you can take to improve your score and unlock better financial products."
    }
];

export default function ArticlesPage() {
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
                <h1 className="text-2xl font-semibold">Personal Finance Articles</h1>
                <p className="text-muted-foreground">
                    Expand your financial knowledge with our curated articles.
                </p>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockArticles.map((article) => (
                    <Card key={article.id} className="flex flex-col">
                        <CardHeader className="p-0">
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                width={600}
                                height={400}
                                className="rounded-t-lg object-cover"
                                data-ai-hint={article.dataAiHint}
                            />
                        </CardHeader>
                        <CardContent className="flex-1 p-6 space-y-2">
                            <CardTitle>{article.title}</CardTitle>
                            <CardDescription>{article.excerpt}</CardDescription>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center p-6 pt-0">
                            <div className="text-xs text-muted-foreground">
                                By {article.author} on {article.createdAt}
                            </div>
                            <Button variant="outline" size="sm">Read More</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

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
import { getArticles } from '../actions';

export default async function ArticlesPage() {
  const articles = await getArticles();

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
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <Card key={article.id} className="flex flex-col">
                            <CardHeader className="p-0">
                                <Image
                                    src={article.imageUrl}
                                    alt={article.title}
                                    width={600}
                                    height={400}
                                    className="rounded-t-lg object-cover aspect-[3/2]"
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
                    ))
                ) : (
                    <p className="text-muted-foreground col-span-full">No articles found. Add some in the Firestore 'articles' collection to see them here.</p>
                )}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

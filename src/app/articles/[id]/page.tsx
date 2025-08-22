import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import SidebarNav from '@/components/sidebar-nav';
import { getArticleById } from '../../actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ArticlePageProps = {
  params: {
    id: string;
  };
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleById(params.id);

  if (!article) {
    notFound();
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-background">
            <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
                <article className="prose prose-stone mx-auto max-w-3xl dark:prose-invert">
                     {article.imageUrl && (
                        <Image
                        src={article.imageUrl}
                        alt={article.title}
                        width={1200}
                        height={600}
                        className="rounded-lg object-cover aspect-video mb-8"
                        data-ai-hint={article.dataAiHint}
                        />
                    )}
                    <div className="space-y-2 not-prose">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                            {article.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <User className="size-4" />
                                <span>{article.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="size-4" />
                                <span>{article.createdAt}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                       <p className="lead text-xl text-muted-foreground">{article.excerpt}</p>
                       <div className="mt-8 whitespace-pre-wrap">{article.content}</div>
                    </div>
                </article>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

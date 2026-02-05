import { FileText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetArticlesByCategory } from '../hooks/useQueries';

export default function ArticlesPage() {
  const categories = ['Personal Finance', 'Investment Awareness', 'Economic Environment', 'Case Studies'];
  
  return (
    <div className="w-full">
      <div className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container py-16 md:py-24">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <FileText className="h-4 w-4" />
              Educational Content
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Financial Articles
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore beginner-to-intermediate level articles on personal finance, investments, and economic trends.
            </p>
          </div>

          <Tabs defaultValue={categories[0]} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <ArticlesList category={category} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ArticlesList({ category }: { category: string }) {
  const { data: articles = [], isLoading } = useGetArticlesByCategory(category);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Articles Yet</CardTitle>
          <CardDescription>
            Articles for {category} are coming soon. Check back later!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {articles.map((article) => (
        <Card key={Number(article.id)} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{article.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base leading-relaxed">
              {article.content.substring(0, 200)}
              {article.content.length > 200 ? '...' : ''}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

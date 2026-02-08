import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Calendar, User, Tag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetBlog } from '../hooks/useQueries';

export default function BlogDetailPage() {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  
  // Parse the blog ID from params
  const blogIdStr = params.id as string;
  const blogId = blogIdStr ? Number(blogIdStr) : 0;

  const { data: blog, isLoading, error } = useGetBlog(blogId);

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="text-muted-foreground">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container py-12">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/blogs' })}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blogs
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error ? 'Failed to load blog post.' : 'Blog post not found.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container py-12">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/blogs' })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blogs
      </Button>

      <article className="mx-auto max-w-4xl">
        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(blog.publishedAt)}</span>
            </div>
            {blog.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{blog.author}</span>
              </div>
            )}
            {blog.category && (
              <Badge variant="secondary">{blog.category}</Badge>
            )}
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-5xl">
            {blog.title}
          </h1>

          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <Card>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none pt-6">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {blog.content}
            </div>
          </CardContent>
        </Card>

        {blog.lastUpdatedAt !== blog.publishedAt && (
          <div className="mt-6 text-sm text-muted-foreground">
            Last updated: {formatDate(blog.lastUpdatedAt)}
          </div>
        )}
      </article>
    </div>
  );
}

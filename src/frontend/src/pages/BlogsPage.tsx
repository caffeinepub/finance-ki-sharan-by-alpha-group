import { BookOpen, Calendar, Tag, AlertCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetBlogs } from '../hooks/useQueries';

export default function BlogsPage() {
  const navigate = useNavigate();
  const { data: blogs, isLoading, error } = useGetBlogs();

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="text-muted-foreground">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load blogs. Please try again later.
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
      <div className="mb-12 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Finance Blogs</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Insights, updates, and educational content to help you navigate the world of finance
        </p>
      </div>

      {!blogs || blogs.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No blogs yet</h3>
          <p className="text-muted-foreground">Check back soon for new content!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Card 
              key={Number(blog.id)} 
              className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
              onClick={() => navigate({ to: `/blogs/${blog.id}` })}
            >
              <CardHeader>
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {blog.content.substring(0, 150)}...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {blog.category && (
                    <Badge variant="secondary">
                      {blog.category}
                    </Badge>
                  )}
                  {blog.tags.slice(0, 2).map((tag, idx) => (
                    <Badge key={idx} variant="outline">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                  {blog.tags.length > 2 && (
                    <Badge variant="outline">
                      +{blog.tags.length - 2} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

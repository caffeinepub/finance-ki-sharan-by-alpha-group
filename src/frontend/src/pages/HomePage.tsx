import { ArrowRight, BookOpen, FileText, GraduationCap, Shield, TrendingUp } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="container relative py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary w-fit">
                <GraduationCap className="h-4 w-4" />
                Financial Education Platform
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Simplifying Finance for{' '}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Everyone
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground md:text-xl">
                Your comprehensive resource for understanding financial concepts, from basic terminology 
                to advanced research. We make financial literacy accessible through clear explanations 
                and practical examples.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={() => navigate({ to: '/learning' })} className="gap-2">
                  Learn Finance
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/glossary' })} className="gap-2">
                  Explore Terminology
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/research' })} className="gap-2">
                  Read Research Papers
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl blur-3xl" />
              <img
                src="/assets/generated/hero-finance-learning.dim_800x400.png"
                alt="Financial Learning"
                className="relative rounded-2xl shadow-2xl border border-border/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-16 md:py-24">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Comprehensive Financial Education
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access a wide range of educational resources designed to help you understand finance better.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/learning' })}>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Step-by-Step Learning</CardTitle>
              <CardDescription>
                Master financial concepts through structured lessons covering basics to advanced topics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/glossary' })}>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Interactive Glossary</CardTitle>
              <CardDescription>
                Search and explore financial terms with definitions, examples, and practical usage.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/articles' })}>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Educational Articles</CardTitle>
              <CardDescription>
                Read beginner-friendly articles on personal finance, investments, and economic trends.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/research' })}>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Research Papers</CardTitle>
              <CardDescription>
                Access in-depth research reports and studies from RBI, SEBI, and economic analysts.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/regulations' })}>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Regulations & Awareness</CardTitle>
              <CardDescription>
                Stay informed about SEBI & RBI guidelines, investor protection, and fraud awareness.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/about' })}>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Education First</CardTitle>
              <CardDescription>
                Learn about our mission to make financial education accessible to everyone.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Start Your Financial Journey?
            </h2>
            <p className="text-lg text-muted-foreground">
              Begin with our comprehensive learning resources and build your financial knowledge step by step.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row justify-center">
              <Button size="lg" onClick={() => navigate({ to: '/learning' })} className="gap-2">
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ to: '/glossary' })}>
                Browse Glossary
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

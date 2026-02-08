import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calculator, TrendingUp, Shield, Users, Lightbulb, FileText, GraduationCap, BarChart3 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
                Finance Ki Sharan
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-2xl">
                Your trusted companion for financial education and awareness. Learn, calculate, and make informed financial decisions with confidence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/learning' })}
                  className="font-semibold"
                >
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Start Learning
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ to: '/calculators' })}
                  className="font-semibold"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  Explore Calculators
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate({ to: '/glossary' })}
                  className="font-semibold"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Glossary
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/hero-finance-learning.dim_800x400.png"
                alt="Finance Education"
                width={800}
                height={400}
                className="rounded-lg shadow-2xl border border-border/40"
                loading="eager"
                decoding="async"
                style={{ aspectRatio: '2/1' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
              Why Finance Ki Sharan?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We believe financial literacy is the foundation of financial freedom. Our platform provides comprehensive resources to help you understand and navigate the world of finance.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border/40">
              <CardHeader>
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Educational Content</CardTitle>
                <CardDescription>
                  Comprehensive glossary, articles, and learning modules covering all aspects of personal finance and investing.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Financial Calculators</CardTitle>
                <CardDescription>
                  22+ calculators for SIP, EMI, PPF, tax planning, and more to help you plan your financial journey.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Regulatory Awareness</CardTitle>
                <CardDescription>
                  Stay informed about SEBI and RBI guidelines, fraud awareness, and investor protection measures.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
              Comprehensive Financial Resources
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to build your financial knowledge and make informed decisions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border/40 hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Financial Glossary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Searchable database of financial terms with clear definitions and examples.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/glossary' })}
                  className="w-full"
                >
                  Explore Glossary
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/40 hover:shadow-lg transition-shadow">
              <CardHeader>
                <GraduationCap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Learning Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Structured lessons on investing, budgeting, taxation, and financial planning.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/learning' })}
                  className="w-full"
                >
                  Start Learning
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/40 hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Articles & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Expert articles on personal finance, investment strategies, and economic trends.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/articles' })}
                  className="w-full"
                >
                  Read Articles
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/40 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calculator className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Financial Calculators</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  22+ calculators for investments, loans, taxes, and retirement planning.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/calculators' })}
                  className="w-full"
                >
                  Use Calculators
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/40 hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Research Papers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  In-depth research and analysis on financial markets and investment strategies.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/research' })}
                  className="w-full"
                >
                  View Research
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/40 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Regulations & Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  SEBI/RBI guidelines, fraud awareness, and investor protection information.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/regulations' })}
                  className="w-full"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section id="latest" className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
              Stay Updated
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore our latest blogs, articles, and educational content.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border/40">
              <CardHeader>
                <Lightbulb className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Latest Blogs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Read our latest thoughts on financial trends and personal finance tips.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/blogs' })}
                  className="w-full"
                >
                  View Blogs
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Market Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Live NIFTY 50 ticker and market analysis to stay informed.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                  className="w-full"
                >
                  View Ticker
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>About Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Learn about our mission to democratize financial education.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/about' })}
                  className="w-full"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
              Start Your Financial Journey Today
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of learners building their financial knowledge and making smarter money decisions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate({ to: '/learning' })}
                className="font-semibold"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/contact' })}
                className="font-semibold"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Target, Eye, Heart, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="w-full">
      <div className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container py-16 md:py-24">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              About Finance Ki Sharan
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              By Alpha Group - Your trusted partner in financial education
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  At Finance Ki Sharan, our mission is to democratize financial education and make it accessible to everyone, 
                  regardless of their background or experience level. We believe that financial literacy is a fundamental right 
                  and a key to economic empowerment. Through clear, simple explanations and comprehensive resources, we aim to 
                  break down complex financial concepts into understandable knowledge that anyone can apply in their daily lives.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  We envision a future where every individual has the knowledge and confidence to make informed financial decisions. 
                  Our goal is to create a financially literate society where people understand the importance of saving, investing, 
                  and managing their money wisely. We strive to be the go-to resource for financial education in India, helping 
                  millions of people achieve their financial goals and secure their future.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Education-First Philosophy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Our education-first approach means we prioritize learning over selling. We don't provide investment advice or 
                  promote specific financial products. Instead, we focus on empowering you with knowledge so you can make your 
                  own informed decisions. We present information in simple, jargon-free language, use real-world examples, and 
                  provide practical insights that you can immediately apply. Our content is carefully curated to ensure accuracy, 
                  relevance, and accessibility for learners at all levels.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">About Alpha Group</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Alpha Group is committed to creating educational platforms that make complex subjects accessible to everyone. 
                  With Finance Ki Sharan, we bring together financial experts, educators, and content creators to deliver 
                  high-quality educational resources. Our team is passionate about financial literacy and dedicated to helping 
                  individuals build a strong foundation in financial knowledge. We continuously update our content to reflect 
                  the latest developments in the financial world and regulatory changes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Live Market Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  We integrated a live market ticker to visually show NIFTY 50 stock price movements. This feature helps learners 
                  connect theoretical knowledge with real-time market dynamics, providing a practical view of how financial markets 
                  operate. The ticker is available on every page, allowing you to stay informed about market trends while exploring 
                  our educational content.
                </CardDescription>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                We are committed to maintaining the highest standards of educational content, ensuring accuracy, 
                clarity, and relevance. We regularly update our resources to keep pace with changing regulations 
                and market conditions. Your financial education journey is our priority, and we're here to support 
                you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

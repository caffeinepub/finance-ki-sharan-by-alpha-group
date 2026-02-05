import { AlertTriangle, Info, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DisclaimerPage() {
  return (
    <div className="w-full">
      <div className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container py-16 md:py-24">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              Legal Information
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Disclaimer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Important information about our educational services
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertTitle className="text-destructive font-semibold text-lg">
                Investment Risk Warning
              </AlertTitle>
              <AlertDescription className="text-destructive/90 text-base mt-2">
                Investments in securities market are subject to market risks. Read all the related documents 
                carefully before investing. Past performance is not indicative of future returns. Please consider 
                your specific investment requirements, risk tolerance, goal, time frame, risk and reward balance 
                and the cost associated with the investment before choosing a fund, or designing a portfolio that 
                suits your needs.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Educational Purpose Only</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">
                  Finance Ki Sharan is an educational platform designed to provide general information about 
                  financial concepts, terminology, and market regulations. All content on this website is for 
                  educational and informational purposes only.
                </CardDescription>
                <CardDescription className="text-base leading-relaxed">
                  <strong>We do not provide:</strong>
                </CardDescription>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Investment advice or recommendations</li>
                  <li>Financial planning services</li>
                  <li>Tax advice or guidance</li>
                  <li>Legal advice</li>
                  <li>Personalized financial consultation</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">No Investment Advice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">
                  The information provided on this website should not be construed as investment advice, 
                  financial advice, trading advice, or any other sort of advice. We do not recommend or 
                  endorse any specific investment, security, portfolio, transaction, or investment strategy.
                </CardDescription>
                <CardDescription className="text-base leading-relaxed">
                  You should not make any investment decision based solely on the information provided on 
                  this website. Always conduct your own research, consult with qualified financial advisors, 
                  and consider your personal financial situation before making any investment decisions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Accuracy of Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">
                  While we strive to provide accurate and up-to-date information, we make no representations 
                  or warranties of any kind, express or implied, about the completeness, accuracy, reliability, 
                  suitability, or availability of the information, products, services, or related graphics 
                  contained on the website.
                </CardDescription>
                <CardDescription className="text-base leading-relaxed">
                  Financial markets and regulations are subject to change. Information that was accurate at 
                  the time of publication may become outdated. We recommend verifying all information with 
                  official sources and regulatory bodies.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">
                  Finance Ki Sharan and Alpha Group shall not be liable for any loss or damage, including 
                  without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever 
                  arising from loss of data or profits arising out of, or in connection with, the use of this website.
                </CardDescription>
                <CardDescription className="text-base leading-relaxed">
                  Any reliance you place on the information provided on this website is strictly at your own risk. 
                  We will not be liable for any losses or damages in connection with the use of our website.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">External Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">
                  This website may contain links to external websites that are not provided or maintained by 
                  Finance Ki Sharan. We do not guarantee the accuracy, relevance, timeliness, or completeness 
                  of any information on these external websites.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Regulatory Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">
                  Finance Ki Sharan is not a SEBI registered investment advisor, broker, or financial planner. 
                  We do not offer any services that require SEBI registration. Our platform is purely educational 
                  and does not facilitate any financial transactions.
                </CardDescription>
                <CardDescription className="text-base leading-relaxed">
                  For investment advice and financial services, please consult with SEBI registered advisors 
                  and intermediaries. Always verify the registration status of financial service providers on 
                  the official SEBI website.
                </CardDescription>
              </CardContent>
            </Card>

            <Alert className="border-primary/50 bg-primary/10">
              <Info className="h-5 w-5 text-primary" />
              <AlertTitle className="text-primary font-semibold">Contact Us</AlertTitle>
              <AlertDescription className="text-primary/90">
                If you have any questions about this disclaimer or our educational content, please contact us 
                through our contact page.
              </AlertDescription>
            </Alert>

            <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border/40">
              <p>Last Updated: January 28, 2026</p>
              <p className="mt-2">© 2025 Finance Ki Sharan by Alpha Group. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

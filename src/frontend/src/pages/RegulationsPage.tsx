import { Shield, AlertTriangle, FileText, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RegulationsPage() {
  return (
    <div className="w-full">
      <div className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container py-16 md:py-24">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              Investor Protection
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Regulations & Awareness
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay informed about SEBI & RBI guidelines, investor protection, and fraud awareness.
            </p>
          </div>

          <Alert className="max-w-4xl mx-auto mb-12 border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertTitle className="text-destructive font-semibold">SEBI Disclaimer</AlertTitle>
            <AlertDescription className="text-destructive/90">
              Investments in securities market are subject to market risks. Read all the related documents carefully before investing. 
              Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="sebi" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="sebi">SEBI Guidelines</TabsTrigger>
              <TabsTrigger value="rbi">RBI Guidelines</TabsTrigger>
              <TabsTrigger value="fraud">Fraud Awareness</TabsTrigger>
            </TabsList>

            <TabsContent value="sebi" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>SEBI - Securities and Exchange Board of India</CardTitle>
                  <CardDescription>
                    SEBI is the regulatory body for securities markets in India, protecting investor interests and promoting market development.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Key Investor Guidelines</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Always invest through SEBI registered intermediaries</li>
                      <li>Verify registration details on SEBI website before investing</li>
                      <li>Read offer documents and risk disclosures carefully</li>
                      <li>Keep records of all investment transactions</li>
                      <li>Report suspicious activities to SEBI</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Investor Protection Measures</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>SEBI Investor Protection and Education Fund (IPEF)</li>
                      <li>Online complaint redressal system (SCORES)</li>
                      <li>Investor awareness programs and workshops</li>
                      <li>Strict regulations for market intermediaries</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rbi" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>RBI - Reserve Bank of India</CardTitle>
                  <CardDescription>
                    RBI is India's central bank, regulating banking operations and monetary policy.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Banking Guidelines</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Know Your Customer (KYC) norms for all banking transactions</li>
                      <li>Deposit insurance coverage up to ₹5 lakh per depositor</li>
                      <li>Guidelines on fair practices in lending</li>
                      <li>Customer grievance redressal mechanisms</li>
                      <li>Digital banking security guidelines</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Consumer Protection</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Banking Ombudsman Scheme for complaint resolution</li>
                      <li>Guidelines on charges and fees transparency</li>
                      <li>Protection against unauthorized transactions</li>
                      <li>Rights and responsibilities of bank customers</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fraud" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <CardTitle>Fraud Awareness & Prevention</CardTitle>
                  <CardDescription>
                    Protect yourself from financial fraud by staying informed and vigilant.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-destructive">Common Financial Frauds</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Phishing emails and fake investment schemes</li>
                      <li>Ponzi schemes promising unrealistic returns</li>
                      <li>Unauthorized trading and churning</li>
                      <li>Identity theft and account takeover</li>
                      <li>Fake loan offers and advance fee fraud</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">How to Protect Yourself</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Never share OTPs, passwords, or PINs with anyone</li>
                      <li>Verify credentials of financial advisors and intermediaries</li>
                      <li>Be skeptical of guaranteed high returns</li>
                      <li>Use secure internet connections for financial transactions</li>
                      <li>Regularly monitor your account statements</li>
                      <li>Report suspicious activities immediately</li>
                    </ul>
                  </div>
                  <Alert className="border-primary/50 bg-primary/10">
                    <Info className="h-5 w-5 text-primary" />
                    <AlertTitle className="text-primary">Report Fraud</AlertTitle>
                    <AlertDescription>
                      If you suspect fraud, report immediately to SEBI (complaints@sebi.gov.in), RBI, or local cybercrime authorities.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

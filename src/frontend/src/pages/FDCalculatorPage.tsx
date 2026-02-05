import { useState } from 'react';
import { Building2, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FDCalculatorPage() {
  const navigate = useNavigate();
  const [principal, setPrincipal] = useState<string>('100000');
  const [interestRate, setInterestRate] = useState<string>('6.5');
  const [tenure, setTenure] = useState<string>('5');
  const [interestType, setInterestType] = useState<'simple' | 'compound'>('compound');

  const calculateFD = () => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(interestRate) || 0;
    const t = parseFloat(tenure) || 0;

    if (p <= 0 || r <= 0 || t <= 0) {
      return { maturityAmount: 0, interestEarned: 0 };
    }

    let maturityAmount = 0;

    if (interestType === 'simple') {
      const interest = (p * r * t) / 100;
      maturityAmount = p + interest;
    } else {
      // Compound interest (quarterly compounding)
      const n = 4; // quarterly
      maturityAmount = p * Math.pow(1 + r / (n * 100), n * t);
    }

    const interestEarned = maturityAmount - p;

    return {
      maturityAmount: Math.round(maturityAmount),
      interestEarned: Math.round(interestEarned),
    };
  };

  const results = calculateFD();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/calculators' })}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Calculators
        </Button>

        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Building2 className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">FD Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate returns on your Fixed Deposit with simple or compound interest options.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate Your FD Returns</CardTitle>
            <CardDescription>
              Enter your principal amount, interest rate, and tenure to see projected returns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="principal">Principal Amount (₹)</Label>
                <Input
                  id="principal"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="100000"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest-rate">Interest Rate (% per annum)</Label>
                <Input
                  id="interest-rate"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="6.5"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenure">Tenure (Years)</Label>
                <Input
                  id="tenure"
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  placeholder="5"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label>Interest Type</Label>
                <Tabs value={interestType} onValueChange={(v) => setInterestType(v as 'simple' | 'compound')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="simple">Simple Interest</TabsTrigger>
                    <TabsTrigger value="compound">Compound Interest</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Estimated Returns</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Principal Amount:</span>
                  <span className="font-semibold text-lg">{formatCurrency(parseFloat(principal) || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Interest Earned:</span>
                  <span className="font-semibold text-lg text-primary">{formatCurrency(results.interestEarned)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Maturity Amount:</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(results.maturityAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About Fixed Deposit (FD)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Fixed Deposit is a safe investment option offered by banks and financial institutions. Key features include:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Guaranteed returns with fixed interest rate</li>
              <li>Flexible tenure from 7 days to 10 years</li>
              <li>Premature withdrawal allowed with penalty</li>
              <li>Loan facility available against FD</li>
              <li>Senior citizens get higher interest rates</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              <strong>Simple Interest:</strong> Interest calculated only on principal amount.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Compound Interest:</strong> Interest calculated on principal plus accumulated interest (typically quarterly compounding).
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute financial advice. Interest rates vary by bank and are subject to change.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Landmark, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function NSCCalculatorPage() {
  const navigate = useNavigate();
  const [investment, setInvestment] = useState<string>('100000');
  const [interestRate, setInterestRate] = useState<string>('7.7');
  const [duration, setDuration] = useState<string>('5');

  const calculateNSC = () => {
    const principal = parseFloat(investment) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseFloat(duration) || 0;

    if (principal <= 0 || rate <= 0 || years <= 0) {
      return { interestEarned: 0, maturityValue: 0 };
    }

    const maturityValue = principal * Math.pow(1 + rate / 100, years);
    const interestEarned = maturityValue - principal;

    return {
      interestEarned: Math.round(interestEarned),
      maturityValue: Math.round(maturityValue),
    };
  };

  const results = calculateNSC();

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
            <Landmark className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">NSC Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate returns on National Savings Certificate with fixed interest and tax benefits.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate Your NSC Returns</CardTitle>
            <CardDescription>
              Enter your investment amount, interest rate, and duration to see projected returns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="investment">Investment Amount (₹)</Label>
                <Input
                  id="investment"
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
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
                  placeholder="7.7"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Years)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="5"
                  min="0"
                />
                <p className="text-xs text-muted-foreground">Standard NSC tenure is 5 years</p>
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Estimated Returns</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Investment Amount:</span>
                  <span className="font-semibold text-lg">{formatCurrency(parseFloat(investment) || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Interest Earned:</span>
                  <span className="font-semibold text-lg text-primary">{formatCurrency(results.interestEarned)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Maturity Value:</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(results.maturityValue)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About National Savings Certificate (NSC)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              NSC is a fixed-income investment scheme offered by Indian Post Offices. Key features:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Fixed tenure of 5 years</li>
              <li>Guaranteed returns backed by Government of India</li>
              <li>Tax benefits under Section 80C (up to ₹1.5 lakh)</li>
              <li>Interest is compounded annually but paid at maturity</li>
              <li>Minimum investment of ₹1,000 with no maximum limit</li>
              <li>Can be used as collateral for loans</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Interest rates are set by the government and revised quarterly.
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute financial advice. Interest rates are subject to change by the government.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

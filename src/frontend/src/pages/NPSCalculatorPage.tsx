import { useState } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function NPSCalculatorPage() {
  const navigate = useNavigate();
  const [monthlyContribution, setMonthlyContribution] = useState<string>('5000');
  const [currentAge, setCurrentAge] = useState<string>('30');
  const [retirementAge, setRetirementAge] = useState<string>('60');
  const [expectedReturn, setExpectedReturn] = useState<string>('10');

  const calculateNPS = () => {
    const monthly = parseFloat(monthlyContribution) || 0;
    const age = parseFloat(currentAge) || 0;
    const retirement = parseFloat(retirementAge) || 0;
    const rate = parseFloat(expectedReturn) || 0;

    if (monthly <= 0 || age <= 0 || retirement <= age || rate <= 0) {
      return { totalCorpus: 0, annuityAmount: 0, monthlyPension: 0 };
    }

    const years = retirement - age;
    const months = years * 12;
    const monthlyRate = rate / 12 / 100;

    // Future value of monthly contributions
    const totalCorpus = monthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

    // 40% must be used to purchase annuity
    const annuityAmount = totalCorpus * 0.4;

    // Assuming 6% annuity rate for monthly pension
    const monthlyPension = (annuityAmount * 0.06) / 12;

    return {
      totalCorpus: Math.round(totalCorpus),
      annuityAmount: Math.round(annuityAmount),
      monthlyPension: Math.round(monthlyPension),
    };
  };

  const results = calculateNPS();

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
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">NPS Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your National Pension System corpus and estimated monthly pension at retirement.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate Your NPS Returns</CardTitle>
            <CardDescription>
              Enter your monthly contribution, age details, and expected return to see projected pension.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthly-contribution">Monthly Contribution (₹)</Label>
                <Input
                  id="monthly-contribution"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="5000"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-age">Current Age</Label>
                <Input
                  id="current-age"
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                  placeholder="30"
                  min="18"
                  max="70"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retirement-age">Retirement Age</Label>
                <Input
                  id="retirement-age"
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(e.target.value)}
                  placeholder="60"
                  min="18"
                  max="75"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
                <Input
                  id="expected-return"
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  placeholder="10"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Estimated Returns</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Corpus at Retirement:</span>
                  <span className="font-semibold text-lg text-primary">{formatCurrency(results.totalCorpus)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Annuity Amount (40%):</span>
                  <span className="font-semibold text-lg">{formatCurrency(results.annuityAmount)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Estimated Monthly Pension:</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(results.monthlyPension)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About National Pension System (NPS)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              NPS is a government-sponsored pension scheme for retirement savings. Key features:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Open to all Indian citizens aged 18-70 years</li>
              <li>Tax benefits under Section 80C (₹1.5 lakh) and 80CCD(1B) (₹50,000)</li>
              <li>At retirement, 60% can be withdrawn tax-free</li>
              <li>40% must be used to purchase annuity for monthly pension</li>
              <li>Choice of investment options: Equity, Corporate bonds, Government securities</li>
              <li>Low cost with professional fund management</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              This calculator assumes 6% annuity rate for pension estimation. Actual pension depends on annuity rates at retirement.
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute financial advice. Actual returns may vary based on market performance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

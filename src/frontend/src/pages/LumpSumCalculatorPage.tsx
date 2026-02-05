import { useState } from 'react';
import { IndianRupee, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LumpSumCalculatorPage() {
  const navigate = useNavigate();
  const [lumpSum, setLumpSum] = useState<string>('100000');
  const [lumpSumRate, setLumpSumRate] = useState<string>('12');
  const [lumpSumYears, setLumpSumYears] = useState<string>('10');

  const calculateLumpSum = () => {
    const principal = parseFloat(lumpSum) || 0;
    const rate = parseFloat(lumpSumRate) || 0;
    const years = parseFloat(lumpSumYears) || 0;

    if (principal <= 0 || rate <= 0 || years <= 0) {
      return { maturityValue: 0, totalGain: 0 };
    }

    // Compound Interest formula: A = P(1 + r/n)^(nt)
    // Assuming annual compounding (n=1)
    const maturityValue = principal * Math.pow(1 + rate / 100, years);
    const totalGain = maturityValue - principal;

    return {
      maturityValue: Math.round(maturityValue),
      totalGain: Math.round(totalGain),
    };
  };

  const lumpSumResults = calculateLumpSum();

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
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/calculators' })}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Calculators
        </Button>

        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <IndianRupee className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Lump Sum Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate the future value of a one-time investment. See how your lump sum amount can grow over time with compound interest.
          </p>
        </div>

        {/* Calculator Card */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate Your Lump Sum Returns</CardTitle>
            <CardDescription>
              Enter your one-time investment amount, expected annual return rate, and investment duration to see projected returns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lump-sum">Investment Amount (₹)</Label>
                <Input
                  id="lump-sum"
                  type="number"
                  value={lumpSum}
                  onChange={(e) => setLumpSum(e.target.value)}
                  placeholder="100000"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lump-rate">Expected Annual Return (%)</Label>
                <Input
                  id="lump-rate"
                  type="number"
                  value={lumpSumRate}
                  onChange={(e) => setLumpSumRate(e.target.value)}
                  placeholder="12"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lump-years">Investment Duration (Years)</Label>
                <Input
                  id="lump-years"
                  type="number"
                  value={lumpSumYears}
                  onChange={(e) => setLumpSumYears(e.target.value)}
                  placeholder="10"
                  min="0"
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Estimated Returns</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Investment Amount:</span>
                  <span className="font-semibold text-lg">{formatCurrency(parseFloat(lumpSum) || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Gain:</span>
                  <span className="font-semibold text-lg text-primary">{formatCurrency(lumpSumResults.totalGain)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Maturity Value:</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(lumpSumResults.maturityValue)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">How Lump Sum Investment Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A lump sum investment involves investing a large amount of money at once, rather than spreading it over time. This approach:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Allows your entire investment to grow from day one</li>
              <li>Benefits from compound interest over the full investment period</li>
              <li>Works well when you have a significant amount available to invest</li>
              <li>Can be ideal during market downturns or corrections</li>
              <li>Provides potential for higher returns if markets perform well</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              The calculator uses the compound interest formula (A = P(1 + r)^t) to project your investment growth based on the expected annual return rate.
            </p>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This calculator provides estimates based on the inputs provided. Actual returns may vary depending on market conditions and fund performance. Past performance is not indicative of future results. Please consult with a financial advisor before making investment decisions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

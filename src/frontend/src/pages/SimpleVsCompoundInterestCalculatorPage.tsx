import { useState } from 'react';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SimpleVsCompoundInterestCalculatorPage() {
  const navigate = useNavigate();
  const [principal, setPrincipal] = useState<string>('100000');
  const [rate, setRate] = useState<string>('8');
  const [time, setTime] = useState<string>('5');
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>('12');

  const calculateInterests = () => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(rate) || 0;
    const t = parseFloat(time) || 0;
    const n = parseFloat(compoundingFrequency) || 1;

    if (p <= 0 || r <= 0 || t <= 0) {
      return {
        simple: { interest: 0, maturityValue: 0 },
        compound: { interest: 0, maturityValue: 0 },
        difference: 0,
      };
    }

    // Simple Interest
    const simpleInterest = (p * r * t) / 100;
    const simpleMaturity = p + simpleInterest;

    // Compound Interest
    const compoundMaturity = p * Math.pow(1 + r / (n * 100), n * t);
    const compoundInterest = compoundMaturity - p;

    const difference = compoundInterest - simpleInterest;

    return {
      simple: {
        interest: Math.round(simpleInterest),
        maturityValue: Math.round(simpleMaturity),
      },
      compound: {
        interest: Math.round(compoundInterest),
        maturityValue: Math.round(compoundMaturity),
      },
      difference: Math.round(difference),
    };
  };

  const results = calculateInterests();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getFrequencyLabel = (freq: string) => {
    const labels: { [key: string]: string } = {
      '1': 'Annually',
      '2': 'Semi-Annually',
      '4': 'Quarterly',
      '12': 'Monthly',
      '365': 'Daily',
    };
    return labels[freq] || 'Annually';
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl space-y-8">
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
            <TrendingUp className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Simple vs Compound Interest Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare simple and compound interest calculations to understand the power of compounding.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Interest Calculation Details</CardTitle>
            <CardDescription>
              Enter principal, rate, time, and compounding frequency to compare both methods.
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
                <Label htmlFor="rate">Rate of Interest (% per annum)</Label>
                <Input
                  id="rate"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="8"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time Period (Years)</Label>
                <Input
                  id="time"
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="5"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="compounding-frequency">Compounding Frequency</Label>
                <Select value={compoundingFrequency} onValueChange={setCompoundingFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Annually</SelectItem>
                    <SelectItem value="2">Semi-Annually</SelectItem>
                    <SelectItem value="4">Quarterly</SelectItem>
                    <SelectItem value="12">Monthly</SelectItem>
                    <SelectItem value="365">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3 rounded-lg bg-muted/50 p-6">
                <h3 className="font-semibold text-sm text-muted-foreground">Simple Interest</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Interest Earned:</span>
                    <span className="font-semibold text-lg">{formatCurrency(results.simple.interest)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Maturity Value:</span>
                    <span className="font-semibold text-lg">{formatCurrency(results.simple.maturityValue)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-lg bg-muted/50 p-6">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Compound Interest ({getFrequencyLabel(compoundingFrequency)})
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Interest Earned:</span>
                    <span className="font-semibold text-lg text-primary">{formatCurrency(results.compound.interest)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Maturity Value:</span>
                    <span className="font-semibold text-lg text-primary">{formatCurrency(results.compound.maturityValue)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-primary/10 p-6 border border-primary/20">
              <h3 className="font-semibold text-sm">Additional Earnings with Compound Interest</h3>
              <div className="flex justify-between items-center">
                <span className="font-medium">Interest Difference:</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(results.difference)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">Understanding Interest Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-2">Simple Interest</h4>
                <p className="text-sm text-muted-foreground">
                  Calculated only on the principal amount. Formula: SI = (P × R × T) / 100. Interest remains constant throughout the period.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Compound Interest</h4>
                <p className="text-sm text-muted-foreground">
                  Calculated on principal plus accumulated interest. Formula: A = P(1 + r/n)^(nt). Interest earns interest, leading to exponential growth.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Higher compounding frequency results in higher returns. The power of compounding becomes more evident over longer time periods.
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute financial advice.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

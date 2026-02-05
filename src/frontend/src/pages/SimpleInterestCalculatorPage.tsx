import { useState } from 'react';
import { Percent, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function SimpleInterestCalculatorPage() {
  const navigate = useNavigate();
  const [principal, setPrincipal] = useState<string>('100000');
  const [rate, setRate] = useState<string>('8');
  const [time, setTime] = useState<string>('5');

  const calculateSimpleInterest = () => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(rate) || 0;
    const t = parseFloat(time) || 0;

    if (p <= 0 || r <= 0 || t <= 0) {
      return { simpleInterest: 0, totalAmount: 0 };
    }

    const simpleInterest = (p * r * t) / 100;
    const totalAmount = p + simpleInterest;

    return {
      simpleInterest: Math.round(simpleInterest),
      totalAmount: Math.round(totalAmount),
    };
  };

  const results = calculateSimpleInterest();

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
            <Percent className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Simple Interest Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate simple interest on principal amount over a specified time period.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate Simple Interest</CardTitle>
            <CardDescription>
              Enter principal amount, rate of interest, and time period to calculate simple interest.
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
            </div>

            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Result</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Principal Amount:</span>
                  <span className="font-semibold text-lg">{formatCurrency(parseFloat(principal) || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Simple Interest:</span>
                  <span className="font-semibold text-lg text-primary">{formatCurrency(results.simpleInterest)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(results.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About Simple Interest</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Simple interest is calculated only on the principal amount. Key points:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Formula: SI = (P × R × T) / 100</li>
              <li>P = Principal amount</li>
              <li>R = Rate of interest per annum</li>
              <li>T = Time period in years</li>
              <li>Interest remains constant throughout the period</li>
              <li>Commonly used for short-term loans and deposits</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Unlike compound interest, simple interest does not earn interest on accumulated interest.
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

import { useState } from 'react';
import { BarChart3, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function CAGRCalculatorPage() {
  const navigate = useNavigate();
  const [initialValue, setInitialValue] = useState<string>('100000');
  const [finalValue, setFinalValue] = useState<string>('200000');
  const [years, setYears] = useState<string>('5');

  const calculateCAGR = () => {
    const initial = parseFloat(initialValue) || 0;
    const final = parseFloat(finalValue) || 0;
    const period = parseFloat(years) || 0;

    if (initial <= 0 || final <= 0 || period <= 0) {
      return null;
    }

    // CAGR formula: (Final Value / Initial Value)^(1/years) - 1
    const cagr = (Math.pow(final / initial, 1 / period) - 1) * 100;

    return cagr.toFixed(2);
  };

  const cagr = calculateCAGR();

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
            <BarChart3 className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">CAGR Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate Compound Annual Growth Rate to measure investment performance over time.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate CAGR</CardTitle>
            <CardDescription>
              Enter initial value, final value, and time period to calculate the annualized growth rate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="initial-value">Initial Value (₹)</Label>
                <Input
                  id="initial-value"
                  type="number"
                  value={initialValue}
                  onChange={(e) => setInitialValue(e.target.value)}
                  placeholder="100000"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="final-value">Final Value (₹)</Label>
                <Input
                  id="final-value"
                  type="number"
                  value={finalValue}
                  onChange={(e) => setFinalValue(e.target.value)}
                  placeholder="200000"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Time Period (Years)</Label>
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
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
                  <span className="text-sm">Initial Value:</span>
                  <span className="font-semibold text-lg">{formatCurrency(parseFloat(initialValue) || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Final Value:</span>
                  <span className="font-semibold text-lg">{formatCurrency(parseFloat(finalValue) || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Time Period:</span>
                  <span className="font-semibold text-lg">{years} years</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">CAGR:</span>
                    <span className="text-2xl font-bold text-primary">
                      {cagr !== null ? `${cagr}%` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About CAGR (Compound Annual Growth Rate)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              CAGR represents the mean annual growth rate of an investment over a specified period. Key features:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Smooths out volatility to show steady growth rate</li>
              <li>Useful for comparing different investments</li>
              <li>Assumes profits are reinvested at the end of each period</li>
              <li>Does not reflect investment risk or volatility</li>
              <li>Best used for investments held for multiple years</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Formula: CAGR = (Final Value / Initial Value)^(1/Years) - 1
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute financial advice. Past performance does not guarantee future results.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

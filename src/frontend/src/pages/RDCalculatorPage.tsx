import { useState } from 'react';
import { Repeat, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function RDCalculatorPage() {
  const navigate = useNavigate();
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>('5000');
  const [interestRate, setInterestRate] = useState<string>('6.5');
  const [tenure, setTenure] = useState<string>('5');

  const calculateRD = () => {
    const monthly = parseFloat(monthlyInvestment) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseFloat(tenure) || 0;

    if (monthly <= 0 || rate <= 0 || years <= 0) {
      return { totalDeposited: 0, interestEarned: 0, maturityValue: 0 };
    }

    const months = years * 12;
    const monthlyRate = rate / 12 / 100;

    // RD formula: M = P * [(1 + r)^n - 1] / [1 - (1 + r)^(-1/3)]
    // Simplified calculation
    let maturityValue = 0;
    for (let i = 1; i <= months; i++) {
      maturityValue += monthly * Math.pow(1 + monthlyRate, months - i + 1);
    }

    const totalDeposited = monthly * months;
    const interestEarned = maturityValue - totalDeposited;

    return {
      totalDeposited: Math.round(totalDeposited),
      interestEarned: Math.round(interestEarned),
      maturityValue: Math.round(maturityValue),
    };
  };

  const results = calculateRD();

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
            <Repeat className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">RD Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate returns on your Recurring Deposit with regular monthly investments.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate Your RD Returns</CardTitle>
            <CardDescription>
              Enter your monthly investment amount, interest rate, and tenure to see projected returns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthly-investment">Monthly Investment (₹)</Label>
                <Input
                  id="monthly-investment"
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(e.target.value)}
                  placeholder="5000"
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
            </div>

            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Estimated Returns</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Deposited:</span>
                  <span className="font-semibold text-lg">{formatCurrency(results.totalDeposited)}</span>
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
            <CardTitle className="text-xl">About Recurring Deposit (RD)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Recurring Deposit is a savings scheme where you invest a fixed amount monthly. Key features include:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Fixed monthly investment amount</li>
              <li>Tenure typically ranges from 6 months to 10 years</li>
              <li>Interest rates similar to Fixed Deposits</li>
              <li>Premature withdrawal allowed with penalty</li>
              <li>Helps build disciplined savings habit</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Interest is compounded quarterly and calculated on the monthly deposits.
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

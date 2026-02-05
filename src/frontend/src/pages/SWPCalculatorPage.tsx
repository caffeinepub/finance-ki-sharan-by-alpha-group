import { useState } from 'react';
import { ArrowDownCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function SWPCalculatorPage() {
  const navigate = useNavigate();
  const [initialInvestment, setInitialInvestment] = useState<string>('1000000');
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<string>('10000');
  const [annualReturn, setAnnualReturn] = useState<string>('12');
  const [years, setYears] = useState<string>('10');

  const calculateSWP = () => {
    const initial = parseFloat(initialInvestment) || 0;
    const withdrawal = parseFloat(monthlyWithdrawal) || 0;
    const rate = parseFloat(annualReturn) || 0;
    const duration = parseFloat(years) || 0;

    if (initial <= 0 || withdrawal < 0 || rate < 0 || duration <= 0) {
      return { totalWithdrawn: 0, finalBalance: 0, growthOrLoss: 0 };
    }

    const monthlyRate = rate / 12 / 100;
    const months = duration * 12;

    let balance = initial;
    let totalWithdrawn = 0;

    // Calculate month by month
    for (let i = 0; i < months; i++) {
      // Add returns for the month
      balance = balance * (1 + monthlyRate);
      
      // Withdraw the monthly amount
      if (balance >= withdrawal) {
        balance -= withdrawal;
        totalWithdrawn += withdrawal;
      } else {
        // If balance is less than withdrawal, withdraw remaining balance
        totalWithdrawn += balance;
        balance = 0;
        break;
      }
    }

    const finalBalance = Math.max(0, balance);
    const growthOrLoss = finalBalance + totalWithdrawn - initial;

    return {
      totalWithdrawn: Math.round(totalWithdrawn),
      finalBalance: Math.round(finalBalance),
      growthOrLoss: Math.round(growthOrLoss),
    };
  };

  const swpResults = calculateSWP();

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
            <ArrowDownCircle className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">SWP Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate systematic withdrawals from your investments. Plan how long your corpus will last with regular monthly withdrawals while earning returns.
          </p>
        </div>

        {/* Calculator Card */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate Your SWP Returns</CardTitle>
            <CardDescription>
              Enter your initial investment, monthly withdrawal amount, expected annual return rate, and duration to see projected results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="initial-investment">Initial Investment (₹)</Label>
                <Input
                  id="initial-investment"
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  placeholder="1000000"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly-withdrawal">Monthly Withdrawal (₹)</Label>
                <Input
                  id="monthly-withdrawal"
                  type="number"
                  value={monthlyWithdrawal}
                  onChange={(e) => setMonthlyWithdrawal(e.target.value)}
                  placeholder="10000"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annual-return">Expected Annual Return (%)</Label>
                <Input
                  id="annual-return"
                  type="number"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(e.target.value)}
                  placeholder="12"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Investment Duration (Years)</Label>
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="10"
                  min="0"
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Estimated Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Initial Investment:</span>
                  <span className="font-semibold text-lg">{formatCurrency(parseFloat(initialInvestment) || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Withdrawn:</span>
                  <span className="font-semibold text-lg text-primary">{formatCurrency(swpResults.totalWithdrawn)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Estimated Balance:</span>
                  <span className="font-semibold text-lg">{formatCurrency(swpResults.finalBalance)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Overall Growth/Loss:</span>
                    <span className={`text-2xl font-bold ${swpResults.growthOrLoss >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                      {swpResults.growthOrLoss >= 0 ? '+' : ''}{formatCurrency(swpResults.growthOrLoss)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">How SWP Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A Systematic Withdrawal Plan (SWP) allows you to withdraw a fixed amount regularly from your mutual fund investments. This approach helps you:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Generate regular income from your investments</li>
              <li>Maintain financial discipline during retirement or other needs</li>
              <li>Continue earning returns on the remaining corpus</li>
              <li>Plan your cash flow requirements effectively</li>
              <li>Potentially benefit from tax efficiency compared to lump sum withdrawals</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              The calculator simulates month-by-month withdrawals while accounting for returns on the remaining balance. Your actual results may vary based on market performance.
            </p>
            <div className="mt-4 p-4 rounded-lg bg-muted border border-border">
              <p className="text-xs text-muted-foreground italic">
                <strong>Educational Disclaimer:</strong> This information is for educational purposes only and does not constitute financial advice. Please consult with a qualified financial advisor before making investment or withdrawal decisions.
              </p>
            </div>
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

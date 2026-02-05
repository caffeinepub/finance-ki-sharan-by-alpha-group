import { useState } from 'react';
import { PiggyBank, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ResultBreakdownPieChart from '@/components/calculators/ResultBreakdownPieChart';
import { formatINR } from '@/utils/formatters';

export default function PPFCalculatorPage() {
  const navigate = useNavigate();
  const [yearlyInvestment, setYearlyInvestment] = useState<string>('150000');
  const [tenure, setTenure] = useState<string>('15');
  const [interestRate, setInterestRate] = useState<string>('7.1');

  const calculatePPF = () => {
    const yearly = parseFloat(yearlyInvestment) || 0;
    const years = parseFloat(tenure) || 0;
    const rate = parseFloat(interestRate) || 0;

    if (yearly <= 0 || years <= 0 || rate <= 0) {
      return { totalInvested: 0, interestEarned: 0, maturityValue: 0 };
    }

    let balance = 0;
    const annualRate = rate / 100;

    for (let year = 1; year <= years; year++) {
      balance += yearly;
      balance += balance * annualRate;
    }

    const totalInvested = yearly * years;
    const interestEarned = balance - totalInvested;

    return {
      totalInvested: Math.round(totalInvested),
      interestEarned: Math.round(interestEarned),
      maturityValue: Math.round(balance),
    };
  };

  const results = calculatePPF();

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
            <PiggyBank className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">PPF Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate returns on your Public Provident Fund investment. PPF offers tax-free returns and is one of the safest long-term investment options.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate Your PPF Returns</CardTitle>
            <CardDescription>
              Enter your yearly investment amount, tenure, and interest rate to see projected returns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="yearly-investment">Yearly Investment (₹)</Label>
                <Input
                  id="yearly-investment"
                  type="number"
                  value={yearlyInvestment}
                  onChange={(e) => setYearlyInvestment(e.target.value)}
                  placeholder="150000"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenure">Tenure (Years)</Label>
                <Input
                  id="tenure"
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  placeholder="15"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                <Input
                  id="interest-rate"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="7.1"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Estimated Returns</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Invested:</span>
                  <span className="font-semibold text-lg">{formatINR(results.totalInvested)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Interest Earned:</span>
                  <span className="font-semibold text-lg text-primary">{formatINR(results.interestEarned)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Maturity Value:</span>
                    <span className="text-2xl font-bold text-primary">{formatINR(results.maturityValue)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <ResultBreakdownPieChart
          invested={results.totalInvested}
          earned={results.interestEarned}
          total={results.maturityValue}
          investedLabel="Total Invested"
          earnedLabel="Interest Earned"
          totalLabel="Maturity Value"
        />

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About Public Provident Fund (PPF)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Public Provident Fund is a long-term savings scheme backed by the Government of India. Key features include:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Tax-free interest and maturity amount (EEE status)</li>
              <li>Minimum investment of ₹500 and maximum of ₹1.5 lakh per year</li>
              <li>Lock-in period of 15 years with extension option</li>
              <li>Partial withdrawals allowed after 7 years</li>
              <li>Loan facility available from 3rd to 6th year</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              The interest rate is set by the government quarterly and compounds annually.
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

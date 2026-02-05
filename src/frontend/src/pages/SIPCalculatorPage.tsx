import { useState } from 'react';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ResultBreakdownPieChart from '@/components/calculators/ResultBreakdownPieChart';
import CashFlowSection from '@/components/calculators/CashFlowSection';
import { formatINR } from '@/utils/formatters';
import { createMonthlyContributionSchedule } from '@/utils/cashFlowSchedules';

export default function SIPCalculatorPage() {
  const navigate = useNavigate();
  const [sipMonthly, setSipMonthly] = useState<string>('5000');
  const [sipRate, setSipRate] = useState<string>('12');
  const [sipYears, setSipYears] = useState<string>('10');

  const calculateSIP = () => {
    const monthly = parseFloat(sipMonthly) || 0;
    const rate = parseFloat(sipRate) || 0;
    const years = parseFloat(sipYears) || 0;

    if (monthly <= 0 || rate <= 0 || years <= 0) {
      return { totalValue: 0, invested: 0, returns: 0 };
    }

    const monthlyRate = rate / 12 / 100;
    const months = years * 12;

    // Future Value of SIP formula: FV = P × [(1 + r)^n - 1] / r × (1 + r)
    const futureValue = monthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const invested = monthly * months;
    const returns = futureValue - invested;

    return {
      totalValue: Math.round(futureValue),
      invested: Math.round(invested),
      returns: Math.round(returns),
    };
  };

  const sipResults = calculateSIP();
  
  // Generate cash flow schedule
  const monthly = parseFloat(sipMonthly) || 0;
  const years = parseFloat(sipYears) || 0;
  const months = years * 12;
  const cashFlowRows = monthly > 0 && months > 0
    ? createMonthlyContributionSchedule(monthly, months, true, sipResults.totalValue)
    : [];

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
            <TrendingUp className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">SIP Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate the future value of your Systematic Investment Plan. See how regular monthly investments can grow over time with the power of compounding.
          </p>
        </div>

        {/* Calculator Card */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate Your SIP Returns</CardTitle>
            <CardDescription>
              Enter your monthly investment amount, expected annual return rate, and investment duration to see projected returns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sip-monthly">Monthly Investment (₹)</Label>
                <Input
                  id="sip-monthly"
                  type="number"
                  value={sipMonthly}
                  onChange={(e) => setSipMonthly(e.target.value)}
                  placeholder="5000"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sip-rate">Expected Annual Return (%)</Label>
                <Input
                  id="sip-rate"
                  type="number"
                  value={sipRate}
                  onChange={(e) => setSipRate(e.target.value)}
                  placeholder="12"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sip-years">Investment Duration (Years)</Label>
                <Input
                  id="sip-years"
                  type="number"
                  value={sipYears}
                  onChange={(e) => setSipYears(e.target.value)}
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
                  <span className="text-sm">Total Invested:</span>
                  <span className="font-semibold text-lg">{formatINR(sipResults.invested)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Estimated Returns:</span>
                  <span className="font-semibold text-lg text-primary">{formatINR(sipResults.returns)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Maturity Value:</span>
                    <span className="text-2xl font-bold text-primary">{formatINR(sipResults.totalValue)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <ResultBreakdownPieChart
          invested={sipResults.invested}
          earned={sipResults.returns}
          total={sipResults.totalValue}
          investedLabel="Total Invested"
          earnedLabel="Estimated Returns"
          totalLabel="Maturity Value"
        />

        {/* Cash Flow Section */}
        <CashFlowSection
          rows={cashFlowRows}
          csvFilename="sip-cash-flow.csv"
        />

        {/* Information Card */}
        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">How SIP Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly in mutual funds. This disciplined approach helps you:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Build wealth gradually through regular investments</li>
              <li>Benefit from rupee cost averaging</li>
              <li>Harness the power of compounding over time</li>
              <li>Develop a disciplined investment habit</li>
              <li>Reduce the impact of market volatility</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              The calculator uses the compound interest formula to project your investment growth based on the expected annual return rate.
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

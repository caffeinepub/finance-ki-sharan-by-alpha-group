import { useState } from 'react';
import { ArrowUpCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StepUpCalculatorPage() {
  const navigate = useNavigate();
  
  // Step-Up by Amount State
  const [amountMonthly, setAmountMonthly] = useState<string>('5000');
  const [amountRate, setAmountRate] = useState<string>('12');
  const [amountYears, setAmountYears] = useState<string>('10');
  const [stepUpAmount, setStepUpAmount] = useState<string>('500');

  // Step-Up by Percentage State
  const [percentMonthly, setPercentMonthly] = useState<string>('5000');
  const [percentRate, setPercentRate] = useState<string>('12');
  const [percentYears, setPercentYears] = useState<string>('10');
  const [stepUpPercent, setStepUpPercent] = useState<string>('10');

  const calculateStepUpByAmount = () => {
    const initialMonthly = parseFloat(amountMonthly) || 0;
    const rate = parseFloat(amountRate) || 0;
    const years = parseFloat(amountYears) || 0;
    const stepUp = parseFloat(stepUpAmount) || 0;

    if (initialMonthly <= 0 || rate <= 0 || years <= 0) {
      return { totalValue: 0, invested: 0, returns: 0 };
    }

    const monthlyRate = rate / 12 / 100;
    let totalValue = 0;
    let totalInvested = 0;

    for (let year = 0; year < years; year++) {
      const yearlyMonthly = initialMonthly + (stepUp * year);
      const monthsInYear = 12;
      
      for (let month = 0; month < monthsInYear; month++) {
        const monthsRemaining = (years - year) * 12 - month;
        const futureValue = yearlyMonthly * Math.pow(1 + monthlyRate, monthsRemaining);
        totalValue += futureValue;
        totalInvested += yearlyMonthly;
      }
    }

    return {
      totalValue: Math.round(totalValue),
      invested: Math.round(totalInvested),
      returns: Math.round(totalValue - totalInvested),
    };
  };

  const calculateStepUpByPercent = () => {
    const initialMonthly = parseFloat(percentMonthly) || 0;
    const rate = parseFloat(percentRate) || 0;
    const years = parseFloat(percentYears) || 0;
    const stepUpPct = parseFloat(stepUpPercent) || 0;

    if (initialMonthly <= 0 || rate <= 0 || years <= 0) {
      return { totalValue: 0, invested: 0, returns: 0 };
    }

    const monthlyRate = rate / 12 / 100;
    let totalValue = 0;
    let totalInvested = 0;

    for (let year = 0; year < years; year++) {
      const yearlyMonthly = initialMonthly * Math.pow(1 + stepUpPct / 100, year);
      const monthsInYear = 12;
      
      for (let month = 0; month < monthsInYear; month++) {
        const monthsRemaining = (years - year) * 12 - month;
        const futureValue = yearlyMonthly * Math.pow(1 + monthlyRate, monthsRemaining);
        totalValue += futureValue;
        totalInvested += yearlyMonthly;
      }
    }

    return {
      totalValue: Math.round(totalValue),
      invested: Math.round(totalInvested),
      returns: Math.round(totalValue - totalInvested),
    };
  };

  const amountResults = calculateStepUpByAmount();
  const percentResults = calculateStepUpByPercent();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl space-y-8">
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
            <ArrowUpCircle className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Step-Up Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate returns when you increase your SIP investment annually. Choose to step up by a fixed amount or by a percentage each year.
          </p>
        </div>

        {/* Calculator Tabs */}
        <Tabs defaultValue="amount" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="amount">Step-Up by Amount</TabsTrigger>
            <TabsTrigger value="percent">Step-Up by Percentage</TabsTrigger>
          </TabsList>

          {/* Step-Up by Amount */}
          <TabsContent value="amount" className="space-y-6 mt-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Step-Up by Fixed Amount</CardTitle>
                <CardDescription>
                  Increase your monthly SIP investment by a fixed rupee amount every year. For example, if you start with ₹5,000 and step up by ₹500, you'll invest ₹5,500 in year 2, ₹6,000 in year 3, and so on.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount-monthly">Initial Monthly Investment (₹)</Label>
                    <Input
                      id="amount-monthly"
                      type="number"
                      value={amountMonthly}
                      onChange={(e) => setAmountMonthly(e.target.value)}
                      placeholder="5000"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount-stepup">Annual Step-Up Amount (₹)</Label>
                    <Input
                      id="amount-stepup"
                      type="number"
                      value={stepUpAmount}
                      onChange={(e) => setStepUpAmount(e.target.value)}
                      placeholder="500"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount-rate">Expected Annual Return (%)</Label>
                    <Input
                      id="amount-rate"
                      type="number"
                      value={amountRate}
                      onChange={(e) => setAmountRate(e.target.value)}
                      placeholder="12"
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount-years">Investment Duration (Years)</Label>
                    <Input
                      id="amount-years"
                      type="number"
                      value={amountYears}
                      onChange={(e) => setAmountYears(e.target.value)}
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
                      <span className="font-semibold text-lg">{formatCurrency(amountResults.invested)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Estimated Returns:</span>
                      <span className="font-semibold text-lg text-primary">{formatCurrency(amountResults.returns)}</span>
                    </div>
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Maturity Value:</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(amountResults.totalValue)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step-Up by Percentage */}
          <TabsContent value="percent" className="space-y-6 mt-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Step-Up by Percentage</CardTitle>
                <CardDescription>
                  Increase your monthly SIP investment by a percentage every year. For example, if you start with ₹5,000 and step up by 10%, you'll invest ₹5,500 in year 2, ₹6,050 in year 3, and so on.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="percent-monthly">Initial Monthly Investment (₹)</Label>
                    <Input
                      id="percent-monthly"
                      type="number"
                      value={percentMonthly}
                      onChange={(e) => setPercentMonthly(e.target.value)}
                      placeholder="5000"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="percent-stepup">Annual Step-Up Percentage (%)</Label>
                    <Input
                      id="percent-stepup"
                      type="number"
                      value={stepUpPercent}
                      onChange={(e) => setStepUpPercent(e.target.value)}
                      placeholder="10"
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="percent-rate">Expected Annual Return (%)</Label>
                    <Input
                      id="percent-rate"
                      type="number"
                      value={percentRate}
                      onChange={(e) => setPercentRate(e.target.value)}
                      placeholder="12"
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="percent-years">Investment Duration (Years)</Label>
                    <Input
                      id="percent-years"
                      type="number"
                      value={percentYears}
                      onChange={(e) => setPercentYears(e.target.value)}
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
                      <span className="font-semibold text-lg">{formatCurrency(percentResults.invested)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Estimated Returns:</span>
                      <span className="font-semibold text-lg text-primary">{formatCurrency(percentResults.returns)}</span>
                    </div>
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Maturity Value:</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(percentResults.totalValue)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Information Card */}
        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">Benefits of Step-Up SIP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A Step-Up SIP allows you to increase your investment amount periodically, helping you:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Align investments with your growing income over time</li>
              <li>Accelerate wealth creation by investing more as you earn more</li>
              <li>Combat inflation by increasing investment amounts annually</li>
              <li>Reach financial goals faster with progressive investments</li>
              <li>Maintain investment discipline while adapting to life changes</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Choose between fixed amount increases for predictable growth or percentage increases that compound your investment growth over time.
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

import { useState } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function SSYCalculatorPage() {
  const navigate = useNavigate();
  const [yearlyInvestment, setYearlyInvestment] = useState<string>('50000');
  const [girlAge, setGirlAge] = useState<string>('5');
  const [startYear, setStartYear] = useState<string>('2026');

  const SSY_INTEREST_RATE = 8.2; // Fixed SSY interest rate

  const calculateSSY = () => {
    const yearly = parseFloat(yearlyInvestment) || 0;
    const age = parseFloat(girlAge) || 0;
    const year = parseFloat(startYear) || 0;

    if (yearly <= 0 || age <= 0 || age > 10 || year <= 0) {
      return { 
        totalInvestment: 0, 
        interestEarned: 0, 
        maturityValue: 0,
        depositYears: 0,
        maturityAge: 0,
      };
    }

    // SSY allows deposits for 15 years or until girl turns 21, whichever comes first
    const depositYears = Math.min(15, 21 - age);
    const maturityAge = 21;
    const totalYears = maturityAge - age;

    // Calculate compound interest
    let maturityValue = 0;
    const rate = SSY_INTEREST_RATE / 100;

    // For each year of deposit, calculate compound interest until maturity
    for (let i = 0; i < depositYears; i++) {
      const yearsToCompound = totalYears - i;
      maturityValue += yearly * Math.pow(1 + rate, yearsToCompound);
    }

    const totalInvestment = yearly * depositYears;
    const interestEarned = maturityValue - totalInvestment;

    return {
      totalInvestment: Math.round(totalInvestment),
      interestEarned: Math.round(interestEarned),
      maturityValue: Math.round(maturityValue),
      depositYears,
      maturityAge,
    };
  };

  const ssyResults = calculateSSY();

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
            <Heart className="h-10 w-10 text-pink-500" />
            <h1 className="text-4xl font-bold tracking-tight">SSY Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate returns on Sukanya Samriddhi Yojana investments. Plan for your daughter's future with this government-backed savings scheme.
          </p>
        </div>

        {/* Calculator Card */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate Your SSY Returns</CardTitle>
            <CardDescription>
              Enter your yearly investment amount, your daughter's current age, and the start year to see projected returns at maturity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="yearly-investment">Yearly Investment (₹)</Label>
                <Input
                  id="yearly-investment"
                  type="number"
                  value={yearlyInvestment}
                  onChange={(e) => setYearlyInvestment(e.target.value)}
                  placeholder="50000"
                  min="0"
                  max="150000"
                />
                <p className="text-xs text-muted-foreground">Maximum: ₹1,50,000 per year</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="girl-age">Girl's Age (Years)</Label>
                <Input
                  id="girl-age"
                  type="number"
                  value={girlAge}
                  onChange={(e) => setGirlAge(e.target.value)}
                  placeholder="5"
                  min="0"
                  max="10"
                />
                <p className="text-xs text-muted-foreground">Account can be opened for girls up to 10 years of age</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-year">Start Period (Year)</Label>
                <Input
                  id="start-year"
                  type="number"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  placeholder="2026"
                  min="2000"
                  max="2100"
                />
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Interest Rate:</span>
                  <span className="text-lg font-bold text-primary">{SSY_INTEREST_RATE}% p.a.</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Fixed rate as per latest government notification</p>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Estimated Returns</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Investment:</span>
                  <span className="font-semibold text-lg">{formatCurrency(ssyResults.totalInvestment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Interest Earned:</span>
                  <span className="font-semibold text-lg text-primary">{formatCurrency(ssyResults.interestEarned)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Maturity Value:</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(ssyResults.maturityValue)}</span>
                  </div>
                </div>
                {ssyResults.depositYears > 0 && (
                  <div className="text-xs text-muted-foreground space-y-1 pt-2">
                    <p>• Deposit period: {ssyResults.depositYears} years</p>
                    <p>• Maturity at age: {ssyResults.maturityAge} years</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About Sukanya Samriddhi Yojana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Sukanya Samriddhi Yojana (SSY) is a government-backed savings scheme designed to secure the financial future of girl children. Key features include:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li><strong>Eligibility:</strong> Account can be opened for a girl child up to 10 years of age</li>
              <li><strong>Deposit Period:</strong> Deposits can be made for 15 years from the date of account opening</li>
              <li><strong>Maturity:</strong> Account matures when the girl turns 21 years old</li>
              <li><strong>Interest Rate:</strong> Currently 8.2% per annum (compounded annually)</li>
              <li><strong>Investment Limit:</strong> Minimum ₹250 per year, Maximum ₹1,50,000 per year</li>
              <li><strong>Tax Benefits:</strong> Eligible for tax deduction under Section 80C of Income Tax Act</li>
              <li><strong>Partial Withdrawal:</strong> Allowed after girl turns 18 for education purposes</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              The scheme offers one of the highest interest rates among government-backed savings schemes and provides complete tax exemption on interest earned.
            </p>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute financial advice. Interest rates are subject to change as per government notifications. Please verify current rates and scheme details with authorized banks or post offices before investing.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

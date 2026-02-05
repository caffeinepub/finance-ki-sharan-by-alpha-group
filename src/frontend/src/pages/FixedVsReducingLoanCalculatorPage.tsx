import { useState } from 'react';
import { Scale, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function FixedVsReducingLoanCalculatorPage() {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState<string>('1000000');
  const [interestRate, setInterestRate] = useState<string>('10');
  const [tenure, setTenure] = useState<string>('5');

  const calculateLoans = () => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseFloat(tenure) || 0;

    if (principal <= 0 || rate <= 0 || years <= 0) {
      return {
        fixed: { totalInterest: 0, totalRepayment: 0 },
        reducing: { totalInterest: 0, totalRepayment: 0 },
        difference: 0,
      };
    }

    // Fixed Interest (Flat Rate)
    const fixedInterest = (principal * rate * years) / 100;
    const fixedTotal = principal + fixedInterest;

    // Reducing Balance (EMI method)
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const reducingTotal = emi * months;
    const reducingInterest = reducingTotal - principal;

    const difference = fixedInterest - reducingInterest;

    return {
      fixed: {
        totalInterest: Math.round(fixedInterest),
        totalRepayment: Math.round(fixedTotal),
      },
      reducing: {
        totalInterest: Math.round(reducingInterest),
        totalRepayment: Math.round(reducingTotal),
      },
      difference: Math.round(difference),
    };
  };

  const results = calculateLoans();

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
            <Scale className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Fixed vs Reducing Loan Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare fixed interest and reducing balance loan methods to understand the difference in total interest.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
            <CardDescription>
              Enter loan amount, interest rate, and tenure to compare both methods.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
                <Input
                  id="loan-amount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="1000000"
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
                  placeholder="10"
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
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3 rounded-lg bg-muted/50 p-6">
                <h3 className="font-semibold text-sm text-muted-foreground">Fixed Interest Method</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Interest:</span>
                    <span className="font-semibold text-lg text-destructive">{formatCurrency(results.fixed.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Repayment:</span>
                    <span className="font-semibold text-lg">{formatCurrency(results.fixed.totalRepayment)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-lg bg-muted/50 p-6">
                <h3 className="font-semibold text-sm text-muted-foreground">Reducing Balance Method</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Interest:</span>
                    <span className="font-semibold text-lg text-primary">{formatCurrency(results.reducing.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Repayment:</span>
                    <span className="font-semibold text-lg">{formatCurrency(results.reducing.totalRepayment)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-primary/10 p-6 border border-primary/20">
              <h3 className="font-semibold text-sm">Savings with Reducing Balance</h3>
              <div className="flex justify-between items-center">
                <span className="font-medium">Interest Difference:</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(results.difference)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">Understanding Loan Interest Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-2">Fixed Interest (Flat Rate)</h4>
                <p className="text-sm text-muted-foreground">
                  Interest is calculated on the original principal for the entire tenure. The interest amount remains constant regardless of principal repayment.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Reducing Balance (Diminishing Balance)</h4>
                <p className="text-sm text-muted-foreground">
                  Interest is calculated on the outstanding principal balance. As you repay the loan, the principal reduces, and so does the interest charged.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Reducing balance method is more borrower-friendly as it results in lower total interest compared to fixed interest method.
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute financial advice. Always verify loan terms with your lender.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

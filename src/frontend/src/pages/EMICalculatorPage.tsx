import { useState } from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function EMICalculatorPage() {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState<string>('1000000');
  const [interestRate, setInterestRate] = useState<string>('8.5');
  const [tenure, setTenure] = useState<string>('20');

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseFloat(tenure) || 0;

    if (principal <= 0 || rate <= 0 || years <= 0) {
      return { emi: 0, totalInterest: 0, totalRepayment: 0 };
    }

    const monthlyRate = rate / 12 / 100;
    const months = years * 12;

    // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalRepayment = emi * months;
    const totalInterest = totalRepayment - principal;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalRepayment: Math.round(totalRepayment),
    };
  };

  const results = calculateEMI();

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
            <Home className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">EMI Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your Equated Monthly Installment for loans with total interest and repayment amount.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate Your EMI</CardTitle>
            <CardDescription>
              Enter your loan amount, interest rate, and tenure to see monthly EMI and total repayment.
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
                  placeholder="8.5"
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
                  placeholder="20"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Loan Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Loan Amount:</span>
                  <span className="font-semibold text-lg">{formatCurrency(parseFloat(loanAmount) || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Interest:</span>
                  <span className="font-semibold text-lg text-destructive">{formatCurrency(results.totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Repayment:</span>
                  <span className="font-semibold text-lg">{formatCurrency(results.totalRepayment)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Monthly EMI:</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(results.emi)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About EMI (Equated Monthly Installment)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              EMI is a fixed payment amount made by a borrower to a lender at a specified date each month. Key points:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Fixed monthly payment throughout the loan tenure</li>
              <li>Consists of both principal and interest components</li>
              <li>Initially, interest component is higher; gradually principal increases</li>
              <li>Helps in better financial planning with predictable payments</li>
              <li>Common for home loans, car loans, and personal loans</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              The EMI formula ensures that the loan is fully repaid with interest by the end of the tenure.
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute financial advice. Actual EMI may vary based on lender terms and processing fees.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

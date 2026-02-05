import { useState } from 'react';
import { HomeIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function HomeLoanEMICalculatorPage() {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState<string>('5000000');
  const [interestRate, setInterestRate] = useState<string>('8.5');
  const [tenure, setTenure] = useState<string>('20');

  const calculateHomeLoan = () => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseFloat(tenure) || 0;

    if (principal <= 0 || rate <= 0 || years <= 0) {
      return { emi: 0, totalInterest: 0, totalRepayment: 0, principalAmount: 0 };
    }

    const monthlyRate = rate / 12 / 100;
    const months = years * 12;

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalRepayment = emi * months;
    const totalInterest = totalRepayment - principal;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalRepayment: Math.round(totalRepayment),
      principalAmount: Math.round(principal),
    };
  };

  const results = calculateHomeLoan();

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
            <HomeIcon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Home Loan EMI Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your home loan EMI with detailed breakdown of principal and interest components.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate Home Loan EMI</CardTitle>
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
                  placeholder="5000000"
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
                  <span className="text-sm">Principal Amount:</span>
                  <span className="font-semibold text-lg">{formatCurrency(results.principalAmount)}</span>
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

            <div className="space-y-3 rounded-lg bg-primary/10 p-6 border border-primary/20">
              <h3 className="font-semibold text-sm">Amortization Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Principal Component:</span>
                  <span className="font-semibold text-sm">{((results.principalAmount / results.totalRepayment) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Interest Component:</span>
                  <span className="font-semibold text-sm">{((results.totalInterest / results.totalRepayment) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About Home Loan EMI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Home loan EMI consists of both principal and interest components. Key points:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>EMI remains constant throughout the loan tenure</li>
              <li>Initially, interest component is higher than principal</li>
              <li>Gradually, principal component increases over time</li>
              <li>Tax benefits available under Section 80C (principal) and 24(b) (interest)</li>
              <li>Prepayment can significantly reduce total interest</li>
              <li>Longer tenure means lower EMI but higher total interest</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Consider your monthly budget and long-term financial goals when choosing loan tenure.
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

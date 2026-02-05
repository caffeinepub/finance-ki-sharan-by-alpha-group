import { useState } from 'react';
import { Award, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function GratuityCalculatorPage() {
  const navigate = useNavigate();
  const [lastSalary, setLastSalary] = useState<string>('50000');
  const [yearsOfService, setYearsOfService] = useState<string>('10');

  const calculateGratuity = () => {
    const salary = parseFloat(lastSalary) || 0;
    const years = parseFloat(yearsOfService) || 0;

    if (salary <= 0 || years < 5) {
      return 0;
    }

    // Gratuity formula: (Last drawn salary × 15 × Years of service) / 26
    const gratuity = (salary * 15 * years) / 26;

    return Math.round(gratuity);
  };

  const gratuityAmount = calculateGratuity();

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
            <Award className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Gratuity Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your gratuity amount as per Indian labor laws based on last drawn salary and years of service.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate Your Gratuity</CardTitle>
            <CardDescription>
              Enter your last drawn salary and years of service to calculate gratuity amount.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="last-salary">Last Drawn Salary (₹)</Label>
                <Input
                  id="last-salary"
                  type="number"
                  value={lastSalary}
                  onChange={(e) => setLastSalary(e.target.value)}
                  placeholder="50000"
                  min="0"
                />
                <p className="text-xs text-muted-foreground">Basic salary + Dearness Allowance</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="years-of-service">Years of Service</Label>
                <Input
                  id="years-of-service"
                  type="number"
                  value={yearsOfService}
                  onChange={(e) => setYearsOfService(e.target.value)}
                  placeholder="10"
                  min="0"
                  step="0.1"
                />
                <p className="text-xs text-muted-foreground">Minimum 5 years required for gratuity eligibility</p>
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Gratuity Amount</h3>
              <div className="flex justify-between items-center">
                <span className="font-medium">Estimated Gratuity:</span>
                <span className="text-2xl font-bold text-primary">
                  {parseFloat(yearsOfService) >= 5 ? formatCurrency(gratuityAmount) : 'Not Eligible'}
                </span>
              </div>
              {parseFloat(yearsOfService) < 5 && (
                <p className="text-xs text-destructive">Minimum 5 years of continuous service required</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About Gratuity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gratuity is a lump sum payment made by an employer to an employee as a token of appreciation. Key points:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Applicable to organizations with 10 or more employees</li>
              <li>Minimum 5 years of continuous service required</li>
              <li>Formula: (Last drawn salary × 15 × Years of service) / 26</li>
              <li>Maximum gratuity amount is ₹20 lakhs (as per current law)</li>
              <li>Tax-free up to ₹20 lakhs under Section 10(10)</li>
              <li>Payable on retirement, resignation, death, or disability</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Last drawn salary includes basic salary and dearness allowance. The divisor 26 represents average working days in a month.
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute financial advice. Actual gratuity may vary based on company policy and applicable laws.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

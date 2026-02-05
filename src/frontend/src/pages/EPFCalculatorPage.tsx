import { useState } from 'react';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function EPFCalculatorPage() {
  const navigate = useNavigate();
  const [basicSalary, setBasicSalary] = useState<string>('50000');
  const [employeeContribution, setEmployeeContribution] = useState<string>('12');
  const [employerContribution, setEmployerContribution] = useState<string>('12');
  const [interestRate, setInterestRate] = useState<string>('8.25');
  const [tenure, setTenure] = useState<string>('30');

  const calculateEPF = () => {
    const salary = parseFloat(basicSalary) || 0;
    const empContrib = parseFloat(employeeContribution) || 0;
    const emplrContrib = parseFloat(employerContribution) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseFloat(tenure) || 0;

    if (salary <= 0 || years <= 0) {
      return { totalEmployee: 0, totalEmployer: 0, totalInterest: 0, maturityBalance: 0 };
    }

    const monthlyEmpContrib = (salary * empContrib) / 100;
    const monthlyEmplrContrib = (salary * emplrContrib) / 100;
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;

    let balance = 0;
    let totalInterest = 0;

    for (let month = 1; month <= months; month++) {
      balance += monthlyEmpContrib + monthlyEmplrContrib;
      const interest = balance * monthlyRate;
      totalInterest += interest;
      balance += interest;
    }

    const totalEmployee = monthlyEmpContrib * months;
    const totalEmployer = monthlyEmplrContrib * months;

    return {
      totalEmployee: Math.round(totalEmployee),
      totalEmployer: Math.round(totalEmployer),
      totalInterest: Math.round(totalInterest),
      maturityBalance: Math.round(balance),
    };
  };

  const results = calculateEPF();

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
            <Briefcase className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">EPF Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your Employees' Provident Fund corpus with both employee and employer contributions.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate Your EPF Returns</CardTitle>
            <CardDescription>
              Enter your basic salary, contribution percentages, interest rate, and tenure to see projected returns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="basic-salary">Basic Salary (₹)</Label>
                <Input
                  id="basic-salary"
                  type="number"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(e.target.value)}
                  placeholder="50000"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee-contribution">Employee Contribution (%)</Label>
                <Input
                  id="employee-contribution"
                  type="number"
                  value={employeeContribution}
                  onChange={(e) => setEmployeeContribution(e.target.value)}
                  placeholder="12"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employer-contribution">Employer Contribution (%)</Label>
                <Input
                  id="employer-contribution"
                  type="number"
                  value={employerContribution}
                  onChange={(e) => setEmployerContribution(e.target.value)}
                  placeholder="12"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                <Input
                  id="interest-rate"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="8.25"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenure">Tenure (Years)</Label>
                <Input
                  id="tenure"
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  placeholder="30"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Estimated Returns</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Employee Contribution:</span>
                  <span className="font-semibold text-lg">{formatCurrency(results.totalEmployee)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Employer Contribution:</span>
                  <span className="font-semibold text-lg">{formatCurrency(results.totalEmployer)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Interest:</span>
                  <span className="font-semibold text-lg text-primary">{formatCurrency(results.totalInterest)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Maturity Balance:</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(results.maturityBalance)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About Employees' Provident Fund (EPF)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              EPF is a retirement savings scheme for salaried employees in India. Key features include:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Mandatory for organizations with 20 or more employees</li>
              <li>Employee contributes 12% of basic salary + DA</li>
              <li>Employer contributes 12% (3.67% to EPF, 8.33% to EPS)</li>
              <li>Tax benefits under Section 80C on contributions</li>
              <li>Interest is tax-free if withdrawn after 5 years of continuous service</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              The interest rate is set by EPFO annually and compounds monthly.
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute financial advice. Interest rates are subject to change by EPFO.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

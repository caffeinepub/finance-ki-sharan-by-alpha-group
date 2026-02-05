import { useState } from 'react';
import { Building, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HRACalculatorPage() {
  const navigate = useNavigate();
  const [basicSalary, setBasicSalary] = useState<string>('50000');
  const [da, setDa] = useState<string>('5000');
  const [rentPaid, setRentPaid] = useState<string>('15000');
  const [cityType, setCityType] = useState<'metro' | 'non-metro'>('metro');

  const calculateHRA = () => {
    const basic = parseFloat(basicSalary) || 0;
    const daAmount = parseFloat(da) || 0;
    const rent = parseFloat(rentPaid) || 0;

    if (basic <= 0 || rent <= 0) {
      return { exemptHRA: 0, taxableHRA: 0 };
    }

    const totalSalary = basic + daAmount;
    const hraReceived = totalSalary * 0.5; // Assuming 50% HRA

    // HRA exemption is minimum of:
    // 1. Actual HRA received
    // 2. Rent paid minus 10% of salary
    // 3. 50% of salary (metro) or 40% of salary (non-metro)

    const option1 = hraReceived;
    const option2 = rent - (totalSalary * 0.1);
    const option3 = cityType === 'metro' ? totalSalary * 0.5 : totalSalary * 0.4;

    const exemptHRA = Math.max(0, Math.min(option1, option2, option3));
    const taxableHRA = Math.max(0, hraReceived - exemptHRA);

    return {
      exemptHRA: Math.round(exemptHRA),
      taxableHRA: Math.round(taxableHRA),
    };
  };

  const results = calculateHRA();

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
            <Building className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">HRA Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate House Rent Allowance tax exemption for salaried employees as per Indian tax laws.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate HRA Exemption</CardTitle>
            <CardDescription>
              Enter your salary details, rent paid, and city type to calculate tax-exempt HRA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="basic-salary">Basic Salary (₹/month)</Label>
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
                <Label htmlFor="da">Dearness Allowance (₹/month)</Label>
                <Input
                  id="da"
                  type="number"
                  value={da}
                  onChange={(e) => setDa(e.target.value)}
                  placeholder="5000"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rent-paid">Rent Paid (₹/month)</Label>
                <Input
                  id="rent-paid"
                  type="number"
                  value={rentPaid}
                  onChange={(e) => setRentPaid(e.target.value)}
                  placeholder="15000"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>City Type</Label>
                <Tabs value={cityType} onValueChange={(v) => setCityType(v as 'metro' | 'non-metro')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="metro">Metro City</TabsTrigger>
                    <TabsTrigger value="non-metro">Non-Metro City</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">HRA Exemption</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tax-Exempt HRA:</span>
                  <span className="font-semibold text-lg text-primary">{formatCurrency(results.exemptHRA)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taxable HRA:</span>
                  <span className="font-semibold text-lg text-destructive">{formatCurrency(results.taxableHRA)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About HRA (House Rent Allowance)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              HRA is a component of salary provided to employees for accommodation expenses. Tax exemption rules:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Exempt HRA is the minimum of three calculations</li>
              <li>Actual HRA received from employer</li>
              <li>Rent paid minus 10% of salary (Basic + DA)</li>
              <li>50% of salary for metro cities (Delhi, Mumbai, Kolkata, Chennai)</li>
              <li>40% of salary for non-metro cities</li>
              <li>Not available if living in own house</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Rent receipts and rental agreement may be required as proof for claiming HRA exemption.
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute financial advice. Consult a tax advisor for accurate calculations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

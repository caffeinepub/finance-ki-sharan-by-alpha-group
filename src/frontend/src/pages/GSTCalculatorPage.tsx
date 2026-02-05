import { useState } from 'react';
import { Receipt, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function GSTCalculatorPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>('10000');
  const [gstRate, setGstRate] = useState<string>('18');

  const calculateGST = () => {
    const baseAmount = parseFloat(amount) || 0;
    const rate = parseFloat(gstRate) || 0;

    if (baseAmount <= 0 || rate < 0) {
      return { cgst: 0, sgst: 0, totalTax: 0, afterTaxAmount: 0 };
    }

    const totalTax = (baseAmount * rate) / 100;
    const cgst = totalTax / 2;
    const sgst = totalTax / 2;
    const afterTaxAmount = baseAmount + totalTax;

    return {
      cgst: Math.round(cgst * 100) / 100,
      sgst: Math.round(sgst * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      afterTaxAmount: Math.round(afterTaxAmount * 100) / 100,
    };
  };

  const results = calculateGST();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
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
            <Receipt className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">GST Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate Goods and Services Tax with CGST and SGST breakdown for any amount.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate GST</CardTitle>
            <CardDescription>
              Enter the base amount and GST rate to see the tax breakdown and final amount.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Base Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10000"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gst-rate">GST Rate (%)</Label>
                <Input
                  id="gst-rate"
                  type="number"
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  placeholder="18"
                  min="0"
                  step="0.1"
                />
                <p className="text-xs text-muted-foreground">Common rates: 5%, 12%, 18%, 28%</p>
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">GST Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Base Amount:</span>
                  <span className="font-semibold text-lg">{formatCurrency(parseFloat(amount) || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">CGST ({gstRate ? parseFloat(gstRate) / 2 : 0}%):</span>
                  <span className="font-semibold text-lg">{formatCurrency(results.cgst)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">SGST ({gstRate ? parseFloat(gstRate) / 2 : 0}%):</span>
                  <span className="font-semibold text-lg">{formatCurrency(results.sgst)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Tax:</span>
                  <span className="font-semibold text-lg text-destructive">{formatCurrency(results.totalTax)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">After-Tax Amount:</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(results.afterTaxAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About GST (Goods and Services Tax)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              GST is an indirect tax levied on the supply of goods and services in India. Key features:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>CGST (Central GST) and SGST (State GST) each constitute 50% of total GST</li>
              <li>For inter-state transactions, IGST (Integrated GST) is applicable</li>
              <li>Standard GST rates: 5%, 12%, 18%, and 28%</li>
              <li>Essential items have 0% or 5% GST</li>
              <li>Luxury and sin goods attract 28% GST</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              This calculator shows CGST and SGST breakdown for intra-state transactions.
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute financial advice. GST rates are subject to change by the government.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

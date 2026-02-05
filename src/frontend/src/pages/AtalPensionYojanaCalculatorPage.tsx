import { useState } from 'react';
import { Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AtalPensionYojanaCalculatorPage() {
  const navigate = useNavigate();
  const [currentAge, setCurrentAge] = useState<string>('25');
  const [desiredPension, setDesiredPension] = useState<string>('5000');

  const calculateAPY = () => {
    const age = parseFloat(currentAge) || 0;
    const pension = parseFloat(desiredPension) || 0;

    if (age < 18 || age > 40 || pension <= 0) {
      return { monthlyContribution: 0, totalContribution: 0, maturityCorpus: 0 };
    }

    const yearsToRetirement = 60 - age;
    const months = yearsToRetirement * 12;

    // Simplified APY contribution matrix (approximate values)
    const contributionMatrix: { [key: string]: { [key: number]: number } } = {
      '1000': { 18: 42, 25: 76, 30: 116, 35: 181, 40: 291 },
      '2000': { 18: 84, 25: 151, 30: 231, 35: 362, 40: 582 },
      '3000': { 18: 126, 25: 226, 30: 347, 35: 543, 40: 873 },
      '4000': { 18: 168, 25: 301, 30: 462, 35: 724, 40: 1164 },
      '5000': { 18: 210, 25: 376, 30: 577, 35: 902, 40: 1454 },
    };

    let monthlyContribution = 0;
    const pensionKey = pension.toString();
    
    if (contributionMatrix[pensionKey]) {
      const ageKey = Math.min(40, Math.max(18, Math.floor(age / 5) * 5));
      monthlyContribution = contributionMatrix[pensionKey][ageKey] || 0;
    }

    const totalContribution = monthlyContribution * months;
    const maturityCorpus = pension * 12 * 20; // Approximate corpus based on 20 years of pension

    return {
      monthlyContribution: Math.round(monthlyContribution),
      totalContribution: Math.round(totalContribution),
      maturityCorpus: Math.round(maturityCorpus),
    };
  };

  const results = calculateAPY();

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
            <Users className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Atal Pension Yojana Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate monthly contributions required for your desired pension amount under APY scheme.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate APY Contribution</CardTitle>
            <CardDescription>
              Enter your current age and desired monthly pension to see required contributions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-age">Current Age</Label>
                <Input
                  id="current-age"
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                  placeholder="25"
                  min="18"
                  max="40"
                />
                <p className="text-xs text-muted-foreground">Age must be between 18 and 40 years</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desired-pension">Desired Monthly Pension (₹)</Label>
                <Select value={desiredPension} onValueChange={setDesiredPension}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pension amount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000">₹1,000</SelectItem>
                    <SelectItem value="2000">₹2,000</SelectItem>
                    <SelectItem value="3000">₹3,000</SelectItem>
                    <SelectItem value="4000">₹4,000</SelectItem>
                    <SelectItem value="5000">₹5,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Contribution Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Monthly Contribution:</span>
                  <span className="font-semibold text-lg text-primary">{formatCurrency(results.monthlyContribution)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Contribution:</span>
                  <span className="font-semibold text-lg">{formatCurrency(results.totalContribution)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Estimated Maturity Corpus:</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(results.maturityCorpus)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About Atal Pension Yojana (APY)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              APY is a government-backed pension scheme for unorganized sector workers. Key features:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Open to Indian citizens aged 18-40 years</li>
              <li>Guaranteed pension of ₹1,000 to ₹5,000 per month after 60 years</li>
              <li>Spouse receives same pension after subscriber's death</li>
              <li>Nominee receives corpus after both deaths</li>
              <li>Government co-contribution for eligible subscribers</li>
              <li>Tax benefits under Section 80CCD</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Monthly contributions depend on age at entry and desired pension amount.
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute financial advice. Contribution amounts are approximate.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

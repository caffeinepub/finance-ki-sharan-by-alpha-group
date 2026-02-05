import { useState } from 'react';
import { TrendingDown, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface CashFlow {
  id: number;
  date: string;
  amount: string;
}

export default function XIRRCalculatorPage() {
  const navigate = useNavigate();
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([
    { id: 1, date: '2024-01-01', amount: '-100000' },
    { id: 2, date: '2024-12-31', amount: '120000' },
  ]);
  const [nextId, setNextId] = useState(3);

  const addCashFlow = () => {
    setCashFlows([...cashFlows, { id: nextId, date: '', amount: '' }]);
    setNextId(nextId + 1);
  };

  const removeCashFlow = (id: number) => {
    if (cashFlows.length > 2) {
      setCashFlows(cashFlows.filter((cf) => cf.id !== id));
    }
  };

  const updateCashFlow = (id: number, field: 'date' | 'amount', value: string) => {
    setCashFlows(cashFlows.map((cf) => (cf.id === id ? { ...cf, [field]: value } : cf)));
  };

  const calculateXIRR = () => {
    const validFlows = cashFlows.filter((cf) => cf.date && cf.amount && !isNaN(parseFloat(cf.amount)));
    
    if (validFlows.length < 2) {
      return null;
    }

    // Simple XIRR approximation using Newton-Raphson method
    const dates = validFlows.map((cf) => new Date(cf.date).getTime());
    const amounts = validFlows.map((cf) => parseFloat(cf.amount));
    const firstDate = Math.min(...dates);

    const npv = (rate: number) => {
      return amounts.reduce((sum, amount, i) => {
        const days = (dates[i] - firstDate) / (1000 * 60 * 60 * 24);
        return sum + amount / Math.pow(1 + rate, days / 365);
      }, 0);
    };

    let guess = 0.1;
    const maxIterations = 100;
    const tolerance = 0.0001;

    for (let i = 0; i < maxIterations; i++) {
      const npvValue = npv(guess);
      if (Math.abs(npvValue) < tolerance) break;

      const delta = 0.0001;
      const derivative = (npv(guess + delta) - npvValue) / delta;
      guess = guess - npvValue / derivative;

      if (guess < -0.99) guess = -0.99;
      if (guess > 10) guess = 10;
    }

    return (guess * 100).toFixed(2);
  };

  const xirr = calculateXIRR();

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
            <TrendingDown className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">XIRR Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate Extended Internal Rate of Return for irregular cash flows with specific dates.
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Calculate XIRR</CardTitle>
            <CardDescription>
              Enter multiple cash flows with dates. Use negative values for investments and positive for returns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {cashFlows.map((cf, index) => (
                <div key={cf.id} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`date-${cf.id}`}>Date {index + 1}</Label>
                    <Input
                      id={`date-${cf.id}`}
                      type="date"
                      value={cf.date}
                      onChange={(e) => updateCashFlow(cf.id, 'date', e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`amount-${cf.id}`}>Amount (₹)</Label>
                    <Input
                      id={`amount-${cf.id}`}
                      type="number"
                      value={cf.amount}
                      onChange={(e) => updateCashFlow(cf.id, 'amount', e.target.value)}
                      placeholder="-100000"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCashFlow(cf.id)}
                    disabled={cashFlows.length <= 2}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addCashFlow} variant="outline" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add Cash Flow
              </Button>
            </div>

            <div className="space-y-3 rounded-lg bg-muted/50 p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Result</h3>
              <div className="flex justify-between items-center">
                <span className="font-medium">Annualized Return (XIRR):</span>
                <span className="text-2xl font-bold text-primary">
                  {xirr !== null ? `${xirr}%` : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">About XIRR (Extended Internal Rate of Return)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              XIRR calculates the annualized rate of return for investments with irregular cash flows. Key features:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Accounts for the timing of each cash flow</li>
              <li>Useful for SIPs, mutual funds, and irregular investments</li>
              <li>More accurate than simple CAGR for non-uniform investments</li>
              <li>Negative values represent investments (outflows)</li>
              <li>Positive values represent returns (inflows)</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              XIRR is calculated using the Newton-Raphson iterative method to find the rate that makes NPV zero.
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute financial advice. XIRR calculations are approximations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

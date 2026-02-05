import { Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatINR } from '@/utils/formatters';
import { arrayToCSV, downloadCSV } from '@/utils/csv';

export interface CashFlowRow {
  label: string;
  amount: number;
  runningBalance?: number;
}

interface CashFlowSectionProps {
  title?: string;
  description?: string;
  rows: CashFlowRow[];
  showRunningBalance?: boolean;
  csvFilename?: string;
}

export default function CashFlowSection({
  title = 'Cash Flow Schedule',
  description = 'Detailed breakdown of cash inflows and outflows over time',
  rows,
  showRunningBalance = false,
  csvFilename = 'cash-flow-schedule.csv',
}: CashFlowSectionProps) {
  const handleDownloadCSV = () => {
    if (rows.length === 0) return;

    const headers = showRunningBalance
      ? ['Period', 'Amount (₹)', 'Running Balance (₹)']
      : ['Period', 'Amount (₹)'];

    const dataRows = rows.map(row =>
      showRunningBalance && row.runningBalance !== undefined
        ? [row.label, row.amount, row.runningBalance]
        : [row.label, row.amount]
    );

    const csvContent = arrayToCSV([headers, ...dataRows]);
    downloadCSV(csvContent, csvFilename);
  };

  // Empty state
  if (rows.length === 0) {
    return (
      <Card className="border-muted">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Cash flow schedule is not applicable for this calculator.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-muted">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCSV}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                {showRunningBalance && (
                  <TableHead className="text-right">Running Balance</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell
                    className={`text-right font-mono ${
                      row.amount < 0
                        ? 'text-destructive'
                        : row.amount > 0
                        ? 'text-primary'
                        : ''
                    }`}
                  >
                    {formatINR(row.amount)}
                  </TableCell>
                  {showRunningBalance && (
                    <TableCell className="text-right font-mono">
                      {row.runningBalance !== undefined
                        ? formatINR(row.runningBalance)
                        : '-'}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            <span className="text-destructive font-semibold">Negative values</span>{' '}
            represent outflows (investments/payments).{' '}
            <span className="text-primary font-semibold">Positive values</span>{' '}
            represent inflows (returns/receipts).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatINR } from '@/utils/formatters';

interface ResultBreakdownPieChartProps {
  invested: number;
  earned: number;
  total?: number;
  investedLabel?: string;
  earnedLabel?: string;
  totalLabel?: string;
}

export default function ResultBreakdownPieChart({
  invested,
  earned,
  total,
  investedLabel = 'Invested Amount',
  earnedLabel = 'Interest/Returns Earned',
  totalLabel = 'Total Corpus',
}: ResultBreakdownPieChartProps) {
  // Handle zero/empty state
  const hasData = invested > 0 || earned > 0 || (total && total > 0);
  
  if (!hasData) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Investment Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
            Enter valid inputs to see the breakdown chart
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate percentages based on invested + earned
  const totalAmount = invested + earned;
  const investedPercentage = totalAmount > 0 ? (invested / totalAmount) * 100 : 0;
  const earnedPercentage = totalAmount > 0 ? (earned / totalAmount) * 100 : 0;

  // SVG donut chart parameters
  const size = 240;
  const strokeWidth = 50;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate stroke dash arrays for donut segments
  const investedDashArray = (investedPercentage / 100) * circumference;
  const earnedDashArray = (earnedPercentage / 100) * circumference;
  
  // Rotation offset for second segment
  const investedRotation = -90; // Start at top
  const earnedRotation = investedRotation + (investedPercentage / 100) * 360;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg">Investment Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pie Chart */}
        <div className="flex flex-col items-center justify-center">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth={strokeWidth}
            />
            
            {/* Invested segment */}
            {invested > 0 && (
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="hsl(var(--chart-1))"
                strokeWidth={strokeWidth}
                strokeDasharray={`${investedDashArray} ${circumference}`}
                strokeLinecap="round"
                style={{
                  transform: `rotate(${investedRotation}deg)`,
                  transformOrigin: 'center',
                  transition: 'stroke-dasharray 0.5s ease-out',
                }}
              />
            )}
            
            {/* Earned segment */}
            {earned > 0 && (
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="hsl(var(--chart-2))"
                strokeWidth={strokeWidth}
                strokeDasharray={`${earnedDashArray} ${circumference}`}
                strokeLinecap="round"
                style={{
                  transform: `rotate(${earnedRotation}deg)`,
                  transformOrigin: 'center',
                  transition: 'stroke-dasharray 0.5s ease-out',
                }}
              />
            )}
          </svg>
          
          {/* Center text showing total */}
          {total !== undefined && total > 0 && (
            <div className="absolute flex flex-col items-center justify-center">
              <div className="text-xs text-muted-foreground font-medium">{totalLabel}</div>
              <div className="text-xl font-bold text-primary">{formatINR(total)}</div>
            </div>
          )}
        </div>

        {/* Legend with values */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-sm bg-chart-1 flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">{investedLabel}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">{formatINR(invested)}</span>
              <span className="text-xs text-muted-foreground min-w-[3rem] text-right">
                {investedPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-sm bg-chart-2 flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">{earnedLabel}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-primary">{formatINR(earned)}</span>
              <span className="text-xs text-muted-foreground min-w-[3rem] text-right">
                {earnedPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

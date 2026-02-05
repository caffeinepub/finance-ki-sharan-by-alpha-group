import { Calculator, TrendingUp, IndianRupee, ArrowUpCircle, ArrowDownCircle, Heart, PiggyBank, Briefcase, Building2, Repeat, Home, Receipt, TrendingDown, BarChart3, Award, Building, Shield, Landmark, Percent, Users, Scale, HomeIcon } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function CalculatorsPage() {
  const navigate = useNavigate();

  const calculatorCategories = [
    {
      category: 'Investment & Wealth',
      description: 'Plan and track your investment growth with various strategies',
      calculators: [
        {
          title: 'SIP Calculator',
          description: 'Calculate returns on your Systematic Investment Plan with regular monthly investments.',
          icon: TrendingUp,
          path: '/calculators/sip',
          color: 'text-blue-500',
        },
        {
          title: 'Lump Sum Calculator',
          description: 'Estimate the future value of a one-time investment with compound interest.',
          icon: IndianRupee,
          path: '/calculators/lumpsum',
          color: 'text-green-500',
        },
        {
          title: 'Step-Up Calculator',
          description: 'Plan investments with annual increases by amount or percentage.',
          icon: ArrowUpCircle,
          path: '/calculators/stepup',
          color: 'text-purple-500',
        },
        {
          title: 'SWP Calculator',
          description: 'Plan systematic withdrawals from your investments with regular income.',
          icon: ArrowDownCircle,
          path: '/calculators/swp',
          color: 'text-orange-500',
        },
        {
          title: 'XIRR Calculator',
          description: 'Calculate annualized returns for irregular cash flows with dates.',
          icon: TrendingDown,
          path: '/calculators/xirr',
          color: 'text-violet-500',
        },
        {
          title: 'CAGR Calculator',
          description: 'Calculate Compound Annual Growth Rate for your investments.',
          icon: BarChart3,
          path: '/calculators/cagr',
          color: 'text-fuchsia-500',
        },
        {
          title: 'Simple vs Compound Interest Calculator',
          description: 'Compare simple and compound interest calculations side by side.',
          icon: TrendingUp,
          path: '/calculators/simple-vs-compound-interest',
          color: 'text-pink-400',
        },
      ],
    },
    {
      category: 'Retirement & Pension',
      description: 'Secure your retirement with pension and gratuity planning',
      calculators: [
        {
          title: 'NPS Calculator',
          description: 'Calculate National Pension System corpus and monthly pension.',
          icon: Shield,
          path: '/calculators/nps',
          color: 'text-lime-500',
        },
        {
          title: 'Atal Pension Yojana Calculator',
          description: 'Calculate monthly contributions for desired pension amount.',
          icon: Users,
          path: '/calculators/atal-pension-yojana',
          color: 'text-green-400',
        },
        {
          title: 'Gratuity Calculator',
          description: 'Calculate gratuity amount as per Indian labor laws.',
          icon: Award,
          path: '/calculators/gratuity',
          color: 'text-rose-500',
        },
      ],
    },
    {
      category: 'Small Savings & Govt Schemes',
      description: 'Explore government-backed savings schemes and benefits',
      calculators: [
        {
          title: 'PPF Calculator',
          description: 'Calculate Public Provident Fund returns with tax-free interest.',
          icon: PiggyBank,
          path: '/calculators/ppf',
          color: 'text-cyan-500',
        },
        {
          title: 'EPF Calculator',
          description: 'Calculate Employees\' Provident Fund with employer contributions.',
          icon: Briefcase,
          path: '/calculators/epf',
          color: 'text-indigo-500',
        },
        {
          title: 'SSY Calculator',
          description: 'Calculate Sukanya Samriddhi Yojana returns for your daughter\'s future.',
          icon: Heart,
          path: '/calculators/ssy',
          color: 'text-pink-500',
        },
        {
          title: 'NSC Calculator',
          description: 'Calculate National Savings Certificate returns with fixed interest.',
          icon: Landmark,
          path: '/calculators/nsc',
          color: 'text-sky-500',
        },
      ],
    },
    {
      category: 'Bank Deposits & Interest',
      description: 'Calculate returns on fixed and recurring deposits',
      calculators: [
        {
          title: 'FD Calculator',
          description: 'Calculate Fixed Deposit returns with simple or compound interest.',
          icon: Building2,
          path: '/calculators/fd',
          color: 'text-emerald-500',
        },
        {
          title: 'RD Calculator',
          description: 'Calculate Recurring Deposit returns with monthly investments.',
          icon: Repeat,
          path: '/calculators/rd',
          color: 'text-teal-500',
        },
        {
          title: 'Simple Interest Calculator',
          description: 'Calculate simple interest on principal amount over time.',
          icon: Percent,
          path: '/calculators/simple-interest',
          color: 'text-blue-400',
        },
      ],
    },
    {
      category: 'Loans & EMI',
      description: 'Plan your loan repayments and compare loan options',
      calculators: [
        {
          title: 'EMI Calculator',
          description: 'Calculate monthly loan installments with total interest payable.',
          icon: Home,
          path: '/calculators/emi',
          color: 'text-red-500',
        },
        {
          title: 'Home Loan EMI Calculator',
          description: 'Calculate home loan EMI with detailed amortization schedule.',
          icon: HomeIcon,
          path: '/calculators/home-loan-emi',
          color: 'text-orange-400',
        },
        {
          title: 'Fixed vs Reducing Loan Calculator',
          description: 'Compare fixed interest and reducing balance loan methods.',
          icon: Scale,
          path: '/calculators/fixed-vs-reducing-loan',
          color: 'text-purple-400',
        },
      ],
    },
    {
      category: 'Tax & Salary',
      description: 'Calculate tax implications and salary components',
      calculators: [
        {
          title: 'GST Calculator',
          description: 'Calculate GST with CGST and SGST breakdown for any amount.',
          icon: Receipt,
          path: '/calculators/gst',
          color: 'text-yellow-500',
        },
        {
          title: 'HRA Calculator',
          description: 'Calculate House Rent Allowance tax exemption for salaried employees.',
          icon: Building,
          path: '/calculators/hra',
          color: 'text-amber-500',
        },
      ],
    },
  ];

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Calculator className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Financial Calculators</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plan your investments with our comprehensive suite of financial calculators. Get instant estimates to make informed financial decisions.
          </p>
        </div>

        {/* Calculator Categories */}
        {calculatorCategories.map((categoryGroup, index) => (
          <div key={categoryGroup.category} className="space-y-6">
            {index > 0 && <Separator className="my-8" />}
            
            {/* Category Header */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">{categoryGroup.category}</h2>
              <p className="text-muted-foreground">{categoryGroup.description}</p>
            </div>

            {/* Calculators Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryGroup.calculators.map((calc) => {
                const Icon = calc.icon;
                return (
                  <Card key={calc.path} className="border-primary/20 hover:border-primary/40 transition-colors">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`h-6 w-6 ${calc.color}`} />
                        <CardTitle className="text-lg">{calc.title}</CardTitle>
                      </div>
                      <CardDescription className="text-sm leading-relaxed">
                        {calc.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => navigate({ to: calc.path })}
                        className="w-full"
                        variant="default"
                      >
                        Open Calculator
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {/* Information Section */}
        <Card className="border-primary/20 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">Why Use Financial Calculators?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Plan Better</h3>
                <p className="text-sm text-muted-foreground">
                  Understand how your investments can grow over time and set realistic financial goals based on accurate projections.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Compare Options</h3>
                <p className="text-sm text-muted-foreground">
                  Evaluate different investment strategies and amounts to find the approach that best suits your financial situation.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Make Informed Decisions</h3>
                <p className="text-sm text-muted-foreground">
                  Use data-driven insights to choose investment plans that align with your risk tolerance and financial objectives.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Regularly calculate your expected returns to stay motivated and adjust your investment strategy as needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> These calculators provide estimates based on the inputs provided. Actual returns may vary depending on market conditions and fund performance. This information is for educational purposes only and does not constitute financial advice.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Moon, Sun, Menu, LogIn, LogOut, ChevronDown, MessageSquare } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import BrandLogo from './BrandLogo';
import { BRAND_NAME, BRAND_TAGLINE } from '@/utils/assetPaths';
import { NAV_STRUCTURE } from '@/utils/navStructure';
import { openFeedbackForm } from '@/utils/feedbackForm';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();

  const currentPath = routerState.location.pathname;
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const calculatorItems = [
    { label: 'All Calculators', path: '/calculators' },
    { label: 'SIP Calculator', path: '/calculators/sip' },
    { label: 'Lump Sum Calculator', path: '/calculators/lumpsum' },
    { label: 'Step-Up Calculator', path: '/calculators/stepup' },
    { label: 'SWP Calculator', path: '/calculators/swp' },
    { label: 'SSY Calculator', path: '/calculators/ssy' },
    { label: 'PPF Calculator', path: '/calculators/ppf' },
    { label: 'EPF Calculator', path: '/calculators/epf' },
    { label: 'FD Calculator', path: '/calculators/fd' },
    { label: 'RD Calculator', path: '/calculators/rd' },
    { label: 'EMI Calculator', path: '/calculators/emi' },
    { label: 'GST Calculator', path: '/calculators/gst' },
    { label: 'XIRR Calculator', path: '/calculators/xirr' },
    { label: 'CAGR Calculator', path: '/calculators/cagr' },
    { label: 'Gratuity Calculator', path: '/calculators/gratuity' },
    { label: 'HRA Calculator', path: '/calculators/hra' },
    { label: 'NPS Calculator', path: '/calculators/nps' },
    { label: 'NSC Calculator', path: '/calculators/nsc' },
    { label: 'Simple Interest Calculator', path: '/calculators/simple-interest' },
    { label: 'Atal Pension Yojana Calculator', path: '/calculators/atal-pension-yojana' },
    { label: 'Fixed vs Reducing Loan Calculator', path: '/calculators/fixed-vs-reducing-loan' },
    { label: 'Home Loan EMI Calculator', path: '/calculators/home-loan-emi' },
    { label: 'Simple vs Compound Interest Calculator', path: '/calculators/simple-vs-compound-interest' },
  ];

  const adminItems = [
    { label: 'Admin Feedback', path: '/admin/feedback' },
  ];

  const handleNavigate = (path: string, hash?: string, query?: Record<string, string>) => {
    const searchParams = query ? new URLSearchParams(query).toString() : '';
    const fullPath = `${path}${searchParams ? `?${searchParams}` : ''}${hash ? `#${hash}` : ''}`;
    
    navigate({ to: path, search: query as any });
    
    // Handle hash navigation after route change
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    
    setIsOpen(false);
  };

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleFeedbackClick = () => {
    openFeedbackForm();
    setIsOpen(false);
  };

  const isCalculatorPath = currentPath.startsWith('/calculators');

  // Check if current path matches any nav item
  const isNavItemActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <button
          onClick={() => handleNavigate('/')}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <BrandLogo className="h-10 w-auto" />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-tight text-primary">{BRAND_NAME}</h1>
            <p className="text-xs text-muted-foreground">{BRAND_TAGLINE}</p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_STRUCTURE.map((group) => {
            const hasActiveItem = group.items.some(item => isNavItemActive(item.path));
            
            return (
              <DropdownMenu key={group.label}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                      hasActiveItem ? 'text-primary' : 'text-foreground/80'
                    }`}
                  >
                    {group.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {group.items.map((item) => (
                    <DropdownMenuItem
                      key={`${item.path}-${item.hash || ''}-${JSON.stringify(item.query || {})}`}
                      onClick={() => handleNavigate(item.path, item.hash, item.query)}
                      className="cursor-pointer"
                    >
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}

          {/* Tools dropdown with calculators */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  isCalculatorPath ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                Calculators
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 max-h-[500px]">
              <ScrollArea className="h-full">
                {calculatorItems.map((item) => (
                  <DropdownMenuItem
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className="cursor-pointer"
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Feedback Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleFeedbackClick}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Feedback
          </Button>

          {isAuthenticated && adminItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPath === item.path ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant={isAuthenticated ? "outline" : "default"}
            size="sm"
            onClick={handleAuth}
            disabled={isLoggingIn}
            className="hidden lg:flex"
          >
            {isLoggingIn ? (
              'Logging in...'
            ) : isAuthenticated ? (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </>
            )}
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <ScrollArea className="h-full pr-4">
                <nav className="flex flex-col gap-4 mt-8">
                  {NAV_STRUCTURE.map((group) => (
                    <div key={group.label} className="flex flex-col gap-2">
                      <div className="text-lg font-semibold text-foreground">
                        {group.label}
                      </div>
                      <div className="flex flex-col gap-2 pl-4">
                        {group.items.map((item) => {
                          const isActive = isNavItemActive(item.path);
                          return (
                            <button
                              key={`${item.path}-${item.hash || ''}-${JSON.stringify(item.query || {})}`}
                              onClick={() => handleNavigate(item.path, item.hash, item.query)}
                              className={`text-left text-base font-medium transition-colors hover:text-primary ${
                                isActive ? 'text-primary' : 'text-foreground/80'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <Separator className="my-2" />

                  <div className="flex flex-col gap-2">
                    <div className={`text-lg font-semibold ${isCalculatorPath ? 'text-primary' : 'text-foreground'}`}>
                      Calculators
                    </div>
                    <div className="flex flex-col gap-2 pl-4">
                      {calculatorItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => handleNavigate(item.path)}
                          className={`text-left text-base font-medium transition-colors hover:text-primary ${
                            currentPath === item.path ? 'text-primary' : 'text-foreground/80'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-2" />

                  {/* Feedback Button in Mobile Menu */}
                  <Button
                    variant="outline"
                    onClick={handleFeedbackClick}
                    className="w-full gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Feedback
                  </Button>

                  {isAuthenticated && (
                    <>
                      <Separator className="my-2" />
                      <div className="text-sm font-semibold text-muted-foreground">Admin</div>
                      {adminItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => handleNavigate(item.path)}
                          className={`text-left text-lg font-medium transition-colors hover:text-primary ${
                            currentPath === item.path ? 'text-primary' : 'text-foreground/80'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </>
                  )}

                  <Separator className="my-2" />
                  
                  <Button
                    variant={isAuthenticated ? "outline" : "default"}
                    onClick={handleAuth}
                    disabled={isLoggingIn}
                    className="w-full"
                  >
                    {isLoggingIn ? (
                      'Logging in...'
                    ) : isAuthenticated ? (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </>
                    )}
                  </Button>
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

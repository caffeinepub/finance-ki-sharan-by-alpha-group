import { Heart, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useGetNifty50Stocks, useIsMarketOpen } from '../hooks/useQueries';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function Footer() {
  const navigate = useNavigate();
  const { data: stocksData, isLoading: isStocksLoading, isError: isStocksError } = useGetNifty50Stocks();
  const { data: isMarketOpen = false } = useIsMarketOpen();

  // Determine market status text
  const getMarketStatusLabel = () => {
    if (isMarketOpen) {
      return 'Live Market Ticker: NIFTY 50 LTP';
    }
    return 'Market Ticker: NIFTY 50 Closing Prices';
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  // Get price label based on market status
  const getPriceLabel = () => {
    return isMarketOpen ? 'LTP' : 'Close';
  };

  // Get the appropriate price based on market status
  const getDisplayPrice = (stock: { ltp: number; dayClose: number }) => {
    return isMarketOpen ? stock.ltp : stock.dayClose;
  };

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      {/* Market Ticker Section */}
      <div className="border-b border-border/40 bg-background/50">
        <div className="container py-4">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                {getMarketStatusLabel()}
              </h3>
              {!isMarketOpen && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 border border-border/40">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Closed
                  </span>
                </div>
              )}
              {isMarketOpen && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20">
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs text-accent font-medium">
                    Live
                  </span>
                </div>
              )}
            </div>

            {/* Stock Ticker Display */}
            {isStocksLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : isStocksError ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Market data temporarily unavailable
                </p>
              </div>
            ) : stocksData && stocksData.length > 0 ? (
              <ScrollArea className="w-full whitespace-nowrap rounded-lg border border-border/40 bg-card/50">
                <div className="flex gap-4 p-4">
                  {stocksData.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex flex-col gap-1 min-w-[140px] px-3 py-2 rounded-md bg-background/80 border border-border/40 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {stock.companyName}
                        </span>
                        <span className="text-[10px] font-medium text-muted-foreground px-1.5 py-0.5 rounded bg-muted/50">
                          {getPriceLabel()}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-primary">
                          {formatPrice(getDisplayPrice(stock))}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {stock.symbol}
                      </span>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No stock data available
                </p>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-xs text-center text-muted-foreground italic">
                Market prices are for educational purposes only and may be delayed.
              </p>
              {!isMarketOpen && (
                <p className="text-xs text-center text-muted-foreground font-medium">
                  Showing closing prices — market closed.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/generated/logo-finance-ki-sharan-transparent.dim_200x100.png" 
                alt="Finance Ki Sharan Logo" 
                className="h-8 w-auto"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">Finance Ki Sharan</p>
                <p className="text-xs text-muted-foreground">By Alpha Group</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Simplifying finance for everyone through accessible education.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-foreground">Learn</h3>
            <button
              onClick={() => navigate({ to: '/learning' })}
              className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
            >
              Financial Learning
            </button>
            <button
              onClick={() => navigate({ to: '/glossary' })}
              className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
            >
              Glossary
            </button>
            <button
              onClick={() => navigate({ to: '/articles' })}
              className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
            >
              Articles
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <button
              onClick={() => navigate({ to: '/research' })}
              className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
            >
              Research Papers
            </button>
            <button
              onClick={() => navigate({ to: '/calculators' })}
              className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
            >
              Calculators
            </button>
            <button
              onClick={() => navigate({ to: '/regulations' })}
              className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
            >
              Regulations
            </button>
            <button
              onClick={() => navigate({ to: '/disclaimer' })}
              className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
            >
              Disclaimer
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <button
              onClick={() => navigate({ to: '/about' })}
              className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
            >
              About Us
            </button>
            <button
              onClick={() => navigate({ to: '/contact' })}
              className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
            >
              Contact
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col items-center gap-2 text-center">
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            © 2026. Built with{' '}
            <Heart className="h-3 w-3 fill-primary text-primary" />{' '}
            using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

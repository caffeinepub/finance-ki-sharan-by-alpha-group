import { Heart, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useGetNifty50Stocks, useIsMarketOpen } from '../hooks/useQueries';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { openFeedbackForm } from '@/utils/feedbackForm';

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
                      className="flex flex-col gap-1 min-w-[140px] px-3 py-2 rounded-md bg-background/80 border border-border/40"
                    >
                      <div className="text-xs font-semibold text-muted-foreground">
                        {stock.symbol}
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {formatPrice(getDisplayPrice(stock))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stock.companyName}
                      </div>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">
                  No market data available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Finance Ki Sharan</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted companion for financial education and awareness. Empowering you to make informed financial decisions.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Learn</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate({ to: '/glossary' })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Glossary
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ to: '/learning' })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Learning
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ to: '/articles' })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Articles
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ to: '/blogs' })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Blogs
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate({ to: '/research-papers' })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Research Papers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ to: '/regulations' })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Regulations
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ to: '/calculators' })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Calculators
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate({ to: '/about' })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ to: '/contact' })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={openFeedbackForm}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Feedback
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ to: '/disclaimer' })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">
              © 2026. Built with <Heart className="inline h-4 w-4 text-primary fill-primary" /> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
            <p className="text-xs text-muted-foreground">
              For educational purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MaintenanceScreen from './components/MaintenanceScreen';
import AsyncChatAssistantWidget from './components/AsyncChatAssistantWidget';
import RouteLoadingFallback from './components/RouteLoadingFallback';
import { Toaster } from '@/components/ui/sonner';
import HomePage from './pages/HomePage';
import { useIsMaintenanceMode, useIsCallerAdmin } from './hooks/useQueries';
import { useInternetIdentity } from './hooks/useInternetIdentity';

// Lazy load all non-home pages
const LearningPage = lazy(() => import('./pages/LearningPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const ResearchPapersPage = lazy(() => import('./pages/ResearchPapersPage'));
const BlogsPage = lazy(() => import('./pages/BlogsPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const CalculatorsPage = lazy(() => import('./pages/CalculatorsPage'));
const SIPCalculatorPage = lazy(() => import('./pages/SIPCalculatorPage'));
const LumpSumCalculatorPage = lazy(() => import('./pages/LumpSumCalculatorPage'));
const StepUpCalculatorPage = lazy(() => import('./pages/StepUpCalculatorPage'));
const SWPCalculatorPage = lazy(() => import('./pages/SWPCalculatorPage'));
const SSYCalculatorPage = lazy(() => import('./pages/SSYCalculatorPage'));
const PPFCalculatorPage = lazy(() => import('./pages/PPFCalculatorPage'));
const EPFCalculatorPage = lazy(() => import('./pages/EPFCalculatorPage'));
const FDCalculatorPage = lazy(() => import('./pages/FDCalculatorPage'));
const RDCalculatorPage = lazy(() => import('./pages/RDCalculatorPage'));
const EMICalculatorPage = lazy(() => import('./pages/EMICalculatorPage'));
const GSTCalculatorPage = lazy(() => import('./pages/GSTCalculatorPage'));
const XIRRCalculatorPage = lazy(() => import('./pages/XIRRCalculatorPage'));
const CAGRCalculatorPage = lazy(() => import('./pages/CAGRCalculatorPage'));
const GratuityCalculatorPage = lazy(() => import('./pages/GratuityCalculatorPage'));
const HRACalculatorPage = lazy(() => import('./pages/HRACalculatorPage'));
const NPSCalculatorPage = lazy(() => import('./pages/NPSCalculatorPage'));
const NSCCalculatorPage = lazy(() => import('./pages/NSCCalculatorPage'));
const SimpleInterestCalculatorPage = lazy(() => import('./pages/SimpleInterestCalculatorPage'));
const AtalPensionYojanaCalculatorPage = lazy(() => import('./pages/AtalPensionYojanaCalculatorPage'));
const FixedVsReducingLoanCalculatorPage = lazy(() => import('./pages/FixedVsReducingLoanCalculatorPage'));
const HomeLoanEMICalculatorPage = lazy(() => import('./pages/HomeLoanEMICalculatorPage'));
const SimpleVsCompoundInterestCalculatorPage = lazy(() => import('./pages/SimpleVsCompoundInterestCalculatorPage'));
const RegulationsPage = lazy(() => import('./pages/RegulationsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'));
const FeedbackAdminPage = lazy(() => import('./pages/FeedbackAdminPage'));

// Configure QueryClient with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

function MaintenanceWrapper() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isMaintenanceMode, isLoading: maintenanceLoading } = useIsMaintenanceMode();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  // Show loading state while checking maintenance mode and admin status
  if (isInitializing || maintenanceLoading || (identity && adminLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show maintenance screen if maintenance mode is enabled and user is not admin
  if (isMaintenanceMode && !isAdmin) {
    return <MaintenanceScreen />;
  }

  // Show normal app layout with async chat widget
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AsyncChatAssistantWidget />
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: MaintenanceWrapper,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

// Wrap lazy components with Suspense fallback
const createLazyRoute = (path: string, Component: React.LazyExoticComponent<React.ComponentType>) => {
  return createRoute({
    getParentRoute: () => rootRoute,
    path,
    component: () => (
      <Suspense fallback={<RouteLoadingFallback />}>
        <Component />
      </Suspense>
    ),
  });
};

const learningRoute = createLazyRoute('/learning', LearningPage);
const glossaryRoute = createLazyRoute('/glossary', GlossaryPage);
const articlesRoute = createLazyRoute('/articles', ArticlesPage);
const researchRoute = createLazyRoute('/research', ResearchPapersPage);
const blogsRoute = createLazyRoute('/blogs', BlogsPage);
const blogDetailRoute = createLazyRoute('/blogs/$id', BlogDetailPage);
const calculatorsRoute = createLazyRoute('/calculators', CalculatorsPage);
const sipCalculatorRoute = createLazyRoute('/calculators/sip', SIPCalculatorPage);
const lumpSumCalculatorRoute = createLazyRoute('/calculators/lumpsum', LumpSumCalculatorPage);
const stepUpCalculatorRoute = createLazyRoute('/calculators/stepup', StepUpCalculatorPage);
const swpCalculatorRoute = createLazyRoute('/calculators/swp', SWPCalculatorPage);
const ssyCalculatorRoute = createLazyRoute('/calculators/ssy', SSYCalculatorPage);
const ppfCalculatorRoute = createLazyRoute('/calculators/ppf', PPFCalculatorPage);
const epfCalculatorRoute = createLazyRoute('/calculators/epf', EPFCalculatorPage);
const fdCalculatorRoute = createLazyRoute('/calculators/fd', FDCalculatorPage);
const rdCalculatorRoute = createLazyRoute('/calculators/rd', RDCalculatorPage);
const emiCalculatorRoute = createLazyRoute('/calculators/emi', EMICalculatorPage);
const gstCalculatorRoute = createLazyRoute('/calculators/gst', GSTCalculatorPage);
const xirrCalculatorRoute = createLazyRoute('/calculators/xirr', XIRRCalculatorPage);
const cagrCalculatorRoute = createLazyRoute('/calculators/cagr', CAGRCalculatorPage);
const gratuityCalculatorRoute = createLazyRoute('/calculators/gratuity', GratuityCalculatorPage);
const hraCalculatorRoute = createLazyRoute('/calculators/hra', HRACalculatorPage);
const npsCalculatorRoute = createLazyRoute('/calculators/nps', NPSCalculatorPage);
const nscCalculatorRoute = createLazyRoute('/calculators/nsc', NSCCalculatorPage);
const simpleInterestCalculatorRoute = createLazyRoute('/calculators/simple-interest', SimpleInterestCalculatorPage);
const atalPensionYojanaCalculatorRoute = createLazyRoute('/calculators/atal-pension-yojana', AtalPensionYojanaCalculatorPage);
const fixedVsReducingLoanCalculatorRoute = createLazyRoute('/calculators/fixed-vs-reducing-loan', FixedVsReducingLoanCalculatorPage);
const homeLoanEMICalculatorRoute = createLazyRoute('/calculators/home-loan-emi', HomeLoanEMICalculatorPage);
const simpleVsCompoundInterestCalculatorRoute = createLazyRoute('/calculators/simple-vs-compound-interest', SimpleVsCompoundInterestCalculatorPage);
const regulationsRoute = createLazyRoute('/regulations', RegulationsPage);
const aboutRoute = createLazyRoute('/about', AboutPage);
const contactRoute = createLazyRoute('/contact', ContactPage);
const disclaimerRoute = createLazyRoute('/disclaimer', DisclaimerPage);
const feedbackAdminRoute = createLazyRoute('/admin/feedback', FeedbackAdminPage);

const routeTree = rootRoute.addChildren([
  indexRoute,
  learningRoute,
  glossaryRoute,
  articlesRoute,
  researchRoute,
  blogsRoute,
  blogDetailRoute,
  calculatorsRoute,
  sipCalculatorRoute,
  lumpSumCalculatorRoute,
  stepUpCalculatorRoute,
  swpCalculatorRoute,
  ssyCalculatorRoute,
  ppfCalculatorRoute,
  epfCalculatorRoute,
  fdCalculatorRoute,
  rdCalculatorRoute,
  emiCalculatorRoute,
  gstCalculatorRoute,
  xirrCalculatorRoute,
  cagrCalculatorRoute,
  gratuityCalculatorRoute,
  hraCalculatorRoute,
  npsCalculatorRoute,
  nscCalculatorRoute,
  simpleInterestCalculatorRoute,
  atalPensionYojanaCalculatorRoute,
  fixedVsReducingLoanCalculatorRoute,
  homeLoanEMICalculatorRoute,
  simpleVsCompoundInterestCalculatorRoute,
  regulationsRoute,
  aboutRoute,
  contactRoute,
  disclaimerRoute,
  feedbackAdminRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

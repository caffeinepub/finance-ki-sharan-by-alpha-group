import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import MaintenanceScreen from './components/MaintenanceScreen';
import ChatAssistantWidget from './components/ChatAssistantWidget';
import { Toaster } from '@/components/ui/sonner';
import HomePage from './pages/HomePage';
import LearningPage from './pages/LearningPage';
import GlossaryPage from './pages/GlossaryPage';
import ArticlesPage from './pages/ArticlesPage';
import ResearchPapersPage from './pages/ResearchPapersPage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CalculatorsPage from './pages/CalculatorsPage';
import SIPCalculatorPage from './pages/SIPCalculatorPage';
import LumpSumCalculatorPage from './pages/LumpSumCalculatorPage';
import StepUpCalculatorPage from './pages/StepUpCalculatorPage';
import SWPCalculatorPage from './pages/SWPCalculatorPage';
import SSYCalculatorPage from './pages/SSYCalculatorPage';
import PPFCalculatorPage from './pages/PPFCalculatorPage';
import EPFCalculatorPage from './pages/EPFCalculatorPage';
import FDCalculatorPage from './pages/FDCalculatorPage';
import RDCalculatorPage from './pages/RDCalculatorPage';
import EMICalculatorPage from './pages/EMICalculatorPage';
import GSTCalculatorPage from './pages/GSTCalculatorPage';
import XIRRCalculatorPage from './pages/XIRRCalculatorPage';
import CAGRCalculatorPage from './pages/CAGRCalculatorPage';
import GratuityCalculatorPage from './pages/GratuityCalculatorPage';
import HRACalculatorPage from './pages/HRACalculatorPage';
import NPSCalculatorPage from './pages/NPSCalculatorPage';
import NSCCalculatorPage from './pages/NSCCalculatorPage';
import SimpleInterestCalculatorPage from './pages/SimpleInterestCalculatorPage';
import AtalPensionYojanaCalculatorPage from './pages/AtalPensionYojanaCalculatorPage';
import FixedVsReducingLoanCalculatorPage from './pages/FixedVsReducingLoanCalculatorPage';
import HomeLoanEMICalculatorPage from './pages/HomeLoanEMICalculatorPage';
import SimpleVsCompoundInterestCalculatorPage from './pages/SimpleVsCompoundInterestCalculatorPage';
import RegulationsPage from './pages/RegulationsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DisclaimerPage from './pages/DisclaimerPage';
import FeedbackAdminPage from './pages/FeedbackAdminPage';
import { useIsMaintenanceMode, useIsCallerAdmin } from './hooks/useQueries';
import { useInternetIdentity } from './hooks/useInternetIdentity';

const queryClient = new QueryClient();

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

  // Show normal app layout with chat widget
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatAssistantWidget />
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

const learningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/learning',
  component: LearningPage,
});

const glossaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/glossary',
  component: GlossaryPage,
});

const articlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/articles',
  component: ArticlesPage,
});

const researchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/research',
  component: ResearchPapersPage,
});

const blogsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blogs',
  component: BlogsPage,
});

const blogDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blogs/$id',
  component: BlogDetailPage,
});

const calculatorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators',
  component: CalculatorsPage,
});

const sipCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/sip',
  component: SIPCalculatorPage,
});

const lumpSumCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/lumpsum',
  component: LumpSumCalculatorPage,
});

const stepUpCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/stepup',
  component: StepUpCalculatorPage,
});

const swpCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/swp',
  component: SWPCalculatorPage,
});

const ssyCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/ssy',
  component: SSYCalculatorPage,
});

const ppfCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/ppf',
  component: PPFCalculatorPage,
});

const epfCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/epf',
  component: EPFCalculatorPage,
});

const fdCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/fd',
  component: FDCalculatorPage,
});

const rdCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/rd',
  component: RDCalculatorPage,
});

const emiCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/emi',
  component: EMICalculatorPage,
});

const gstCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/gst',
  component: GSTCalculatorPage,
});

const xirrCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/xirr',
  component: XIRRCalculatorPage,
});

const cagrCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/cagr',
  component: CAGRCalculatorPage,
});

const gratuityCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/gratuity',
  component: GratuityCalculatorPage,
});

const hraCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/hra',
  component: HRACalculatorPage,
});

const npsCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/nps',
  component: NPSCalculatorPage,
});

const nscCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/nsc',
  component: NSCCalculatorPage,
});

const simpleInterestCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/simple-interest',
  component: SimpleInterestCalculatorPage,
});

const atalPensionYojanaCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/atal-pension-yojana',
  component: AtalPensionYojanaCalculatorPage,
});

const fixedVsReducingLoanCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/fixed-vs-reducing-loan',
  component: FixedVsReducingLoanCalculatorPage,
});

const homeLoanEMICalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/home-loan-emi',
  component: HomeLoanEMICalculatorPage,
});

const simpleVsCompoundInterestCalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculators/simple-vs-compound-interest',
  component: SimpleVsCompoundInterestCalculatorPage,
});

const regulationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/regulations',
  component: RegulationsPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const disclaimerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/disclaimer',
  component: DisclaimerPage,
});

const feedbackAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/feedback',
  component: FeedbackAdminPage,
});

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
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

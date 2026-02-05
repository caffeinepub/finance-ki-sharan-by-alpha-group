import { Wrench } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function MaintenanceScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <BrandLogo className="h-20 w-auto" />
        </div>
        
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <Wrench className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        <h1 className="mb-4 text-3xl font-bold text-foreground">
          Under Maintenance
        </h1>
        
        <p className="mb-8 text-lg text-muted-foreground">
          We're currently performing maintenance to improve your experience. 
          Please check back soon.
        </p>
        
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Thank you for your patience. We'll be back shortly with enhanced features 
            and improvements to serve you better.
          </p>
        </div>
        
        <footer className="mt-12 text-sm text-muted-foreground">
          <p>© 2026. Built with love using <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">caffeine.ai</a></p>
        </footer>
      </div>
    </div>
  );
}

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Analyzing your consultation...",
  submessage = "This may take a moment"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-24 h-24 rounded-full border-4 border-accent animate-pulse-soft" />
        
        {/* Inner spinning loader */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        
        {/* Decorative dots */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      </div>
      
      <h3 className="mt-8 text-xl font-serif font-semibold text-foreground">
        {message}
      </h3>
      <p className="mt-2 text-muted-foreground">
        {submessage}
      </p>
      
      {/* Progress bar animation */}
      <div className="mt-6 w-48 h-1 bg-accent rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-pulse-soft" 
             style={{ 
               width: '60%',
               animation: 'loading 2s ease-in-out infinite',
             }} 
        />
      </div>
      
      <style>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;

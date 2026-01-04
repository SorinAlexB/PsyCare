import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, History, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Welcome back
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Hello, {user?.name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Ready to start a new consultation or review your previous analyses? Choose an option below.
            </p>
          </div>

          {/* Action cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* New Consultation Card */}
            <div 
              className="glass-card p-8 hover:shadow-elevated transition-all duration-300 cursor-pointer group animate-slide-up"
              onClick={() => navigate('/consultation')}
              style={{ animationDelay: '0.1s' }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <PlusCircle className="w-8 h-8 text-primary" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-3">
                New Consultation
              </h2>
              <p className="text-muted-foreground mb-6">
                Submit a new query for analysis and receive a comprehensive PDF report with detailed insights.
              </p>
              <Button variant="default" className="w-full">
                Start New Consultation
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* History Card */}
            <div 
              className="glass-card p-8 hover:shadow-elevated transition-all duration-300 cursor-pointer group animate-slide-up"
              onClick={() => navigate('/history')}
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 rounded-xl bg-accent group-hover:bg-primary/10 transition-colors">
                  <History className="w-8 h-8 text-primary" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-3">
                Consultation History
              </h2>
              <p className="text-muted-foreground mb-6">
                View all your previous consultations, access past reports, and track your query history.
              </p>
              <Button variant="outline" className="w-full">
                View History
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-12 p-6 glass-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="text-center px-4">
                <p className="text-3xl font-serif font-bold text-primary">Fast</p>
                <p className="text-sm text-muted-foreground mt-1">Analysis Speed</p>
              </div>
              <div className="text-center px-4">
                <p className="text-3xl font-serif font-bold text-primary">Secure</p>
                <p className="text-sm text-muted-foreground mt-1">Data Protection</p>
              </div>
              <div className="text-center px-4">
                <p className="text-3xl font-serif font-bold text-primary">Detailed</p>
                <p className="text-sm text-muted-foreground mt-1">PDF Reports</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

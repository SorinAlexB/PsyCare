import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: isLogin ? 'Login Failed' : 'Registration Failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-accent to-secondary items-center justify-center p-12">
        <div className="max-w-md animate-fade-in">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary/20">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <span className="text-3xl font-serif font-bold text-foreground">
              ConsultAI
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Your Intelligent Consultation Partner
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Get detailed analysis and insights for your queries. Our AI-powered platform delivers comprehensive PDF reports tailored to your needs.
          </p>
          <div className="space-y-4">
            {['Instant Analysis', 'Detailed PDF Reports', 'Secure & Private'].map((feature, index) => (
              <div key={feature} className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-foreground font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="p-2 rounded-lg bg-primary/10">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-serif font-semibold text-foreground">
              ConsultAI
            </span>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isLogin 
                ? 'Enter your credentials to access your consultations' 
                : 'Sign up to start your consultation journey'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 text-primary font-medium hover:underline"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

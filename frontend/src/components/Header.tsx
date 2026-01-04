import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <div className="p-2 rounded-lg bg-primary/10">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-serif font-semibold text-foreground">
            ConsultAI
          </span>
        </div>

        <nav className="flex items-center gap-2">
          <Button
            variant={location.pathname === '/dashboard' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
          <Button
            variant={location.pathname === '/consultation' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => navigate('/consultation')}
          >
            New Consultation
          </Button>
          <Button
            variant={location.pathname === '/history' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => navigate('/history')}
          >
            History
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent">
            <User className="w-4 h-4 text-accent-foreground" />
            <span className="text-sm font-medium text-accent-foreground">
              {user?.name || user?.email}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

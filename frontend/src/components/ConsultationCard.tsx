import React from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface ConsultationCardProps {
  id: string;
  query: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  createdAt: Date;
  onClick: () => void;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Pending',
    className: 'text-amber-600 bg-amber-50',
  },
  processing: {
    icon: Clock,
    label: 'Processing',
    className: 'text-blue-600 bg-blue-50',
  },
  completed: {
    icon: CheckCircle,
    label: 'Completed',
    className: 'text-primary bg-accent',
  },
  error: {
    icon: AlertCircle,
    label: 'Error',
    className: 'text-destructive bg-red-50',
  },
};

const ConsultationCard: React.FC<ConsultationCardProps> = ({
  query,
  status,
  createdAt,
  onClick,
}) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div 
      className="glass-card p-5 hover:shadow-elevated transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2 rounded-lg bg-accent shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-medium line-clamp-2 mb-2">
              {query}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(createdAt), 'MMM d, yyyy • h:mm a')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {config.label}
          </span>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationCard;

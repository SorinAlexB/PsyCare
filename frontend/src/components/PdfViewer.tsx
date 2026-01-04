import React from 'react';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfViewerProps {
  pdfUrl: string;
  onDownload: () => void;
  isDownloading?: boolean;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl, onDownload, isDownloading }) => {
  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-serif font-semibold text-foreground">
            Consultation Results
          </h3>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(pdfUrl, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </Button>
          <Button 
            size="sm" 
            onClick={onDownload}
            disabled={isDownloading}
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </div>
      </div>
      
      <div className="glass-card overflow-hidden">
        <iframe
          src={pdfUrl}
          className="w-full h-[600px] border-0"
          title="Consultation PDF"
        />
      </div>
      
      <p className="mt-3 text-sm text-muted-foreground text-center">
        Your consultation results are ready. You can view them above or download for your records.
      </p>
    </div>
  );
};

export default PdfViewer;

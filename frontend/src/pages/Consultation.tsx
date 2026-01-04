import React, { useState, useEffect } from 'react';
import { Send, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import PdfViewer from '@/components/PdfViewer';
import { consultationApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type ConsultationStatus = 'idle' | 'submitting' | 'processing' | 'completed' | 'error';

const Consultation: React.FC = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<ConsultationStatus>('idle');
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  // Poll for consultation status
  useEffect(() => {
    if (!consultationId || status !== 'processing') return;

    const interval = setInterval(async () => {
      try {
        const result = await consultationApi.getStatus(consultationId);
        if (result.status === 'completed' && result.pdfUrl) {
          setPdfUrl(result.pdfUrl);
          setStatus('completed');
        } else if (result.status === 'error') {
          setStatus('error');
          toast({
            title: 'Analysis Failed',
            description: 'Something went wrong during analysis. Please try again.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [consultationId, status, toast]);

  const handleSubmit = async () => {
    if (!query.trim()) {
      toast({
        title: 'Empty Query',
        description: 'Please enter your consultation text.',
        variant: 'destructive',
      });
      return;
    }

    setStatus('submitting');

    try {
      const result = await consultationApi.submit({ query });
      setConsultationId(result.id);
      setStatus('processing');
    } catch (error) {
      setStatus('error');
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit your consultation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async () => {
    if (!consultationId) return;
    
    setIsDownloading(true);
    try {
      const blob = await consultationApi.downloadPdf(consultationId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consultation-${consultationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Failed to download the PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNewConsultation = () => {
    setQuery('');
    setStatus('idle');
    setConsultationId(null);
    setPdfUrl(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
              New Consultation
            </h1>
            <p className="text-muted-foreground">
              Enter your query below and our AI will analyze it for you
            </p>
          </div>

          {/* Main content area */}
          <div className="glass-card p-6 md:p-8">
            {status === 'idle' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Your Consultation Query
                  </h2>
                </div>
                
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your query in detail. The more information you provide, the more comprehensive your analysis will be..."
                  className="min-h-[250px] resize-none text-base leading-relaxed"
                />
                
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    {query.length} characters
                  </p>
                  <Button 
                    onClick={handleSubmit} 
                    variant="hero"
                    disabled={!query.trim()}
                  >
                    <Send className="w-4 h-4" />
                    Analyze Query
                  </Button>
                </div>
              </div>
            )}

            {(status === 'submitting' || status === 'processing') && (
              <LoadingSpinner 
                message={status === 'submitting' ? 'Submitting your query...' : 'Analyzing your consultation...'}
                submessage={status === 'submitting' ? 'Please wait' : 'This may take a few moments'}
              />
            )}

            {status === 'completed' && pdfUrl && (
              <div className="animate-fade-in">
                <PdfViewer 
                  pdfUrl={pdfUrl} 
                  onDownload={handleDownload}
                  isDownloading={isDownloading}
                />
                <div className="mt-6 text-center">
                  <Button variant="outline" onClick={handleNewConsultation}>
                    Start New Consultation
                  </Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                  Something went wrong
                </h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't process your consultation. Please try again.
                </p>
                <Button onClick={handleNewConsultation}>
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Consultation;

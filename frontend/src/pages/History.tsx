import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, FileText, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ConsultationCard from '@/components/ConsultationCard';
import PdfViewer from '@/components/PdfViewer';
import { consultationApi, ConsultationResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const History: React.FC = () => {
  const [consultations, setConsultations] = useState<ConsultationResponse[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<ConsultationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationResponse | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await consultationApi.getHistory();
        setConsultations(data);
        setFilteredConsultations(data);
      } catch (error) {
        toast({
          title: 'Failed to Load History',
          description: 'Could not fetch your consultation history.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = consultations.filter(c => 
        c.response?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConsultations(filtered);
    } else {
      setFilteredConsultations(consultations);
    }
  }, [searchQuery, consultations]);

  const handleDownload = async () => {
    if (!selectedConsultation?.id) return;
    
    setIsDownloading(true);
    try {
      const blob = await consultationApi.downloadPdf(selectedConsultation.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consultation-${selectedConsultation.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Failed to download the PDF.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                Consultation History
              </h1>
              <p className="text-muted-foreground">
                View and access your past consultations
              </p>
            </div>
            <Button onClick={() => navigate('/consultation')}>
              New Consultation
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-6 animate-slide-up">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search consultations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : selectedConsultation ? (
            <div className="animate-fade-in">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedConsultation(null)}
                className="mb-4"
              >
                ← Back to History
              </Button>
              
              <div className="glass-card p-6 mb-6">
                <h3 className="font-medium text-foreground mb-2">Original Query:</h3>
                <p className="text-muted-foreground">{selectedConsultation.response}</p>
              </div>

              {selectedConsultation.pdfUrl && (
                <PdfViewer 
                  pdfUrl={selectedConsultation.pdfUrl}
                  onDownload={handleDownload}
                  isDownloading={isDownloading}
                />
              )}
            </div>
          ) : filteredConsultations.length > 0 ? (
            <div className="space-y-4">
              {filteredConsultations.map((consultation, index) => (
                <div 
                  key={consultation.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ConsultationCard
                    id={consultation.id}
                    query={consultation.response || 'No query text'}
                    status={consultation.status}
                    createdAt={new Date()}
                    onClick={() => setSelectedConsultation(consultation)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
                <HistoryIcon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                No Consultations Yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {searchQuery 
                  ? 'No consultations match your search.'
                  : 'Start your first consultation to see your history here.'}
              </p>
              {!searchQuery && (
                <Button onClick={() => navigate('/consultation')}>
                  <FileText className="w-4 h-4" />
                  Start First Consultation
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default History;

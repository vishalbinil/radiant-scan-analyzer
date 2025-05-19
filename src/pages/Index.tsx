
import { useState } from 'react';
import ScanUploader from '@/components/ScanUploader';
import ImageDisplay from '@/components/ImageDisplay';
import AnalysisResult, { CancerType } from '@/components/AnalysisResult';
import { Button } from '@/components/ui/button';
import { Camera, Search, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MOCK_RESULTS: CancerType[] = [
  { id: 'benign', name: 'Benign Nodule', probability: 0.179, color: 'bg-[hsl(var(--color-benign))]' },
  { id: 'squamous', name: 'Squamous Cell Carcinoma', probability: 0.288, color: 'bg-[hsl(var(--color-squamous))]' },
  { id: 'large', name: 'Large Cell Carcinoma', probability: 0.164, color: 'bg-[hsl(var(--color-large-cell))]' },
  { id: 'adeno', name: 'Adenocarcinoma', probability: 0.317, color: 'bg-[hsl(var(--color-adeno))]' },
  { id: 'normal', name: 'Normal', probability: 0.053, color: 'bg-[hsl(var(--color-normal))]' },
];

const Index = () => {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<CancerType[] | null>(null);

  const handleImageSelected = (imageUrl: string) => {
    setOriginalImage(imageUrl);
    setProcessedImage(null);
    setResults(null);
  };

  const handleAnalyze = () => {
    if (!originalImage) {
      toast({
        title: "No scan uploaded",
        description: "Please upload a CT scan image first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate processing time
    setTimeout(() => {
      // For demo purposes, we'll just set the processed image to be the same as original
      setProcessedImage(originalImage);
      setResults(MOCK_RESULTS);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: "Scan analysis has been completed successfully.",
      });
    }, 2000);
  };

  const handleClear = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setResults(null);
    toast({
      title: "All cleared",
      description: "Scan data and analysis results have been cleared.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <header className="w-full bg-white shadow-md">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Camera size={24} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
              Advanced Lung Cancer Detection System
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">
            AI-Powered Medical Imaging Analysis
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-10 flex-1">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8 space-y-8">
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <div className="flex gap-3">
                <Button 
                  onClick={() => document.getElementById('upload-trigger')?.click()}
                  className="gap-2 shadow-sm"
                  size="lg"
                >
                  <Camera size={18} />
                  Upload CT Scan
                </Button>
                <input 
                  id="upload-trigger" 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageSelected(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  accept="image/*"
                />
                <Button 
                  onClick={handleAnalyze}
                  disabled={!originalImage || isAnalyzing}
                  variant={originalImage ? "default" : "outline"}
                  className="gap-2 shadow-sm"
                  size="lg"
                >
                  <Search size={18} />
                  Analyze Scan
                </Button>
              </div>
              <Button 
                onClick={handleClear}
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground ml-1">Original CT Scan</h3>
                <ImageDisplay 
                  imageUrl={originalImage} 
                  title="Original Image" 
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground ml-1">Processed Image</h3>
                <ImageDisplay 
                  imageUrl={processedImage} 
                  title="Processed Image" 
                />
              </div>
            </div>
            
            <ScanUploader 
              onImageSelected={handleImageSelected} 
              isProcessing={isAnalyzing} 
            />
          </div>
          
          <div className="md:col-span-4">
            <AnalysisResult 
              results={results} 
              isLoading={isAnalyzing}
              detection={results ? "Positive" : undefined}
              detectionType={results ? "Adenocarcinoma" : undefined}
              detectionDetails={results ? "The model detected signs of lung cancer, indicating a mucus-producing glandular cells." : undefined}
              confidenceScore={results ? 91.7 : undefined}
              modelName={results ? "Enhanced Hybrid CNN with Attention (Fine)" : undefined}
            />
          </div>
        </div>
      </main>
      
      <footer className="w-full bg-white border-t py-4 mt-10">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          Advanced Lung Cancer Detection System © {new Date().getFullYear()} — AI-Powered Medical Imaging
        </div>
      </footer>
    </div>
  );
};

export default Index;

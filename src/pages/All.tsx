
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Camera, Info, Search, Trash2 } from "lucide-react";

// Types
interface CancerType {
  id: string;
  name: string;
  probability: number;
  color: string;
}

// Mock Results
const MOCK_RESULTS: CancerType[] = [
  { id: 'benign', name: 'Benign Nodule', probability: 0.179, color: 'bg-gradient-to-r from-green-400 to-emerald-500' },
  { id: 'squamous', name: 'Squamous Cell Carcinoma', probability: 0.288, color: 'bg-gradient-to-r from-orange-400 to-red-500' },
  { id: 'large', name: 'Large Cell Carcinoma', probability: 0.164, color: 'bg-gradient-to-r from-red-400 to-rose-600' },
  { id: 'adeno', name: 'Adenocarcinoma', probability: 0.317, color: 'bg-gradient-to-r from-pink-500 to-purple-600' },
  { id: 'normal', name: 'Normal', probability: 0.053, color: 'bg-gradient-to-r from-blue-400 to-indigo-500' },
];

// Image Display Component
const ImageDisplay = ({ imageUrl, title }: { imageUrl: string | null; title: string }) => {
  return (
    <Card className="overflow-hidden border-2 border-indigo-300 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-br from-white to-indigo-100">
      <CardContent className="p-0">
        <div className="h-64 bg-gradient-to-br from-indigo-900 to-violet-800 flex items-center justify-center p-4 relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-indigo-200 text-sm italic">
              No image loaded
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-800/90 to-violet-700/90 backdrop-blur-sm text-xs text-white py-2 px-4 font-medium">
            {title}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Analysis Result Component
const AnalysisResult = ({ 
  results, 
  isLoading,
  detection,
  detectionType,
  detectionDetails,
  confidenceScore,
  modelName
}: {
  results: CancerType[] | null;
  isLoading: boolean;
  detection?: string;
  detectionType?: string;
  detectionDetails?: string;
  confidenceScore?: number;
  modelName?: string;
}) => {
  if (isLoading) {
    return (
      <Card className="border-2 border-fuchsia-300 shadow-md bg-gradient-to-br from-white to-fuchsia-50 rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl text-fuchsia-700">
            <div className="animate-pulse h-4 w-4 rounded-full bg-fuchsia-500"></div>
            Analyzing Scan...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 py-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-fuchsia-200 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-fuchsia-200 rounded animate-pulse"></div>
              </div>
              <div className="h-3 bg-fuchsia-200 rounded animate-pulse"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card className="border-2 border-fuchsia-200 shadow-md h-full flex flex-col justify-center items-center py-12 bg-gradient-to-br from-white to-fuchsia-50 rounded-xl">
        <Info className="h-12 w-12 text-fuchsia-400 mb-4" />
        <CardTitle className="text-lg mb-2 text-fuchsia-700">No Analysis Results</CardTitle>
        <p className="text-center text-fuchsia-600/70 text-sm max-w-xs">
          Upload a CT scan and click "Analyze" to see detailed detection results.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-fuchsia-300 shadow-lg bg-gradient-to-br from-white to-fuchsia-50 rounded-xl">
      <CardHeader className="pb-2 border-b border-fuchsia-100">
        <CardTitle className="text-xl flex items-center gap-2 text-fuchsia-700">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {modelName && (
          <div className="text-sm bg-fuchsia-100/70 p-3 rounded-lg">
            <span className="font-medium text-fuchsia-700">AI Model:</span>{" "}
            <span className="text-fuchsia-600">{modelName}</span>
          </div>
        )}
        
        {detection && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-fuchsia-700">Detection Status:</span> 
              <Badge variant="destructive" className="font-medium bg-gradient-to-r from-rose-500 to-red-500">{detection}</Badge>
            </div>
            {detectionType && (
              <div className="flex justify-between text-sm">
                <span className="font-medium text-fuchsia-700">Cancer Type:</span> 
                <span className="font-semibold text-violet-700">{detectionType}</span>
              </div>
            )}
            {confidenceScore !== undefined && (
              <div className="flex justify-between text-sm mt-2">
                <span className="font-medium text-fuchsia-700">Confidence Score:</span> 
                <span className="font-semibold text-violet-700">{confidenceScore}%</span>
              </div>
            )}
            {detectionDetails && (
              <div className="text-sm bg-fuchsia-100/70 p-3 rounded-md mt-2 flex gap-2">
                <AlertCircle className="text-fuchsia-500 min-w-4 h-4 mt-0.5" />
                <p className="text-fuchsia-600 text-xs">{detectionDetails}</p>
              </div>
            )}
          </div>
        )}

        <div className="pt-2">
          <h3 className="font-medium mb-4 pb-2 border-b border-fuchsia-100 text-sm text-fuchsia-700">Probability Distribution</h3>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-fuchsia-700">{result.name}</span>
                  <span className="font-semibold text-violet-700">{(result.probability * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={result.probability * 100} 
                  className={`h-2.5 ${result.color}`}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Application
const All = () => {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 shadow-lg">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
              <Camera size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Advanced Lung Cancer Detection System
            </h1>
          </div>
          <div className="text-sm text-white/80 font-medium">
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
                  className="gap-2 shadow-sm bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 border-0"
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
                  className="gap-2 shadow-sm bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 border-0"
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
                className="h-10 w-10 rounded-full border-red-300 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-fuchsia-600 ml-1">Original CT Scan</h3>
                <ImageDisplay 
                  imageUrl={originalImage} 
                  title="Original Image" 
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-fuchsia-600 ml-1">Processed Image</h3>
                <ImageDisplay 
                  imageUrl={processedImage} 
                  title="Processed Image" 
                />
              </div>
            </div>
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
      
      <footer className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 py-4 mt-10">
        <div className="container mx-auto px-6 text-center text-sm text-white/80">
          Advanced Lung Cancer Detection System © {new Date().getFullYear()} — AI-Powered Medical Imaging
        </div>
      </footer>
    </div>
  );
};

export default All;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Info } from "lucide-react";

export interface CancerType {
  id: string;
  name: string;
  probability: number;
  color: string;
}

interface AnalysisResultProps {
  results: CancerType[] | null;
  isLoading: boolean;
  detection?: string;
  detectionType?: string;
  detectionDetails?: string;
  confidenceScore?: number;
  modelName?: string;
}

const AnalysisResult = ({ 
  results, 
  isLoading,
  detection,
  detectionType,
  detectionDetails,
  confidenceScore,
  modelName
}: AnalysisResultProps) => {
  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="animate-pulse h-4 w-4 rounded-full bg-primary"></div>
            Analyzing Scan...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 py-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="h-3 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card className="border-2 border-muted/30 shadow-sm h-full flex flex-col justify-center items-center py-12">
        <Info className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <CardTitle className="text-lg mb-2">No Analysis Results</CardTitle>
        <p className="text-center text-muted-foreground text-sm max-w-xs">
          Upload a CT scan and click "Analyze" to see detailed detection results.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 shadow-md">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-xl flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse"></div>
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {modelName && (
          <div className="text-sm bg-secondary/50 p-3 rounded-lg">
            <span className="font-medium text-secondary-foreground/80">AI Model:</span>{" "}
            <span className="text-secondary-foreground">{modelName}</span>
          </div>
        )}
        
        {detection && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Detection Status:</span> 
              <Badge variant="destructive" className="font-medium">{detection}</Badge>
            </div>
            {detectionType && (
              <div className="flex justify-between text-sm">
                <span className="font-medium">Cancer Type:</span> 
                <span className="font-semibold">{detectionType}</span>
              </div>
            )}
            {confidenceScore !== undefined && (
              <div className="flex justify-between text-sm mt-2">
                <span className="font-medium">Confidence Score:</span> 
                <span className="font-semibold">{confidenceScore}%</span>
              </div>
            )}
            {detectionDetails && (
              <div className="text-sm bg-muted/50 p-3 rounded-md mt-2 flex gap-2">
                <AlertCircle className="text-muted-foreground min-w-4 h-4 mt-0.5" />
                <p className="text-muted-foreground text-xs">{detectionDetails}</p>
              </div>
            )}
          </div>
        )}

        <div className="pt-2">
          <h3 className="font-medium mb-4 pb-2 border-b text-sm">Probability Distribution</h3>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{result.name}</span>
                  <span className="font-semibold">{(result.probability * 100).toFixed(1)}%</span>
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

export default AnalysisResult;

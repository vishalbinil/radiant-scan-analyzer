
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-lg">Analyzing Scan...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 py-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="h-4 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-lg">No Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Upload a CT scan and click "Analyze" to see results.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {modelName && (
          <div className="text-sm">
            <span className="font-medium">Model:</span> {modelName}
          </div>
        )}
        
        {detection && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Detection:</span> 
              <span className="text-destructive font-medium">{detection}</span>
            </div>
            {detectionType && (
              <div className="flex justify-between text-sm">
                <span className="font-medium">Type:</span> 
                <span>{detectionType}</span>
              </div>
            )}
            {detectionDetails && (
              <div className="text-sm mt-1">
                <span className="font-medium">Details:</span> 
                <p className="text-muted-foreground text-xs mt-1">{detectionDetails}</p>
              </div>
            )}
            {confidenceScore !== undefined && (
              <div className="flex justify-between text-sm mt-2">
                <span className="font-medium">Confidence:</span> 
                <span>{confidenceScore}%</span>
              </div>
            )}
          </div>
        )}

        <div>
          <h3 className="font-medium mb-3">Cancer Type Probability Distribution</h3>
          <div className="space-y-3">
            {results.map((result) => (
              <div key={result.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{result.name}</span>
                  <span className="font-medium">{(result.probability * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={result.probability * 100} 
                  className={`h-3 ${result.color}`}
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


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
      <Card className="border-2 border-indigo-300 shadow-md bg-gradient-to-br from-white to-indigo-50 rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl text-indigo-700">
            <div className="animate-pulse h-4 w-4 rounded-full bg-indigo-500"></div>
            Analyzing Scan...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 py-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-indigo-200 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-indigo-200 rounded animate-pulse"></div>
              </div>
              <div className="h-3 bg-indigo-200 rounded animate-pulse"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card className="border-2 border-indigo-200 shadow-md h-full flex flex-col justify-center items-center py-12 bg-gradient-to-br from-white to-indigo-50 rounded-xl">
        <Info className="h-12 w-12 text-indigo-400 mb-4" />
        <CardTitle className="text-lg mb-2 text-indigo-700">No Analysis Results</CardTitle>
        <p className="text-center text-indigo-600/70 text-sm max-w-xs">
          Upload a CT scan and click "Analyze" to see detailed detection results.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-indigo-300 shadow-lg bg-gradient-to-br from-white to-indigo-50 rounded-xl">
      <CardHeader className="pb-2 border-b border-indigo-100">
        <CardTitle className="text-xl flex items-center gap-2 text-indigo-700">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {modelName && (
          <div className="text-sm bg-indigo-100/70 p-3 rounded-lg">
            <span className="font-medium text-indigo-700">AI Model:</span>{" "}
            <span className="text-indigo-600">{modelName}</span>
          </div>
        )}
        
        {detection && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-indigo-700">Detection Status:</span> 
              <Badge variant="destructive" className="font-medium bg-gradient-to-r from-rose-500 to-red-500">{detection}</Badge>
            </div>
            {detectionType && (
              <div className="flex justify-between text-sm">
                <span className="font-medium text-indigo-700">Cancer Type:</span> 
                <span className="font-semibold text-violet-700">{detectionType}</span>
              </div>
            )}
            {confidenceScore !== undefined && (
              <div className="flex justify-between text-sm mt-2">
                <span className="font-medium text-indigo-700">Confidence Score:</span> 
                <span className="font-semibold text-violet-700">{confidenceScore}%</span>
              </div>
            )}
            {detectionDetails && (
              <div className="text-sm bg-indigo-100/70 p-3 rounded-md mt-2 flex gap-2">
                <AlertCircle className="text-indigo-500 min-w-4 h-4 mt-0.5" />
                <p className="text-indigo-600 text-xs">{detectionDetails}</p>
              </div>
            )}
          </div>
        )}

        <div className="pt-2">
          <h3 className="font-medium mb-4 pb-2 border-b border-indigo-100 text-sm text-indigo-700">Probability Distribution</h3>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-indigo-700">{result.name}</span>
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

export default AnalysisResult;

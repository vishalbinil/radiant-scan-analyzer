
import { Card, CardContent } from "@/components/ui/card";

interface ImageDisplayProps {
  imageUrl: string | null;
  title: string;
}

const ImageDisplay = ({ imageUrl, title }: ImageDisplayProps) => {
  return (
    <Card className="overflow-hidden border-2 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-br from-white to-indigo-50">
      <CardContent className="p-0">
        <div className="h-64 bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center p-4 relative">
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
          <div className="absolute bottom-0 left-0 right-0 bg-indigo-900/80 backdrop-blur-sm text-xs text-white/90 py-2 px-4 font-medium">
            {title}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageDisplay;

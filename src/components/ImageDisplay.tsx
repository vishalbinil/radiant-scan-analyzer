
import { Card, CardContent } from "@/components/ui/card";

interface ImageDisplayProps {
  imageUrl: string | null;
  title: string;
}

const ImageDisplay = ({ imageUrl, title }: ImageDisplayProps) => {
  return (
    <Card className="overflow-hidden border-2 shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-0">
        <div className="h-64 bg-black/90 flex items-center justify-center p-4 relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-muted-foreground text-sm italic">
              No image loaded
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-xs text-white/90 py-1.5 px-3">
            {title}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageDisplay;

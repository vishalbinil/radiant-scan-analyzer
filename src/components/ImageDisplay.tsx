
import { Card, CardContent } from "@/components/ui/card";

interface ImageDisplayProps {
  imageUrl: string | null;
  title: string;
}

const ImageDisplay = ({ imageUrl, title }: ImageDisplayProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-secondary p-2 text-sm font-medium text-center">
          {title}
        </div>
        <div className="h-64 bg-black flex items-center justify-center p-4">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageDisplay;

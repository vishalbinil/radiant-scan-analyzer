
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScanUploaderProps {
  onImageSelected: (imageUrl: string) => void;
  isProcessing: boolean;
}

const ScanUploader = ({ onImageSelected, isProcessing }: ScanUploaderProps) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if the file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (CT scan)",
        variant: "destructive"
      });
      return;
    }

    // Create URL for the file
    const imageUrl = URL.createObjectURL(file);
    onImageSelected(imageUrl);

    toast({
      title: "CT Scan uploaded",
      description: "Your scan has been successfully uploaded and is ready for analysis.",
    });
  };

  return (
    <Card className={`border-2 ${dragActive ? 'border-primary/70 bg-primary/5 border-dashed' : 'border-border'} transition-all duration-300 shadow-sm`}>
      <CardContent className="p-6">
        <div
          className="flex flex-col items-center justify-center gap-5 p-6 text-center"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="rounded-full bg-primary/10 p-6">
            <Image className="h-10 w-10 text-primary" />
          </div>
          <div>
            <p className="text-xl font-semibold mb-1">Upload CT Scan</p>
            <p className="text-sm text-muted-foreground max-w-md">
              Drag and drop your CT scan image, or click to browse your files for analysis
            </p>
          </div>
          <label className="cursor-pointer mt-2">
            <Button 
              className="px-8 shadow-sm" 
              disabled={isProcessing}
              size="lg"
            >
              Select File
            </Button>
            <input
              type="file"
              className="hidden"
              onChange={handleChange}
              accept="image/*"
              disabled={isProcessing}
            />
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanUploader;

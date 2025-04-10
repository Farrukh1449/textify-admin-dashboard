
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const ImageUploader = ({ value, onChange, label = "Image" }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, this would upload to a server and return a URL
    // For now, we'll create a data URL as a mock
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">{label}</Label>
      
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="image-upload-preview"
          />
          <Button 
            variant="destructive" 
            size="sm" 
            className="absolute top-2 right-2 opacity-80 hover:opacity-100"
            onClick={handleRemove}
          >
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-40 bg-gray-50 hover:bg-gray-100 cursor-pointer">
          <label 
            htmlFor="image-upload" 
            className="cursor-pointer text-center p-4"
          >
            <div className="text-gray-500">Click to upload an image</div>
            <Input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

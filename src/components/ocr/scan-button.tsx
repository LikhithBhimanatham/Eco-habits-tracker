
import { useState } from "react";
import { Upload, PenLine, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScanButtonProps {
  onScanComplete: (text: string) => void;
  onManualEntry: () => void;
  className?: string;
  variant?: "default" | "water" | "electricity" | "petrol";
}

export function ScanButton({ onScanComplete, onManualEntry, className, variant = "default" }: ScanButtonProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [inputMode, setInputMode] = useState<"scan" | "manual">("scan");
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleUpload = () => {
    setShowUpload(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleProcessBill = () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an image file first",
      });
      return;
    }

    setIsScanning(true);
    
    // Simulate OCR process with the uploaded image
    setTimeout(() => {
      setIsScanning(false);
      setShowUpload(false);
      
      // Clean up preview URL to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Reset file input
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Mock OCR result based on bill type
      let mockResult = "";
      
      if (variant === "water") {
        mockResult = "Water Bill\nAccount: 12345\nCurrent Usage: 34 m³\nAmount: $45.60\nDue Date: 15/06/2024";
      } else if (variant === "electricity") {
        mockResult = "Electricity Bill\nAccount: 67890\nCurrent Usage: 420 kWh\nAmount: $78.90\nDue Date: 20/06/2024";
      } else if (variant === "petrol") {
        mockResult = "Fuel Receipt\nStation: EcoPetrol\nLiters: 32.5\nPrice per liter: $1.35\nTotal: $43.87\nDate: 05/06/2024";
      }
      
      toast({
        title: "Analysis Complete",
        description: "Bill information successfully extracted",
      });
      
      onScanComplete(mockResult);
    }, 2000);
  };

  const handleInputModeChange = (value: string) => {
    if (value === "manual") {
      setInputMode("manual");
      onManualEntry();
    } else {
      setInputMode("scan");
    }
  };

  const variantStyles = {
    default: "bg-primary hover:bg-primary/90",
    water: "bg-ecoBlue hover:bg-ecoBlue-dark",
    electricity: "bg-ecoGreen hover:bg-ecoGreen-dark",
    petrol: "bg-ecoEarth-dark hover:bg-ecoEarth"
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <ToggleGroup 
          type="single" 
          value={inputMode}
          onValueChange={handleInputModeChange}
          className="border rounded-lg"
        >
          <ToggleGroupItem value="scan" aria-label="Upload Bill">
            <Upload className="h-4 w-4 mr-2" />
            Upload Bill
          </ToggleGroupItem>
          <ToggleGroupItem value="manual" aria-label="Manual Entry">
            <PenLine className="h-4 w-4 mr-2" />
            Manual Entry
          </ToggleGroupItem>
        </ToggleGroup>
        
        {inputMode === "scan" && (
          <Button 
            onClick={handleUpload} 
            className={`${variantStyles[variant]} rounded-full h-16 w-16 ${className}`}
            disabled={isScanning}
          >
            <Image className="h-6 w-6" />
            {isScanning && (
              <span className="ml-2 animate-pulse">Processing...</span>
            )}
          </Button>
        )}
      </div>

      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center space-y-4 py-4">
            <h3 className="text-lg font-medium">Upload Bill Image</h3>
            
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="bill-image">Upload Image</Label>
              <Input
                id="bill-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            
            {previewUrl && (
              <div className="mt-4 border rounded-md overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="Bill preview" 
                  className="max-h-[300px] w-auto mx-auto" 
                />
              </div>
            )}
            
            <div className="flex justify-end w-full gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                  }
                  setPreviewUrl(null);
                  setSelectedFile(null);
                  setShowUpload(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleProcessBill}
                disabled={!selectedFile || isScanning}
              >
                {isScanning ? (
                  <>Processing...</>
                ) : (
                  <>Analyze Bill</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

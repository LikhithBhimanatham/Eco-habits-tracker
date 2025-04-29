
import { useState } from "react";
import { Camera, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CameraView } from "./camera-view";
import { useToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ScanButtonProps {
  onScanComplete: (text: string) => void;
  onManualEntry: () => void;
  className?: string;
  variant?: "default" | "water" | "electricity" | "petrol";
}

export function ScanButton({ onScanComplete, onManualEntry, className, variant = "default" }: ScanButtonProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [inputMode, setInputMode] = useState<"scan" | "manual">("scan");
  const { toast } = useToast();

  const handleScan = () => {
    setShowCamera(true);
  };

  const handleCameraCapture = (imageData: string) => {
    setIsScanning(true);
    
    // Simulate OCR process with the captured image
    setTimeout(() => {
      setIsScanning(false);
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
        title: "Scan Completed",
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
          <ToggleGroupItem value="scan" aria-label="Scan Bill">
            <Camera className="h-4 w-4 mr-2" />
            Scan Bill
          </ToggleGroupItem>
          <ToggleGroupItem value="manual" aria-label="Manual Entry">
            <PenLine className="h-4 w-4 mr-2" />
            Manual Entry
          </ToggleGroupItem>
        </ToggleGroup>
        
        {inputMode === "scan" && (
          <Button 
            onClick={handleScan} 
            className={`${variantStyles[variant]} rounded-full h-16 w-16 ${className}`}
            disabled={isScanning}
          >
            <Camera className="h-6 w-6" />
            {isScanning && (
              <span className="ml-2 animate-pulse">Scanning...</span>
            )}
          </Button>
        )}
      </div>

      <CameraView 
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
      />
    </>
  );
}

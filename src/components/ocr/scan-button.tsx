
import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CameraView } from "./camera-view";

interface ScanButtonProps {
  onScanComplete: (text: string) => void;
  className?: string;
  variant?: "default" | "water" | "electricity" | "petrol";
}

export function ScanButton({ onScanComplete, className, variant = "default" }: ScanButtonProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

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
      
      onScanComplete(mockResult);
    }, 2000);
  };

  const variantStyles = {
    default: "bg-primary hover:bg-primary/90",
    water: "bg-ecoBlue hover:bg-ecoBlue-dark",
    electricity: "bg-ecoGreen hover:bg-ecoGreen-dark",
    petrol: "bg-ecoEarth-dark hover:bg-ecoEarth"
  };

  return (
    <>
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

      <CameraView 
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
      />
    </>
  );
}

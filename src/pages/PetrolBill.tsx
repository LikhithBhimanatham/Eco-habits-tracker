
import { useState } from "react";
import { Fuel, Upload, CheckCircle2, PenLine } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { ScanButton } from "@/components/ocr/scan-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const PetrolBill = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);

  // Form state (would be connected to actual form validation in a real app)
  const [liters, setLiters] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleScanComplete = (text: string) => {
    setScanResult(text);
    
    // Extract data from OCR text - in a real app, this would be more sophisticated
    const litersMatch = text.match(/Liters: (\d+\.?\d*)/);
    if (litersMatch) setLiters(litersMatch[1]);
    
    const amountMatch = text.match(/Total: \$(\d+\.?\d*)/);
    if (amountMatch) setAmount(amountMatch[1]);
    
    const dateMatch = text.match(/Date: (\d+\/\d+\/\d+)/);
    if (dateMatch) setDate(dateMatch[1]);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset after showing success
      setTimeout(() => {
        setScanResult(null);
        setIsManualEntry(false);
        setIsSubmitted(false);
        setLiters("");
        setAmount("");
        setDate("");
      }, 3000);
    }, 1000);
  };

  const handleManualEntry = () => {
    setScanResult(null);
    setIsManualEntry(true);
  };

  const renderEntryForm = () => {
    return (
      <div className="space-y-6">
        {scanResult && (
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <Label htmlFor="scan-result">OCR Scan Result</Label>
                <Textarea 
                  id="scan-result" 
                  value={scanResult} 
                  className="font-mono text-sm"
                  rows={5}
                  readOnly
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-medium">
              {isManualEntry 
                ? "Enter Fuel Receipt Details" 
                : "Verify Extracted Information"}
            </h2>
            <Separator />
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="liters">Fuel Quantity (L)</Label>
                <Input 
                  id="liters" 
                  value={liters} 
                  onChange={e => setLiters(e.target.value)}
                  placeholder="Enter fuel amount in liters"
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Receipt Amount ($)</Label>
                <Input 
                  id="amount" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Enter receipt amount in dollars"
                  type="number"
                  step="0.01"
                />
              </div>
              
              <div>
                <Label htmlFor="date">Receipt Date</Label>
                <Input 
                  id="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setScanResult(null);
                  setIsManualEntry(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="bg-ecoEarth-dark hover:bg-ecoEarth text-white"
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Receipt
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar className="hidden md:flex" />
      
      <main className="flex-1 pt-6 px-4 pb-20 md:pb-6 md:pl-24">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-3">
              <Fuel className="h-8 w-8 text-ecoEarth-dark" />
              <h1 className="text-2xl font-bold text-gray-900">Petrol Receipt Tracker</h1>
            </div>
            <p className="text-gray-600 mt-2">Track your fuel consumption by scanning or manually entering your receipt</p>
          </header>
          
          {isSubmitted ? (
            <Card className="bg-green-50 border-green-100">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Receipt Successfully Recorded!</h2>
                  <p className="text-gray-600">You've earned 20 eco points for tracking your fuel usage.</p>
                </div>
              </CardContent>
            </Card>
          ) : scanResult || isManualEntry ? (
            renderEntryForm()
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Add Your Petrol Receipt</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Scan your receipt or enter details manually to track your consumption
                </p>
              </div>
              
              <ScanButton 
                onScanComplete={handleScanComplete}
                onManualEntry={handleManualEntry}
                variant="petrol" 
                className="mb-8 h-20 w-20"
              />
              
              <div className="bg-amber-50 rounded-lg p-4 max-w-md">
                <h3 className="font-medium text-gray-900 mb-1">Fuel Saving Tip</h3>
                <p className="text-sm text-gray-600">
                  Maintain proper tire pressure. Under-inflated tires can lower gas mileage by about 0.2% for every 1 PSI drop.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Navbar className="md:hidden" />
    </div>
  );
};

export default PetrolBill;

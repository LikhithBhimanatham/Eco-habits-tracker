
import { useState } from "react";
import { Zap, Upload, CheckCircle2, PenLine } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { ScanButton } from "@/components/ocr/scan-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ElectricityBill = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);

  // Form state (would be connected to actual form validation in a real app)
  const [usage, setUsage] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  // Check if all bill types are entered (would be fetched from a real database)
  const [allBillsEntered, setAllBillsEntered] = useState(false);

  const handleScanComplete = (text: string) => {
    setScanResult(text);
    
    // Extract data from OCR text - in a real app, this would be more sophisticated
    const usageMatch = text.match(/Usage: (\d+\.?\d*)/);
    if (usageMatch) setUsage(usageMatch[1]);
    
    const amountMatch = text.match(/Amount: \$(\d+\.?\d*)/);
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
      
      // In a real app, we would check if all bill types have been entered
      // For demo purposes, let's randomly decide if all bills are entered
      const randomAllBills = Math.random() > 0.5;
      setAllBillsEntered(randomAllBills);
      
      // Show appropriate toast message
      if (randomAllBills) {
        toast.success("All Bill Types Recorded!", {
          description: "View your comprehensive consumption report to see savings opportunities.",
          action: {
            label: "View Report",
            onClick: () => window.location.href = "/bills-summary",
          },
        });
      } else {
        toast.success("Electricity Bill Recorded Successfully", {
          description: "Continue adding your other utility bills for a complete analysis.",
          action: {
            label: "View Goals",
            onClick: () => window.location.href = "/consumption-goals",
          },
        });
      }
      
      // Reset after showing success
      setTimeout(() => {
        setScanResult(null);
        setIsManualEntry(false);
        setIsSubmitted(false);
        setUsage("");
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
                ? "Enter Electricity Bill Details" 
                : "Verify Extracted Information"}
            </h2>
            <Separator />
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="usage">Electricity Usage (kWh)</Label>
                <Input 
                  id="usage" 
                  value={usage} 
                  onChange={e => setUsage(e.target.value)}
                  placeholder="Enter electricity usage in kilowatt-hours"
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Bill Amount ($)</Label>
                <Input 
                  id="amount" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Enter bill amount in dollars"
                  type="number"
                  step="0.01"
                />
              </div>
              
              <div>
                <Label htmlFor="date">Bill Date</Label>
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
                className="bg-ecoGreen hover:bg-ecoGreen-dark"
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Bill
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
              <Zap className="h-8 w-8 text-ecoGreen" />
              <h1 className="text-2xl font-bold text-gray-900">Electricity Bill Tracker</h1>
            </div>
            <p className="text-gray-600 mt-2">Track your electricity consumption by scanning or manually entering your bill</p>
          </header>
          
          {isSubmitted ? (
            <Card className="bg-green-50 border-green-100">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Bill Successfully Recorded!</h2>
                  <p className="text-gray-600 mb-4">You've earned 30 eco points for tracking your electricity usage.</p>
                  
                  {allBillsEntered ? (
                    <Link to="/bills-summary">
                      <Button className="bg-ecoGreen hover:bg-ecoGreen-dark mb-2">
                        View Consumption Report
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/consumption-goals">
                      <Button className="bg-ecoGreen hover:bg-ecoGreen-dark mb-2">
                        View Consumption Goals
                      </Button>
                    </Link>
                  )}
                  
                  {!allBillsEntered && (
                    <div className="mt-4 bg-green-50 rounded-lg p-4 text-left max-w-md">
                      <h3 className="font-medium text-gray-900 mb-1">Next Steps</h3>
                      <p className="text-sm text-gray-600">
                        For a complete analysis of your consumption patterns and potential savings, add your water and fuel bills too.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : scanResult || isManualEntry ? (
            renderEntryForm()
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Add Your Electricity Bill</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Scan your bill or enter details manually to track your consumption
                </p>
              </div>
              
              <ScanButton 
                onScanComplete={handleScanComplete}
                onManualEntry={handleManualEntry}
                variant="electricity" 
                className="mb-8 h-20 w-20"
              />
              
              <div className="bg-green-50 rounded-lg p-4 max-w-md">
                <h3 className="font-medium text-gray-900 mb-1">Electricity Saving Tip</h3>
                <p className="text-sm text-gray-600">
                  Switch to LED bulbs - they use up to 75% less energy than incandescent lighting and last 25 times longer.
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

export default ElectricityBill;


import { useState, useEffect } from "react";
import { Droplet, Zap, Fuel, CheckCircle2, AlertTriangle, ArrowDown, BarChart } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const BillsSummary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<{
    water: {
      current: number;
      target: number;
      unit: string;
      tips: string[];
      savings: number;
    };
    electricity: {
      current: number;
      target: number;
      unit: string;
      tips: string[];
      savings: number;
    };
    petrol: {
      current: number;
      target: number;
      unit: string;
      tips: string[];
      savings: number;
    };
  } | null>(null);

  // Simulate fetching data
  useEffect(() => {
    setTimeout(() => {
      // In a real app, this would be calculated based on user's bills and location
      setSummaryData({
        water: {
          current: 154,
          target: 130,
          unit: "liters/day",
          tips: [
            "Fix leaky faucets (saves up to 20L per day)",
            "Take 5-minute showers instead of 10-minute ones (saves 50L per day)",
            "Install low-flow showerheads (cuts usage by 40%)"
          ],
          savings: 15
        },
        electricity: {
          current: 11.3,
          target: 8.5,
          unit: "kWh/day",
          tips: [
            "Replace all bulbs with LEDs (saves 1.5 kWh/day)",
            "Unplug electronics when not in use (saves 0.8 kWh/day)",
            "Wash clothes in cold water (saves 0.5 kWh/load)"
          ],
          savings: 25
        },
        petrol: {
          current: 1.8,
          target: 1.2,
          unit: "liters/day",
          tips: [
            "Combine errands into single trips (saves 20% fuel)",
            "Maintain proper tire pressure (improves efficiency by 3%)",
            "Remove excess weight from vehicle (100kg less = 5% fuel savings)"
          ],
          savings: 30
        }
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  // Calculate percentage of current usage compared to target
  const calculatePercentage = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  // Get progress color based on percentage
  const getProgressColor = (current: number, target: number) => {
    const percentage = calculatePercentage(current, target);
    if (percentage <= 85) return "bg-green-500";
    if (percentage <= 100) return "bg-amber-500";
    return "bg-red-500";
  };

  // Calculate the reduction needed
  const calculateReduction = (current: number, target: number) => {
    const reduction = ((current - target) / current) * 100;
    return Math.max(0, Math.round(reduction));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Navbar className="hidden md:flex" />
        <main className="flex-1 pt-6 px-4 pb-20 md:pb-6 md:pl-24">
          <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <div className="animate-spin h-10 w-10 border-4 border-ecoGreen border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Generating your consumption summary and recommendations...</p>
            </div>
          </div>
        </main>
        <Navbar className="md:hidden" />
      </div>
    );
  }

  if (!summaryData) return null;

  const totalSavings = Math.round((summaryData.water.savings + summaryData.electricity.savings + summaryData.petrol.savings) / 3);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar className="hidden md:flex" />
      
      <main className="flex-1 pt-6 px-4 pb-20 md:pb-6 md:pl-24">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-3">
              <BarChart className="h-8 w-8 text-ecoGreen" />
              <h1 className="text-2xl font-bold text-gray-900">Your Consumption Summary</h1>
            </div>
            <p className="text-gray-600 mt-2">
              Based on all your scanned bills, here's an overview of your current consumption and targets
            </p>
          </header>
          
          <div className="bg-green-50 border border-green-100 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" />
                  Potential Monthly Savings
                </h2>
                <p className="text-green-700 mt-1">
                  Following these recommendations could help you save approximately {totalSavings}% on your utility bills.
                </p>
              </div>
              <Link to="/consumption-goals">
                <Button className="bg-ecoGreen hover:bg-ecoGreen-dark">
                  View Detailed Goals
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="space-y-8 mb-8">
            {/* Water Consumption */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Droplet className="h-6 w-6 text-ecoBlue" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Water Consumption</h3>
                        <div className="flex items-center mt-1">
                          <Badge className="bg-amber-100 text-amber-800">
                            Current: {summaryData.water.current} {summaryData.water.unit}
                          </Badge>
                          <ArrowDown className="h-4 w-4 mx-2 text-green-500" />
                          <Badge className="bg-green-100 text-green-800">
                            Target: {summaryData.water.target} {summaryData.water.unit}
                          </Badge>
                        </div>
                      </div>
                      
                      <Badge className="bg-blue-100 text-blue-800 mt-2 md:mt-0">
                        Potential Savings: {summaryData.water.savings}%
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Current Usage</span>
                        <span className="font-medium text-gray-700">Target</span>
                      </div>
                      <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`absolute top-0 left-0 h-full ${getProgressColor(summaryData.water.current, summaryData.water.target)}`} 
                          style={{ width: `${Math.min(100, (summaryData.water.current / summaryData.water.target) * 100)}%` }}
                        ></div>
                      </div>
                      {summaryData.water.current > summaryData.water.target && (
                        <p className="text-sm text-amber-600 mt-1 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Reduce consumption by {calculateReduction(summaryData.water.current, summaryData.water.target)}% to meet target
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Quick Tips:</h4>
                      <ul className="space-y-1">
                        {summaryData.water.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Electricity Consumption */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Zap className="h-6 w-6 text-ecoGreen" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Electricity Consumption</h3>
                        <div className="flex items-center mt-1">
                          <Badge className="bg-amber-100 text-amber-800">
                            Current: {summaryData.electricity.current} {summaryData.electricity.unit}
                          </Badge>
                          <ArrowDown className="h-4 w-4 mx-2 text-green-500" />
                          <Badge className="bg-green-100 text-green-800">
                            Target: {summaryData.electricity.target} {summaryData.electricity.unit}
                          </Badge>
                        </div>
                      </div>
                      
                      <Badge className="bg-blue-100 text-blue-800 mt-2 md:mt-0">
                        Potential Savings: {summaryData.electricity.savings}%
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Current Usage</span>
                        <span className="font-medium text-gray-700">Target</span>
                      </div>
                      <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`absolute top-0 left-0 h-full ${getProgressColor(summaryData.electricity.current, summaryData.electricity.target)}`} 
                          style={{ width: `${Math.min(100, (summaryData.electricity.current / summaryData.electricity.target) * 100)}%` }}
                        ></div>
                      </div>
                      {summaryData.electricity.current > summaryData.electricity.target && (
                        <p className="text-sm text-amber-600 mt-1 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Reduce consumption by {calculateReduction(summaryData.electricity.current, summaryData.electricity.target)}% to meet target
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Quick Tips:</h4>
                      <ul className="space-y-1">
                        {summaryData.electricity.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Petrol Consumption */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Fuel className="h-6 w-6 text-ecoEarth-dark" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Fuel Consumption</h3>
                        <div className="flex items-center mt-1">
                          <Badge className="bg-amber-100 text-amber-800">
                            Current: {summaryData.petrol.current} {summaryData.petrol.unit}
                          </Badge>
                          <ArrowDown className="h-4 w-4 mx-2 text-green-500" />
                          <Badge className="bg-green-100 text-green-800">
                            Target: {summaryData.petrol.target} {summaryData.petrol.unit}
                          </Badge>
                        </div>
                      </div>
                      
                      <Badge className="bg-blue-100 text-blue-800 mt-2 md:mt-0">
                        Potential Savings: {summaryData.petrol.savings}%
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Current Usage</span>
                        <span className="font-medium text-gray-700">Target</span>
                      </div>
                      <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`absolute top-0 left-0 h-full ${getProgressColor(summaryData.petrol.current, summaryData.petrol.target)}`} 
                          style={{ width: `${Math.min(100, (summaryData.petrol.current / summaryData.petrol.target) * 100)}%` }}
                        ></div>
                      </div>
                      {summaryData.petrol.current > summaryData.petrol.target && (
                        <p className="text-sm text-amber-600 mt-1 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Reduce consumption by {calculateReduction(summaryData.petrol.current, summaryData.petrol.target)}% to meet target
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Quick Tips:</h4>
                      <ul className="space-y-1">
                        {summaryData.petrol.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="rounded-lg bg-white border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Action Plan</h2>
            <p className="text-gray-600 mb-6">
              Based on your consumption across all utilities, here are the key steps to reduce your ecological footprint and save money:
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ecoGreen text-ecoGreen font-medium flex-shrink-0">1</div>
                <div>
                  <h3 className="font-medium text-gray-800">Start with high-impact changes</h3>
                  <p className="text-sm text-gray-600 mt-1">Focus on fixing leaky faucets, switching to LED bulbs, and combining errands to reduce travel - these changes have the biggest impact for minimal effort.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ecoGreen text-ecoGreen font-medium flex-shrink-0">2</div>
                <div>
                  <h3 className="font-medium text-gray-800">Track weekly progress</h3>
                  <p className="text-sm text-gray-600 mt-1">Monitor your consumption weekly by checking meters or estimating usage to stay on track with your goals.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ecoGreen text-ecoGreen font-medium flex-shrink-0">3</div>
                <div>
                  <h3 className="font-medium text-gray-800">Involve your household</h3>
                  <p className="text-sm text-gray-600 mt-1">Share these goals with everyone in your home and work together to develop new, more sustainable habits.</p>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  By following these recommendations, you could save approximately:
                </p>
                <p className="text-lg font-bold text-green-600">
                  ${Math.round(125 * totalSavings / 100)} per month on your utility bills
                </p>
              </div>
              
              <Link to="/tips">
                <Button className="bg-ecoGreen hover:bg-ecoGreen-dark">
                  View All Eco Tips
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Navbar className="md:hidden" />
    </div>
  );
};

export default BillsSummary;

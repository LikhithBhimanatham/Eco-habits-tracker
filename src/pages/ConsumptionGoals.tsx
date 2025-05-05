
import { useState, useEffect } from "react";
import { Droplet, Zap, Fuel, BarChart, ArrowDown, CalendarClock, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Define interfaces for our consumption targets
interface ConsumptionGoal {
  type: "water" | "electricity" | "petrol";
  currentUsage: number;
  recommendedDaily: number;
  recommendedMonthly: number;
  unit: string;
  savingTips: string[];
  habits: string[];
}

const ConsumptionGoals = () => {
  const [goals, setGoals] = useState<ConsumptionGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Load consumption data from local storage (in a real app, this would come from a database)
  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      // These would typically be calculated based on the user's bills and location
      const mockGoals: ConsumptionGoal[] = [
        {
          type: "water",
          currentUsage: 150,
          recommendedDaily: 130,
          recommendedMonthly: 3900,
          unit: "liters",
          savingTips: [
            "Fix leaky faucets immediately",
            "Take shorter showers (aim for 5 minutes)",
            "Install low-flow showerheads and toilets",
            "Turn off the tap while brushing teeth"
          ],
          habits: [
            "Collect cold water while waiting for hot water",
            "Use a basin when washing vegetables",
            "Water plants in the early morning or evening",
            "Reuse water from cooking (once cooled) for plants"
          ]
        },
        {
          type: "electricity",
          currentUsage: 10.7,
          recommendedDaily: 8.5,
          recommendedMonthly: 255,
          unit: "kWh",
          savingTips: [
            "Switch to LED bulbs throughout your home",
            "Unplug electronics when not in use",
            "Use natural light during daytime",
            "Set your thermostat 1-2 degrees lower in winter and higher in summer"
          ],
          habits: [
            "Turn off lights when leaving a room",
            "Use power strips to eliminate standby power",
            "Run full loads of laundry and dishes",
            "Air-dry clothes when possible"
          ]
        },
        {
          type: "petrol",
          currentUsage: 1.8,
          recommendedDaily: 1.2,
          recommendedMonthly: 36,
          unit: "liters",
          savingTips: [
            "Remove excess weight from your vehicle",
            "Keep tires properly inflated",
            "Avoid excessive idling",
            "Use cruise control on highways"
          ],
          habits: [
            "Plan efficient routes to combine errands",
            "Walk or bike for short-distance trips",
            "Carpool when possible",
            "Maintain your vehicle with regular tune-ups"
          ]
        }
      ];
      
      setGoals(mockGoals);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Calculate the percentage of current usage compared to recommended
  const calculatePercentage = (current: number, recommended: number) => {
    return Math.min(100, Math.round((current / recommended) * 100));
  };

  // Get the appropriate icon for each consumption type
  const getIconForType = (type: "water" | "electricity" | "petrol") => {
    switch (type) {
      case "water": return <Droplet className="h-6 w-6 text-ecoBlue" />;
      case "electricity": return <Zap className="h-6 w-6 text-ecoGreen" />;
      case "petrol": return <Fuel className="h-6 w-6 text-ecoEarth-dark" />;
    }
  };
  
  // Get the appropriate color class for the progress bar based on usage percentage
  const getProgressColorClass = (percentage: number) => {
    if (percentage <= 80) return "bg-green-500";
    if (percentage <= 100) return "bg-amber-500";
    return "bg-red-500";
  };

  // Get title based on consumption type
  const getTitleForType = (type: "water" | "electricity" | "petrol") => {
    switch (type) {
      case "water": return "Water";
      case "electricity": return "Electricity";
      case "petrol": return "Fuel";
    }
  };

  // Handle saving goals to user profile
  const handleSaveGoals = () => {
    // In a real app, this would save to the database
    toast({
      title: "Goals Saved",
      description: "Your consumption goals have been saved to your profile.",
    });
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
              <p className="text-gray-600">Calculating your recommended consumption goals...</p>
            </div>
          </div>
        </main>
        <Navbar className="md:hidden" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar className="hidden md:flex" />
      
      <main className="flex-1 pt-6 px-4 pb-20 md:pb-6 md:pl-24">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-3">
              <BarChart className="h-8 w-8 text-ecoGreen" />
              <h1 className="text-2xl font-bold text-gray-900">Your Consumption Goals</h1>
            </div>
            <p className="text-gray-600 mt-2">
              Based on your bill entries, here are your recommended daily and monthly consumption targets
            </p>
          </header>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
            <h2 className="text-lg font-medium text-blue-800 mb-2 flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              Daily Consumption Targets
            </h2>
            <p className="text-blue-700">
              Following these targets can help you reduce your bills by up to 25% while contributing to environmental conservation.
            </p>
          </div>
          
          <div className="space-y-6 mb-8">
            {goals.map((goal) => (
              <Card key={goal.type} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="md:flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        {getIconForType(goal.type)}
                        <h3 className="text-xl font-semibold text-gray-900">{getTitleForType(goal.type)}: Daily Target</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="font-medium text-gray-700">Current Daily: {goal.currentUsage} {goal.unit}</span>
                            <span className="font-medium text-gray-700">Target: {goal.recommendedDaily} {goal.unit}</span>
                          </div>
                          <div className="relative">
                            <Progress 
                              value={calculatePercentage(goal.currentUsage, goal.recommendedDaily)} 
                              className={`h-3 ${getProgressColorClass(calculatePercentage(goal.currentUsage, goal.recommendedDaily))}`}
                            />
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-600">
                            <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
                            <span>Reduce by {Math.max(0, Math.round((goal.currentUsage - goal.recommendedDaily) / goal.currentUsage * 100))}% to meet target</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-gray-600 mb-2">Monthly target: {goal.recommendedMonthly} {goal.unit}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-1/2 lg:w-2/5">
                      <h4 className="font-medium text-gray-800 mb-2">Key Habits to Develop:</h4>
                      <ul className="space-y-1 text-sm text-gray-600 mb-4">
                        {goal.habits.map((habit, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{habit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="rounded-lg border bg-white p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Action Plan</h2>
            <p className="text-gray-600 mb-6">
              Follow these steps to reach your consumption goals and track your progress:
            </p>
            
            <ol className="space-y-4 mb-6">
              <li className="flex gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ecoGreen text-ecoGreen font-medium">1</div>
                <div>
                  <h3 className="font-medium text-gray-800">Set Achievable Goals</h3>
                  <p className="text-gray-600 text-sm mt-1">Start with small reductions in your daily consumption and gradually work toward the recommended targets.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ecoGreen text-ecoGreen font-medium">2</div>
                <div>
                  <h3 className="font-medium text-gray-800">Implement Eco Tips</h3>
                  <p className="text-gray-600 text-sm mt-1">Visit our tips page to find actionable recommendations for reducing consumption.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ecoGreen text-ecoGreen font-medium">3</div>
                <div>
                  <h3 className="font-medium text-gray-800">Track Your Progress</h3>
                  <p className="text-gray-600 text-sm mt-1">Continue scanning your bills regularly to monitor your consumption and see improvements.</p>
                </div>
              </li>
            </ol>
            
            <Separator className="my-6" />
            
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button onClick={handleSaveGoals} className="bg-ecoGreen hover:bg-ecoGreen-dark">
                Save These Goals
              </Button>
              <Link to="/tips">
                <Button variant="outline">
                  View Eco Tips
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

export default ConsumptionGoals;

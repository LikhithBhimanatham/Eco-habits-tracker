
import { useState, useEffect } from "react";
import { Lightbulb, Droplet, Fuel, Check, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Recommendation interface
interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  type: "water" | "electricity" | "petrol";
  completed: boolean;
}

const Tips = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "water" | "electricity" | "petrol">("all");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const { toast } = useToast();
  
  // Load recommendations (in a real app, this would come from a database)
  useEffect(() => {
    const initialRecommendations: Recommendation[] = [
      {
        id: "w1",
        title: "Fix leaky faucets",
        description: "A dripping faucet can waste up to 20 gallons of water per day. Check all faucets and fix any leaks.",
        impact: "medium",
        type: "water",
        completed: false
      },
      {
        id: "w2",
        title: "Install low-flow showerheads",
        description: "Low-flow showerheads use up to 60% less water while maintaining good pressure.",
        impact: "high",
        type: "water",
        completed: false
      },
      {
        id: "w3",
        title: "Collect rainwater for plants",
        description: "Use rain barrels to collect water for your garden and indoor plants.",
        impact: "medium",
        type: "water",
        completed: false
      },
      {
        id: "e1",
        title: "Switch to LED bulbs",
        description: "LED bulbs use up to 90% less energy than incandescent bulbs and last much longer.",
        impact: "high",
        type: "electricity",
        completed: false
      },
      {
        id: "e2",
        title: "Unplug electronics when not in use",
        description: "Many devices draw power even when turned off. Use power strips to eliminate standby power consumption.",
        impact: "medium",
        type: "electricity",
        completed: false
      },
      {
        id: "e3",
        title: "Wash clothes in cold water",
        description: "Up to 90% of the energy used by washing machines goes to heating water.",
        impact: "medium",
        type: "electricity",
        completed: false
      },
      {
        id: "p1",
        title: "Maintain proper tire pressure",
        description: "Under-inflated tires can lower gas mileage by about 0.2% for every 1 PSI drop.",
        impact: "medium",
        type: "petrol",
        completed: false
      },
      {
        id: "p2",
        title: "Remove excess weight from vehicle",
        description: "Extra weight in your vehicle reduces fuel efficiency. Remove unnecessary items from your trunk.",
        impact: "low",
        type: "petrol",
        completed: false
      },
      {
        id: "p3",
        title: "Plan efficient routes",
        description: "Combine errands into one trip and plan the most efficient route to reduce driving distance.",
        impact: "high",
        type: "petrol",
        completed: false
      }
    ];
    
    // Get completed tips from local storage if available
    const savedTips = localStorage.getItem("completedTips");
    if (savedTips) {
      const completedIds = JSON.parse(savedTips) as string[];
      
      const updatedRecommendations = initialRecommendations.map(rec => ({
        ...rec,
        completed: completedIds.includes(rec.id)
      }));
      
      setRecommendations(updatedRecommendations);
    } else {
      setRecommendations(initialRecommendations);
    }
  }, []);
  
  // Handle marking a tip as completed
  const handleMarkCompleted = (id: string) => {
    const updatedRecommendations = recommendations.map(rec =>
      rec.id === id ? { ...rec, completed: !rec.completed } : rec
    );
    
    setRecommendations(updatedRecommendations);
    
    // Save to local storage
    const completedIds = updatedRecommendations
      .filter(rec => rec.completed)
      .map(rec => rec.id);
    localStorage.setItem("completedTips", JSON.stringify(completedIds));
    
    // Show notification
    const tip = recommendations.find(rec => rec.id === id);
    
    if (tip) {
      if (!tip.completed) {
        toast({
          title: "Eco Action Completed!",
          description: `You've earned 15 eco points for completing "${tip.title}"`,
        });
      }
    }
  };
  
  // Filter recommendations based on active filter
  const filteredRecommendations = activeFilter === "all"
    ? recommendations
    : recommendations.filter(rec => rec.type === activeFilter);
    
  // Get counts for the filter badges
  const waterCount = recommendations.filter(rec => rec.type === "water").length;
  const electricityCount = recommendations.filter(rec => rec.type === "electricity").length;
  const petrolCount = recommendations.filter(rec => rec.type === "petrol").length;
  
  // Get icon based on type
  const getIconForType = (type: "water" | "electricity" | "petrol") => {
    switch (type) {
      case "water": return <Droplet className="h-5 w-5 text-ecoBlue" />;
      case "electricity": return <Lightbulb className="h-5 w-5 text-ecoGreen" />;
      case "petrol": return <Fuel className="h-5 w-5 text-ecoEarth-dark" />;
    }
  };
  
  // Get badge style based on impact
  const getImpactBadgeStyle = (impact: "high" | "medium" | "low") => {
    switch (impact) {
      case "high": 
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "medium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "low":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar className="hidden md:flex" />
      
      <main className="flex-1 pt-6 px-4 pb-20 md:pb-6 md:pl-24">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-amber-400" />
              <h1 className="text-2xl font-bold text-gray-900">Eco Tips & Recommendations</h1>
            </div>
            <p className="text-gray-600 mt-2">
              Practical ways to reduce your consumption and save resources
            </p>
          </header>
          
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-8">
            <h2 className="text-lg font-medium text-amber-800 mb-2">Save Money & The Planet</h2>
            <p className="text-amber-700">
              Implementing these recommendations can help you save up to 30% on your utility bills while reducing your environmental impact.
            </p>
          </div>
          
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={activeFilter === "all" ? "default" : "outline"}
              onClick={() => setActiveFilter("all")}
              className="rounded-full"
            >
              All Tips
              <Badge variant="secondary" className="ml-2 bg-gray-200">
                {recommendations.length}
              </Badge>
            </Button>
            
            <Button 
              variant={activeFilter === "water" ? "default" : "outline"}
              onClick={() => setActiveFilter("water")}
              className={`rounded-full ${activeFilter === "water" ? "bg-ecoBlue hover:bg-ecoBlue-dark" : ""}`}
            >
              <Droplet className="h-4 w-4 mr-2" />
              Water
              <Badge variant="secondary" className="ml-2 bg-gray-200">
                {waterCount}
              </Badge>
            </Button>
            
            <Button 
              variant={activeFilter === "electricity" ? "default" : "outline"}
              onClick={() => setActiveFilter("electricity")}
              className={`rounded-full ${activeFilter === "electricity" ? "bg-ecoGreen hover:bg-ecoGreen-dark" : ""}`}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Electricity
              <Badge variant="secondary" className="ml-2 bg-gray-200">
                {electricityCount}
              </Badge>
            </Button>
            
            <Button 
              variant={activeFilter === "petrol" ? "default" : "outline"}
              onClick={() => setActiveFilter("petrol")}
              className={`rounded-full ${activeFilter === "petrol" ? "bg-ecoEarth-dark hover:bg-ecoEarth" : ""}`}
            >
              <Fuel className="h-4 w-4 mr-2" />
              Petrol
              <Badge variant="secondary" className="ml-2 bg-gray-200">
                {petrolCount}
              </Badge>
            </Button>
          </div>
          
          <div className="space-y-4 mb-8">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map(rec => (
                <Card 
                  key={rec.id} 
                  className={`overflow-hidden transition-all ${rec.completed ? "bg-gray-50 border-gray-200" : ""}`}
                >
                  <CardContent className="p-0">
                    <div className="p-4 flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        rec.type === "water" ? "bg-blue-50" : 
                        rec.type === "electricity" ? "bg-green-50" : "bg-amber-50"
                      }`}>
                        {getIconForType(rec.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${rec.completed ? "text-gray-500 line-through" : "text-gray-900"}`}>
                            {rec.title}
                          </h3>
                          <Badge className={getImpactBadgeStyle(rec.impact)}>
                            {rec.impact === "high" ? "High Impact" : 
                             rec.impact === "medium" ? "Medium Impact" : "Low Impact"}
                          </Badge>
                        </div>
                        
                        <p className={`text-sm mt-1 ${rec.completed ? "text-gray-400" : "text-gray-600"}`}>
                          {rec.description}
                        </p>
                      </div>
                      
                      <Button
                        variant={rec.completed ? "outline" : "default"}
                        size="sm"
                        className={rec.completed ? "border-green-200" : ""}
                        onClick={() => handleMarkCompleted(rec.id)}
                      >
                        {rec.completed ? (
                          <>
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            Done
                          </>
                        ) : (
                          <>
                            Mark Complete
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                No tips available for the selected filter.
              </div>
            )}
          </div>
          
          <div className="rounded-lg border p-4 bg-white">
            <h3 className="font-medium text-gray-900 mb-2">Track Your Progress</h3>
            <p className="text-sm text-gray-600 mb-4">
              Implementing these eco-friendly actions will help you reduce your environmental footprint and save money on your utility bills.
            </p>
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">
                Tips completed: {recommendations.filter(r => r.completed).length} of {recommendations.length}
              </p>
              <Button variant="outline" size="sm" onClick={() => setActiveFilter("all")}>
                View All
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Navbar className="md:hidden" />
    </div>
  );
};

export default Tips;


import { Droplet, Zap, Fuel, Award, TrendingUp, TrendingDown, BarChart } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar className="hidden md:flex" />
      
      <main className="flex-1 pt-6 px-4 pb-20 md:pb-6 md:pl-24">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Eco Habits Tracker</h1>
            <p className="text-gray-600 mt-2">Track your bills, reduce consumption, save the planet</p>
          </header>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Consumption Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCard 
                title="Water Usage" 
                value="45.2 m³" 
                description="Last 30 days consumption" 
                icon={Droplet} 
                trend="down"
                trendValue="5.2% from last month"
                className="bg-gradient-to-br from-ecoBlue-light to-white border-ecoBlue/20"
              />
              <SummaryCard 
                title="Electricity Usage" 
                value="320 kWh" 
                description="Last 30 days consumption" 
                icon={Zap} 
                trend="up"
                trendValue="2.8% from last month"
                className="bg-gradient-to-br from-ecoGreen-light to-white border-ecoGreen/20"
              />
              <SummaryCard 
                title="Fuel Usage" 
                value="52.6 L" 
                description="Last 30 days consumption" 
                icon={Fuel} 
                trend="neutral"
                trendValue="0.3% from last month"
                className="bg-gradient-to-br from-ecoEarth-light to-white border-ecoEarth/20"
              />
            </div>
          </section>
          
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link to="/water-bill" className="no-underline">
                <Button variant="outline" className="w-full h-28 flex flex-col p-4 border-2 hover:border-ecoBlue hover:text-ecoBlue">
                  <Droplet className="h-8 w-8 mb-2 text-ecoBlue" />
                  <span>Scan Water Bill</span>
                </Button>
              </Link>
              <Link to="/electricity-bill" className="no-underline">
                <Button variant="outline" className="w-full h-28 flex flex-col p-4 border-2 hover:border-ecoGreen hover:text-ecoGreen">
                  <Zap className="h-8 w-8 mb-2 text-ecoGreen" />
                  <span>Scan Electricity Bill</span>
                </Button>
              </Link>
              <Link to="/petrol-bill" className="no-underline">
                <Button variant="outline" className="w-full h-28 flex flex-col p-4 border-2 hover:border-ecoEarth-dark hover:text-ecoEarth-dark">
                  <Fuel className="h-8 w-8 mb-2 text-ecoEarth-dark" />
                  <span>Scan Petrol Bill</span>
                </Button>
              </Link>
              <Link to="/leaderboard" className="no-underline">
                <Button variant="outline" className="w-full h-28 flex flex-col p-4 border-2 hover:border-amber-400 hover:text-amber-400">
                  <Award className="h-8 w-8 mb-2 text-amber-400" />
                  <span>View Leaderboard</span>
                </Button>
              </Link>
              <Link to="/consumption-goals" className="no-underline">
                <Button variant="outline" className="w-full h-28 flex flex-col p-4 border-2 hover:border-ecoGreen hover:text-ecoGreen">
                  <BarChart className="h-8 w-8 mb-2 text-ecoGreen" />
                  <span>Daily Consumption Goals</span>
                </Button>
              </Link>
            </div>
          </section>
          
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Eco Tips</h2>
              <Link to="/tips">
                <Button variant="link" className="text-ecoGreen">See all tips</Button>
              </Link>
            </div>
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <h3 className="font-medium text-gray-900">Reduce Standby Power</h3>
              <p className="text-sm text-gray-600 mt-1">
                Unplug electronic devices when not in use or use power strips to eliminate standby power consumption. This can save up to 10% on your electricity bill.
              </p>
            </div>
          </section>
        </div>
      </main>
      
      <Navbar className="md:hidden" />
    </div>
  );
};

export default Index;

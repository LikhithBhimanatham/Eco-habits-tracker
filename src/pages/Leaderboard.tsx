
import { useState } from "react";
import { Award, Users } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { LeaderboardCard, LeaderboardUser } from "@/components/leaderboard/leaderboard-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Leaderboard = () => {
  // Mock leaderboard data
  const [weeklyLeaders] = useState<LeaderboardUser[]>([
    { id: 1, name: "Emma Wilson", points: 245, savingsPercent: 84, rank: 1 },
    { id: 2, name: "James Carter", points: 210, savingsPercent: 72, rank: 2 },
    { id: 3, name: "Olivia Martinez", points: 185, savingsPercent: 65, rank: 3 },
    { id: 4, name: "Noah Thompson", points: 160, savingsPercent: 58, rank: 4 },
    { id: 5, name: "Sophia Lee", points: 145, savingsPercent: 51, rank: 5 }
  ]);
  
  const [monthlyLeaders] = useState<LeaderboardUser[]>([
    { id: 2, name: "James Carter", points: 820, savingsPercent: 88, rank: 1 },
    { id: 1, name: "Emma Wilson", points: 790, savingsPercent: 82, rank: 2 },
    { id: 5, name: "Sophia Lee", points: 735, savingsPercent: 77, rank: 3 },
    { id: 3, name: "Olivia Martinez", points: 690, savingsPercent: 70, rank: 4 },
    { id: 4, name: "Noah Thompson", points: 605, savingsPercent: 62, rank: 5 }
  ]);
  
  const [allTimeLeaders] = useState<LeaderboardUser[]>([
    { id: 5, name: "Sophia Lee", points: 3560, savingsPercent: 91, rank: 1 },
    { id: 2, name: "James Carter", points: 3240, savingsPercent: 87, rank: 2 },
    { id: 1, name: "Emma Wilson", points: 2980, savingsPercent: 80, rank: 3 },
    { id: 4, name: "Noah Thompson", points: 2450, savingsPercent: 76, rank: 4 },
    { id: 3, name: "Olivia Martinez", points: 2210, savingsPercent: 72, rank: 5 }
  ]);

  // Find maximum points for progress bar scaling
  const weeklyMaxPoints = Math.max(...weeklyLeaders.map(u => u.points));
  const monthlyMaxPoints = Math.max(...monthlyLeaders.map(u => u.points));
  const allTimeMaxPoints = Math.max(...allTimeLeaders.map(u => u.points));
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar className="hidden md:flex" />
      
      <main className="flex-1 pt-6 px-4 pb-20 md:pb-6 md:pl-24">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-amber-400" />
              <h1 className="text-2xl font-bold text-gray-900">Eco Leaderboard</h1>
            </div>
            <p className="text-gray-600 mt-2">See how you stack up against other eco-conscious users</p>
          </header>
          
          <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="w-full mb-8">
              <TabsTrigger value="weekly" className="flex-1">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="flex-1">Monthly</TabsTrigger>
              <TabsTrigger value="all-time" className="flex-1">All Time</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekly">
              <div className="bg-gradient-to-b from-amber-50 to-white p-4 rounded-lg mb-6 border border-amber-100">
                <div className="flex items-center gap-2 text-amber-800 mb-1">
                  <Users className="h-4 w-4" />
                  <h2 className="text-sm font-medium">This Week's Champions</h2>
                </div>
                <p className="text-sm text-amber-700">
                  Users who saved the most resources this week
                </p>
              </div>
              
              <div className="space-y-4">
                {weeklyLeaders.map((user) => (
                  <LeaderboardCard 
                    key={user.id}
                    user={user}
                    maxPoints={weeklyMaxPoints}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="monthly">
              <div className="bg-gradient-to-b from-amber-50 to-white p-4 rounded-lg mb-6 border border-amber-100">
                <div className="flex items-center gap-2 text-amber-800 mb-1">
                  <Users className="h-4 w-4" />
                  <h2 className="text-sm font-medium">This Month's Champions</h2>
                </div>
                <p className="text-sm text-amber-700">
                  Users who saved the most resources this month
                </p>
              </div>
              
              <div className="space-y-4">
                {monthlyLeaders.map((user) => (
                  <LeaderboardCard 
                    key={user.id}
                    user={user}
                    maxPoints={monthlyMaxPoints}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="all-time">
              <div className="bg-gradient-to-b from-amber-50 to-white p-4 rounded-lg mb-6 border border-amber-100">
                <div className="flex items-center gap-2 text-amber-800 mb-1">
                  <Users className="h-4 w-4" />
                  <h2 className="text-sm font-medium">All-Time Champions</h2>
                </div>
                <p className="text-sm text-amber-700">
                  Our most dedicated eco-warriors of all time
                </p>
              </div>
              
              <div className="space-y-4">
                {allTimeLeaders.map((user) => (
                  <LeaderboardCard 
                    key={user.id}
                    user={user}
                    maxPoints={allTimeMaxPoints}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 p-4 bg-white rounded-lg border shadow-sm">
            <h3 className="font-medium text-gray-900 mb-2">How Points Work</h3>
            <p className="text-sm text-gray-600">
              Earn eco points by consistently tracking your utility bills and reducing your consumption over time. 
              The more you reduce your impact on the environment, the more points you earn!
            </p>
          </div>
        </div>
      </main>
      
      <Navbar className="md:hidden" />
    </div>
  );
};

export default Leaderboard;

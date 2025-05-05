import { useState, useEffect } from "react";
import { Award, Users } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { LeaderboardCard, LeaderboardUser } from "@/components/leaderboard/leaderboard-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userService, initializeDemoData } from "@/services/api-service";
import { User } from "@/db/models";

const Leaderboard = () => {
  const [weeklyLeaders, setWeeklyLeaders] = useState<LeaderboardUser[]>([]);
  const [monthlyLeaders, setMonthlyLeaders] = useState<LeaderboardUser[]>([]);
  const [allTimeLeaders, setAllTimeLeaders] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Find maximum points for progress bar scaling
  const weeklyMaxPoints = Math.max(...(weeklyLeaders.length ? weeklyLeaders.map(u => u.points) : [0]));
  const monthlyMaxPoints = Math.max(...(monthlyLeaders.length ? monthlyLeaders.map(u => u.points) : [0]));
  const allTimeMaxPoints = Math.max(...(allTimeLeaders.length ? allTimeLeaders.map(u => u.points) : [0]));
  
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Initialize demo data in Supabase if needed
        await initializeDemoData();
        
        // Get users and transform them to leaderboard format
        const users = await userService.getAll();
        const transformedUsers = users.map((user, index) => ({
          id: user.id,
          name: user.name,
          points: user.points,
          savingsPercent: user.savingsPercent,
          rank: index + 1,
        }));
        
        // Sort by points (highest first)
        const sortedUsers = [...transformedUsers].sort((a, b) => b.points - a.points);
        
        // For demo purposes, we'll use the same data but with different multipliers
        const weeklyUsers = sortedUsers.map(user => ({
          ...user,
          points: Math.floor(user.points * 0.2), // 20% of total points for "weekly"
        })).sort((a, b) => b.points - a.points)
          .map((user, index) => ({ ...user, rank: index + 1 }))
          .slice(0, 5);
        
        const monthlyUsers = sortedUsers.map(user => ({
          ...user,
          points: Math.floor(user.points * 0.5), // 50% of total points for "monthly"
        })).sort((a, b) => b.points - a.points)
          .map((user, index) => ({ ...user, rank: index + 1 }))
          .slice(0, 5);
        
        // All time is just the full points
        const allTimeUsers = sortedUsers
          .map((user, index) => ({ ...user, rank: index + 1 }))
          .slice(0, 5);
        
        setWeeklyLeaders(weeklyUsers);
        setMonthlyLeaders(monthlyUsers);
        setAllTimeLeaders(allTimeUsers);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, []);
  
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
          
          {isLoading ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin h-10 w-10 border-4 border-ecoGreen border-t-transparent rounded-full"></div>
            </div>
          ) : (
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
                  
                  {weeklyLeaders.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No data available yet</p>
                  )}
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
                  
                  {monthlyLeaders.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No data available yet</p>
                  )}
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
                  
                  {allTimeLeaders.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No data available yet</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
          
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

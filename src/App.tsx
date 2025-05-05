
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import Index from "./pages/Index";
import WaterBill from "./pages/WaterBill";
import ElectricityBill from "./pages/ElectricityBill";
import PetrolBill from "./pages/PetrolBill";
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Tips from "./pages/Tips";
import ConsumptionGoals from "./pages/ConsumptionGoals";
import { useEffect } from "react";
import { initializeDemoData } from "@/db/db-service";

const queryClient = new QueryClient();

const App = () => {
  // Initialize the database with demo data on app start
  useEffect(() => {
    initializeDemoData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthWrapper>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/water-bill" element={<WaterBill />} />
              <Route path="/electricity-bill" element={<ElectricityBill />} />
              <Route path="/petrol-bill" element={<PetrolBill />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tips" element={<Tips />} />
              <Route path="/consumption-goals" element={<ConsumptionGoals />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

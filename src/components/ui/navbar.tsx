
import { Link, useNavigate } from 'react-router-dom';
import { Home, Droplet, Zap, Fuel, Award, Bell, LogOut } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { authService } from "@/services/index";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 shadow-sm md:static md:h-screen md:w-20 md:border-r md:border-t-0", className)}>
      <div className="grid h-full grid-cols-5 md:grid-cols-1 md:gap-4 md:py-8">
        <NavbarItem to="/" icon={<Home className="h-6 w-6" />} />
        <NavbarItem to="/water-bill" icon={<Droplet className="h-6 w-6 text-ecoBlue" />} />
        <NavbarItem to="/electricity-bill" icon={<Zap className="h-6 w-6 text-ecoGreen" />} />
        <NavbarItem to="/petrol-bill" icon={<Fuel className="h-6 w-6 text-ecoEarth-dark" />} />
        <NavbarItem to="/leaderboard" icon={<Award className="h-6 w-6 text-amber-400" />} />
        <NavbarItem to="/notifications" icon={<Bell className="h-6 w-6 text-blue-500" />} className="hidden md:flex" />
        
        {/* Logout button */}
        <div className="hidden md:flex flex-col items-center justify-center hover:bg-gray-50 transition-colors mt-auto mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface NavbarItemProps {
  to: string;
  icon: React.ReactNode;
  className?: string;
}

function NavbarItem({ to, icon, className }: NavbarItemProps) {
  return (
    <Link to={to} className={cn("flex flex-col items-center justify-center hover:bg-gray-50 transition-colors", className)}>
      <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
        {icon}
      </Button>
    </Link>
  );
}

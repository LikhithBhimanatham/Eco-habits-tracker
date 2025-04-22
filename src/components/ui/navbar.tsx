
import { Link } from 'react-router-dom';
import { Home, Droplet, Zap, Fuel, Award, Bell } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <div className={cn("fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 shadow-sm md:static md:h-screen md:w-20 md:border-r md:border-t-0", className)}>
      <div className="grid h-full grid-cols-5 md:grid-cols-1 md:gap-4 md:py-8">
        <NavbarItem to="/" icon={<Home className="h-6 w-6" />} />
        <NavbarItem to="/water-bill" icon={<Droplet className="h-6 w-6 text-ecoBlue" />} />
        <NavbarItem to="/electricity-bill" icon={<Zap className="h-6 w-6 text-ecoGreen" />} />
        <NavbarItem to="/petrol-bill" icon={<Fuel className="h-6 w-6 text-ecoEarth-dark" />} />
        <NavbarItem to="/leaderboard" icon={<Award className="h-6 w-6 text-amber-400" />} />
        <NavbarItem to="/notifications" icon={<Bell className="h-6 w-6 text-blue-500" />} className="hidden md:flex" />
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

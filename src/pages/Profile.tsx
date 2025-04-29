
import { UserProfileForm } from "@/components/user/user-profile-form";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar className="hidden md:flex" />
      
      <main className="flex-1 pt-6 px-4 pb-20 md:pb-6 md:pl-24">
        <div className="max-w-3xl mx-auto">
          <header className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Account Profile</h1>
              <p className="text-gray-600 mt-2">Manage your account and notification preferences</p>
            </div>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </header>
          
          <UserProfileForm />
        </div>
      </main>
      
      <Navbar className="md:hidden" />
    </div>
  );
};

export default Profile;

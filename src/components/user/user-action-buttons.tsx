
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface UserActionButtonsProps {
  onCreateNew: () => void;
  onLogout: () => void;
}

export function UserActionButtons({ onCreateNew, onLogout }: UserActionButtonsProps) {
  return (
    <div className="flex space-x-4">
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={onCreateNew}
      >
        <User className="h-4 w-4" />
        Create New User
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300" 
        onClick={onLogout}
      >
        Log Out
      </Button>
    </div>
  );
}


import { User } from "lucide-react";
import { ProfileFormValues } from "./types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CurrentUserDisplayProps {
  currentUser: ProfileFormValues | null;
}

export function CurrentUserDisplay({ currentUser }: CurrentUserDisplayProps) {
  if (!currentUser) return null;

  return (
    <Alert className="bg-blue-50 border-blue-200">
      <User className="h-5 w-5 text-blue-600" />
      <AlertTitle className="text-blue-800">Currently Logged In</AlertTitle>
      <AlertDescription className="text-blue-700">
        <div className="grid grid-cols-[80px_1fr] gap-1 mt-2">
          <span className="font-medium">User ID:</span>
          <span>{currentUser.name}</span>
          
          <span className="font-medium">Email:</span>
          <span>{currentUser.email}</span>
          
          <span className="font-medium">Password:</span>
          <span>{currentUser.password}</span>
        </div>
      </AlertDescription>
    </Alert>
  );
}

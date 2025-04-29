
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { profileSchema, ProfileFormValues } from "./types";
import { CurrentUserDisplay } from "./current-user-display";
import { UserActionButtons } from "./user-action-buttons";
import { ProfileFormFields } from "./profile-form-fields";

export function UserProfileForm() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<ProfileFormValues | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      notifications: true,
    },
  });

  // Check local storage for existing profile on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      // Don't auto-fill the password for security
      form.reset({
        name: profile.name || "",
        email: profile.email || "",
        password: "",
        notifications: profile.notifications !== undefined ? profile.notifications : true,
      });
      setCurrentUser({
        ...profile,
        password: "••••••••" // Mask the actual password
      });
      setIsLoggedIn(true);
    }
  }, [form]);

  function onSubmit(data: ProfileFormValues) {
    // Store in localStorage (this is just for demo, in a real app use a secure backend)
    const profileToSave = {
      name: data.name,
      email: data.email,
      // In a real app, never store raw passwords in localStorage
      // This is only for demonstration
      password: data.password,
      notifications: data.notifications,
    };
    
    localStorage.setItem("userProfile", JSON.stringify(profileToSave));
    setIsLoggedIn(true);
    setCurrentUser({
      ...profileToSave,
      password: "••••••••" // Mask the password in UI
    });
    setCreatingNew(false);
    
    toast({
      title: creatingNew ? "Profile Created" : "Profile Updated",
      description: creatingNew ? 
        "Your account has been created successfully." : 
        "Your profile has been successfully updated.",
    });
  }

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    form.reset({
      name: "",
      email: "",
      password: "",
      notifications: true,
    });
    setIsLoggedIn(false);
    setCurrentUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleCreateNew = () => {
    form.reset({
      name: "",
      email: "",
      password: "",
      notifications: true,
    });
    setCreatingNew(true);
  };

  const handleCancel = () => {
    if (currentUser) {
      form.reset({
        name: currentUser.name,
        email: currentUser.email,
        password: "",
        notifications: currentUser.notifications,
      });
    }
    setCreatingNew(false);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <div>
        <h2 className="text-2xl font-bold">
          {creatingNew ? "Create New User" : isLoggedIn ? "Your Profile" : "Create Profile"}
        </h2>
        <p className="text-muted-foreground">
          {creatingNew 
            ? "Set up a new account to track your utility usage" 
            : isLoggedIn 
              ? "Manage your account details and notification preferences"
              : "Set up your account to track your utility usage"
          }
        </p>
      </div>
      
      {isLoggedIn && !creatingNew && currentUser && (
        <CurrentUserDisplay currentUser={currentUser} />
      )}
      
      {isLoggedIn && !creatingNew && (
        <UserActionButtons 
          onCreateNew={handleCreateNew}
          onLogout={handleLogout}
        />
      )}
      
      {(creatingNew || !isLoggedIn) && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ProfileFormFields form={form} />
            
            <div className="flex justify-between">
              <Button type="submit" className="flex items-center gap-2">
                {creatingNew ? "Create User" : "Create Profile"}
              </Button>
              
              {creatingNew && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

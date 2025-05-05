
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
import { authService, userService } from "@/db/db-service";

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

  // Check for existing profile on component mount
  useEffect(() => {
    const loggedInUser = authService.getCurrentUser();
    
    if (loggedInUser) {
      form.reset({
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        password: "", // Don't auto-fill the password for security
        notifications: loggedInUser.notifications !== undefined ? loggedInUser.notifications : true,
      });
      
      setCurrentUser({
        ...loggedInUser,
        password: "••••••••" // Mask the actual password
      });
      
      setIsLoggedIn(true);
    }
  }, [form]);

  function onSubmit(data: ProfileFormValues) {
    if (creatingNew || !isLoggedIn) {
      try {
        // Creating a new user
        const newUser = userService.create({
          name: data.name,
          email: data.email,
          password: data.password,
          notifications: data.notifications
        });
        
        // Auto-login the user
        authService.login(data.email, data.password);
        
        setIsLoggedIn(true);
        setCurrentUser({
          ...newUser,
          password: "••••••••" // Mask the password in UI
        });
        setCreatingNew(false);
        
        toast({
          title: "Profile Created",
          description: "Your account has been created successfully.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to create account",
          variant: "destructive"
        });
      }
    } else {
      // Updating existing user
      const currentUserId = authService.getCurrentUser()?.id;
      
      if (currentUserId) {
        const updatedUser = userService.update(currentUserId, {
          name: data.name,
          email: data.email,
          notifications: data.notifications,
          // Only update password if provided
          ...(data.password && data.password !== "••••••••" ? { password: data.password } : {})
        });
        
        if (updatedUser) {
          setCurrentUser({
            ...updatedUser,
            password: "••••••••" // Mask the password in UI
          });
          
          toast({
            title: "Profile Updated",
            description: "Your profile has been successfully updated.",
          });
        }
      }
    }
  }

  const handleLogout = () => {
    authService.logout();
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

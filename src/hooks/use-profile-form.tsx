
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { authService, userService } from "@/services/index";
import { profileSchema, ProfileFormValues } from "@/components/user/types";

export function useProfileForm() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<ProfileFormValues | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      notifications: true,
    },
  });

  // Check for existing profile on component mount
  useEffect(() => {
    const checkCurrentUser = async () => {
      const loggedInUser = await authService.getCurrentUser();
      
      if (loggedInUser) {
        form.reset({
          username: loggedInUser.username || "",
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
    };
    
    checkCurrentUser();
  }, [form]);

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);
    
    if (creatingNew || !isLoggedIn) {
      try {
        // Check if user already exists
        const existingUser = await userService.getByEmail(data.email);
        
        if (existingUser) {
          toast({
            title: "Error",
            description: "An account with this email already exists.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
        
        // Creating a new user
        const newUser = await userService.create({
          username: data.username,
          email: data.email,
          password: data.password,
          notifications: data.notifications
        });
        
        // Auto-login the user
        await authService.login(data.email, data.password);
        
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
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Updating existing user
      const currentUser = await authService.getCurrentUser();
      
      if (currentUser?.id) {
        try {
          const updatedUser = await userService.update(currentUser.id, {
            username: data.username,
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
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Failed to update profile",
            variant: "destructive"
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  }

  const handleLogout = async () => {
    await authService.logout();
    form.reset({
      username: "",
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
      username: "",
      email: "",
      password: "",
      notifications: true,
    });
    setCreatingNew(true);
  };

  const handleCancel = () => {
    if (currentUser) {
      form.reset({
        username: currentUser.username,
        email: currentUser.email,
        password: "",
        notifications: currentUser.notifications,
      });
    }
    setCreatingNew(false);
  };

  return {
    form,
    isLoggedIn,
    currentUser,
    creatingNew,
    isSubmitting,
    onSubmit,
    handleLogout,
    handleCreateNew,
    handleCancel
  };
}

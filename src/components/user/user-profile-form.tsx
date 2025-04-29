
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, KeyRound, Mail } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the schema for user profile
const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  notifications: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

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
      )}
      
      {isLoggedIn && !creatingNew && (
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleCreateNew}
          >
            <User className="h-4 w-4" />
            Create New User
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300" 
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      )}
      
      {(creatingNew || !isLoggedIn) && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input 
                        placeholder="Enter your name" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input 
                        type="email" 
                        placeholder="your@email.com" 
                        className="pl-10"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Used for bill notifications and updates
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Receive email notifications</FormLabel>
                    <FormDescription>
                      Get updates about bill due dates and conservation tips
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
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

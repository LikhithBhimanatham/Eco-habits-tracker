
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
    
    toast({
      title: isLoggedIn ? "Profile Updated" : "Profile Created",
      description: isLoggedIn ? 
        "Your profile has been successfully updated." : 
        "Your account has been created successfully.",
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
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="space-y-6 max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <div>
        <h2 className="text-2xl font-bold">{isLoggedIn ? "Your Profile" : "Create Profile"}</h2>
        <p className="text-muted-foreground">
          {isLoggedIn 
            ? "Manage your account details and notification preferences" 
            : "Set up your account to track your utility usage"
          }
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
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
                  <Input type="email" placeholder="your@email.com" {...field} />
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
                  <Input type="password" placeholder="••••••••" {...field} />
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
            <Button type="submit">
              {isLoggedIn ? "Update Profile" : "Create Profile"}
            </Button>
            
            {isLoggedIn && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleLogout}
              >
                Log Out
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

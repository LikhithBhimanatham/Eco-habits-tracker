
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Mail, KeyRound } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/index";

// Define the schema for signup
const signupSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string()
    .email({
      message: "Please enter a valid email address.",
    })
    .refine((email) => {
      // Check if it's a gmail account
      return email.toLowerCase().endsWith('@gmail.com');
    }, {
      message: "Only Gmail accounts are allowed (example@gmail.com).",
    }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  notifications: z.boolean().default(true),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSwitchForm: () => void;
}

export function SignupForm({ onSwitchForm }: SignupFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      notifications: true,
    },
  });

  const handleSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Register the user directly using the auth service
      const user = await authService.signup({
        username: data.username,
        email: data.email,
        password: data.password,
        notifications: data.notifications
      });
      
      toast({
        title: "Account Created",
        description: `Welcome to Eco Habits, ${data.username}!`,
      });
      
      // Navigate to the dashboard
      navigate("/", { replace: true });
      
    } catch (error: any) {
      console.error("Registration error:", error);
      setFormError(error.message || "Failed to create account. Please try again.");
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {formError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input 
                      placeholder="johnsmith" 
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
                      placeholder="you@gmail.com" 
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
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Email notifications</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Receive bill reminders and savings tips
                  </p>
                </div>
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={onSwitchForm}
              className="text-ecoBlue hover:text-ecoBlue-dark"
              type="button"
            >
              Already have an account? Login
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}


import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, KeyRound } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/index";

// Define the schema for login
const loginSchema = z.object({
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
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchForm: () => void;
}

export function LoginForm({ onSwitchForm }: LoginFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Try to login with provided credentials
      const user = await authService.login(data.email, data.password);
      
      if (user) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.username}!`,
        });
        
        // Navigate to the page they were trying to access, or home
        navigate(from, { state: { successLogin: true } });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setFormError(error.message || "Invalid email or password.");
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
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
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={onSwitchForm}
              className="text-ecoBlue hover:text-ecoBlue-dark"
              type="button"
            >
              Need an account? Sign up
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

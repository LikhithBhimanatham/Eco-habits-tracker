
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Mail, KeyRound, User, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService, userService } from "@/db/db-service";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define the schema for login
const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

// Define the schema for signup which extends login schema
const signupSchema = loginSchema.extend({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  // Initialize login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Initialize signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Reset errors when switching form types
  useEffect(() => {
    setFormError(null);
  }, [isLogin]);

  const handleLoginSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Try to login with provided credentials
      const user = authService.login(data.email, data.password);
      
      if (user) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
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

  const handleSignupSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Check if user already exists
      const existingUser = userService.getByEmail(data.email);
      
      if (existingUser) {
        throw new Error("An account with this email already exists.");
      }
      
      // Create new user
      const newUser = userService.create({
        name: data.name,
        email: data.email,
        password: data.password,
        notifications: true,
      });
      
      if (newUser) {
        // Auto login after successful registration
        authService.login(data.email, data.password);
        
        toast({
          title: "Account Created",
          description: "Your account has been created successfully.",
        });
        
        // Navigate to home page or original destination
        navigate(from, { state: { successLogin: true } });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setFormError(error.message || "Could not create account.");
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create account.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ecoBlue-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Login to Eco Habits" : "Create an Account"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin 
              ? "Track your utility usage and save the planet" 
              : "Join our community of eco-conscious individuals"}
          </p>
        </div>

        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        {isLogin ? (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input 
                          type="email" 
                          placeholder="you@example.com" 
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
                control={loginForm.control}
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
            </form>
          </Form>
        ) : (
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} className="space-y-4">
              <FormField
                control={signupForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="Your name" 
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
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input 
                          type="email" 
                          placeholder="you@example.com" 
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
                control={signupForm.control}
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
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
        )}

        <div className="mt-6 text-center">
          <Button 
            variant="link" 
            onClick={() => {
              setIsLogin(!isLogin);
              loginForm.reset();
              signupForm.reset();
              setFormError(null);
            }}
            className="text-ecoBlue hover:text-ecoBlue-dark"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;

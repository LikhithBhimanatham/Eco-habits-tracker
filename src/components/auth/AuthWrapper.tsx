
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "@/db/db-service";
import { useToast } from "@/hooks/use-toast";

export const AuthWrapper = () => {
  const location = useLocation();
  const { toast } = useToast();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    // Check if redirected from login
    if (location.state?.successLogin) {
      toast({
        title: "Login Successful",
        description: "Welcome to Eco Habits Tracker!",
      });
    }
    
    // Check if logged out
    if (location.state?.loggedOut) {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    }
  }, [location.state, toast]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // User is authenticated, render the protected routes
  return <Outlet />;
};

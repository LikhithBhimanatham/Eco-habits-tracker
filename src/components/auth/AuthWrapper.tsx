import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated");
    const isAuth = authStatus === "true";
    setIsAuthenticated(isAuth);
    
    // If not authenticated and not on login page, redirect to login
    if (!isAuth && location.pathname !== "/login") {
      navigate("/login");
    }
    // If authenticated and on login page, redirect to home
    else if (isAuth && location.pathname === "/login") {
      navigate("/");
    }
  }, [navigate, location.pathname]);

  // Show nothing while checking authentication status
  if (isAuthenticated === null) {
    return null;
  }

  // If on login page or authenticated, render children
  if (location.pathname === "/login" || isAuthenticated) {
    return <>{children}</>;
  }

  // Otherwise render nothing (will redirect in useEffect)
  return null;
};

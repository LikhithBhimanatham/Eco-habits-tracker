
import React from "react";

interface AuthWrapperProps {
  children: React.ReactNode;
}

// Modified AuthWrapper that no longer checks authentication
export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  // Simply render the children without any authentication checks
  return <>{children}</>;
};

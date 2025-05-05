
import { useState, useEffect } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  // Toggle between login and signup forms
  const toggleForm = () => {
    setIsLogin(prev => !prev);
  };

  return (
    <AuthCard
      title={isLogin ? "Login to Eco Habits" : "Create an Account"}
      subtitle={
        isLogin
          ? "Track your utility usage and save the planet"
          : "Join our community of eco-conscious individuals"
      }
    >
      {isLogin ? (
        <LoginForm onSwitchForm={toggleForm} />
      ) : (
        <SignupForm onSwitchForm={toggleForm} />
      )}
    </AuthCard>
  );
};

export default Login;

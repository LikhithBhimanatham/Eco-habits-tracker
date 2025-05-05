
import { User } from '@/db/models';
import { userService } from './user-service';
import { hashPassword, comparePassword } from '@/utils/password-utils';

// Auth service using Supabase Auth (Note: this is a simplified version)
export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // In a production app, we would use Supabase Auth like this:
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });
    
    // For now, we'll use our custom authentication flow
    const user = await userService.getByEmail(email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Compare password with stored hash
    if (!comparePassword(password, user.password)) {
      throw new Error('Invalid email or password');
    }
    
    // Store current user ID in session
    sessionStorage.setItem('currentUserId', user.id);
    return user;
  },
  
  signup: async (userData: { username: string, email: string, password: string, notifications: boolean }): Promise<User> => {
    try {
      // Check if user already exists
      const existingUser = await userService.getByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Hash password before storing
      const hashedPassword = hashPassword(userData.password);
      
      // Create new user with hashed password
      const newUser = await userService.create({
        ...userData,
        password: hashedPassword,
      });
      
      // Automatically log in the new user
      sessionStorage.setItem('currentUserId', newUser.id);
      
      return newUser;
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    // In a production app: await supabase.auth.signOut();
    sessionStorage.removeItem('currentUserId');
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    const userId = sessionStorage.getItem('currentUserId');
    if (!userId) return null;
    
    return await userService.getById(userId);
  },
  
  isAuthenticated: (): boolean => {
    return !!sessionStorage.getItem('currentUserId');
  }
};


import { User } from '@/db/models';
import { userService } from './user-service';

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
    
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    
    // Store current user ID in session
    sessionStorage.setItem('currentUserId', user.id);
    return user;
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

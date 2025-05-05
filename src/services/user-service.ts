
import { User } from '@/db/models';
import { generateId, isMockSupabase, logMockWarning, supabase } from './base-service';

// User operations
export const userService = {
  create: async (userData: Omit<User, 'id' | 'points' | 'savingsPercent' | 'createdAt'>): Promise<User> => {
    // Check if using mock Supabase
    if (isMockSupabase) {
      logMockWarning();
      
      // Mock implementation
      const mockUser = {
        id: generateId(),
        username: userData.username,
        email: userData.email,
        password: userData.password,
        notifications: userData.notifications,
        points: 0,
        savingsPercent: 0,
        createdAt: new Date().toISOString()
      };
      
      // Store in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      existingUsers.push(mockUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      return mockUser;
    }
    
    // Real Supabase implementation
    // Check if email already exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('*')
      .eq('email', userData.email)
      .limit(1);
    
    if (existingUsers && existingUsers.length > 0) {
      throw new Error('User with this email already exists');
    }
    
    const newUser = {
      username: userData.username,
      email: userData.email,
      password: userData.password, // In a real app, this would be handled by Supabase Auth
      notifications: userData.notifications,
      points: 0,
      savings_percent: 0,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create user');
    
    // Convert from DB schema to app model
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      password: data.password,
      notifications: data.notifications,
      points: data.points,
      savingsPercent: data.savings_percent,
      createdAt: data.created_at
    };
  },
  
  getById: async (id: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      password: data.password,
      notifications: data.notifications,
      points: data.points,
      savingsPercent: data.savings_percent,
      createdAt: data.created_at
    };
  },
  
  getByEmail: async (email: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      password: data.password,
      notifications: data.notifications,
      points: data.points,
      savingsPercent: data.savings_percent,
      createdAt: data.created_at
    };
  },
  
  update: async (id: string, userData: Partial<User>): Promise<User | null> => {
    const updateData: any = {};
    
    if (userData.username) updateData.username = userData.username;
    if (userData.email) updateData.email = userData.email;
    if (userData.password) updateData.password = userData.password;
    if (userData.notifications !== undefined) updateData.notifications = userData.notifications;
    if (userData.points !== undefined) updateData.points = userData.points;
    if (userData.savingsPercent !== undefined) updateData.savings_percent = userData.savingsPercent;
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      password: data.password,
      notifications: data.notifications,
      points: data.points,
      savingsPercent: data.savings_percent,
      createdAt: data.created_at
    };
  },
  
  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    return !error;
  },
  
  getAll: async (): Promise<User[]> => {
    // Check if using mock Supabase
    if (isMockSupabase) {
      logMockWarning();
      
      // Return mock data
      const mockUsers = [
        {
          id: "1",
          username: "EmmaW",
          email: "emma@example.com",
          password: "password123",
          notifications: true,
          points: 850,
          savingsPercent: 75,
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          username: "JamesC",
          email: "james@example.com",
          password: "password123",
          notifications: true,
          points: 920,
          savingsPercent: 80,
          createdAt: new Date().toISOString()
        },
        {
          id: "3",
          username: "OliviaM",
          email: "olivia@example.com",
          password: "password123",
          notifications: false,
          points: 750,
          savingsPercent: 65,
          createdAt: new Date().toISOString()
        },
        {
          id: "4",
          username: "NoahT",
          email: "noah@example.com",
          password: "password123",
          notifications: true,
          points: 680,
          savingsPercent: 70,
          createdAt: new Date().toISOString()
        },
        {
          id: "5",
          username: "SophiaL",
          email: "sophia@example.com",
          password: "password123",
          notifications: true,
          points: 890,
          savingsPercent: 78,
          createdAt: new Date().toISOString()
        }
      ];
      
      return mockUsers;
    }
    
    // Real Supabase implementation
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error || !data) return [];
    
    return data.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      notifications: user.notifications,
      points: user.points,
      savingsPercent: user.savings_percent,
      createdAt: user.created_at
    }));
  },
  
  getLeaderboard: async (limit: number = 5): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('points', { ascending: false })
      .limit(limit);
    
    if (error || !data) return [];
    
    return data.map((user, index) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      notifications: user.notifications,
      points: user.points,
      savingsPercent: user.savings_percent,
      createdAt: user.created_at
    }));
  }
};

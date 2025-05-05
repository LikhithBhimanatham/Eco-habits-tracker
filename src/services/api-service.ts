import { supabase, isMockSupabase } from '@/lib/supabase';
import { User, WaterBill, ElectricityBill, PetrolBill, Notification } from '@/db/models';

// Helper functions
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// User operations
export const userService = {
  create: async (userData: Omit<User, 'id' | 'points' | 'savingsPercent' | 'createdAt'>): Promise<User> => {
    // Check if using mock Supabase
    if (isMockSupabase) {
      console.warn("Using mock Supabase client. Connect to a real Supabase instance for production use.");
      
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
      console.warn("Using mock Supabase client. Connect to a real Supabase instance for production use.");
      
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

// Water bill operations
export const waterBillService = {
  create: async (billData: Omit<WaterBill, 'id' | 'createdAt'>): Promise<WaterBill> => {
    const newBill = {
      user_id: billData.userId,
      amount: billData.amount,
      units: billData.units,
      date: billData.date,
      notes: billData.notes,
      cubic_meters: billData.cubicMeters,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('water_bills')
      .insert(newBill)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create water bill');
    
    // Update user points based on bill savings
    try {
      const user = await userService.getById(billData.userId);
      if (user) {
        // Simple algorithm to award points based on bill amount
        const newPoints = user.points + Math.floor(billData.units * 0.5);
        await userService.update(user.id, { points: newPoints });
      }
    } catch (error) {
      console.error('Error updating user points:', error);
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      units: data.units,
      date: data.date,
      notes: data.notes,
      type: 'water',
      cubicMeters: data.cubic_meters,
      createdAt: data.created_at
    };
  },
  
  getByUserId: async (userId: string): Promise<WaterBill[]> => {
    const { data, error } = await supabase
      .from('water_bills')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error || !data) return [];
    
    return data.map(bill => ({
      id: bill.id,
      userId: bill.user_id,
      amount: bill.amount,
      units: bill.units,
      date: bill.date,
      notes: bill.notes,
      type: 'water',
      cubicMeters: bill.cubic_meters,
      createdAt: bill.created_at
    }));
  },
  
  getById: async (id: string): Promise<WaterBill | null> => {
    const { data, error } = await supabase
      .from('water_bills')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      units: data.units,
      date: data.date,
      notes: data.notes,
      type: 'water',
      cubicMeters: data.cubic_meters,
      createdAt: data.created_at
    };
  },
  
  update: async (id: string, billData: Partial<WaterBill>): Promise<WaterBill | null> => {
    const updateData: any = {};
    
    if (billData.userId) updateData.user_id = billData.userId;
    if (billData.amount !== undefined) updateData.amount = billData.amount;
    if (billData.units !== undefined) updateData.units = billData.units;
    if (billData.date) updateData.date = billData.date;
    if (billData.notes !== undefined) updateData.notes = billData.notes;
    if (billData.cubicMeters !== undefined) updateData.cubic_meters = billData.cubicMeters;
    
    const { data, error } = await supabase
      .from('water_bills')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      units: data.units,
      date: data.date,
      notes: data.notes,
      type: 'water',
      cubicMeters: data.cubic_meters,
      createdAt: data.created_at
    };
  },
  
  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('water_bills')
      .delete()
      .eq('id', id);
    
    return !error;
  },
  
  getAll: async (): Promise<WaterBill[]> => {
    const { data, error } = await supabase
      .from('water_bills')
      .select('*');
    
    if (error || !data) return [];
    
    return data.map(bill => ({
      id: bill.id,
      userId: bill.user_id,
      amount: bill.amount,
      units: bill.units,
      date: bill.date,
      notes: bill.notes,
      type: 'water',
      cubicMeters: bill.cubic_meters,
      createdAt: bill.created_at
    }));
  }
};

// Similar implementations for electricityBillService and petrolBillService
export const electricityBillService = {
  // Similar to waterBillService but with kilowattHours instead of cubicMeters
  create: async (billData: Omit<ElectricityBill, 'id' | 'createdAt'>): Promise<ElectricityBill> => {
    const newBill = {
      user_id: billData.userId,
      amount: billData.amount,
      units: billData.units,
      date: billData.date,
      notes: billData.notes,
      kilowatt_hours: billData.kilowattHours,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('electricity_bills')
      .insert(newBill)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create electricity bill');
    
    // Update user points
    try {
      const user = await userService.getById(billData.userId);
      if (user) {
        const newPoints = user.points + Math.floor(billData.units * 0.5);
        await userService.update(user.id, { points: newPoints });
      }
    } catch (error) {
      console.error('Error updating user points:', error);
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      units: data.units,
      date: data.date,
      notes: data.notes,
      type: 'electricity',
      kilowattHours: data.kilowatt_hours,
      createdAt: data.created_at
    };
  },
  
  getByUserId: async (userId: string): Promise<ElectricityBill[]> => {
    const { data, error } = await supabase
      .from('electricity_bills')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error || !data) return [];
    
    return data.map(bill => ({
      id: bill.id,
      userId: bill.user_id,
      amount: bill.amount,
      units: bill.units,
      date: bill.date,
      notes: bill.notes,
      type: 'electricity',
      kilowattHours: bill.kilowatt_hours,
      createdAt: bill.created_at
    }));
  },
  
  // Other methods similar to waterBillService...
  getById: async (id: string): Promise<ElectricityBill | null> => {
    const { data, error } = await supabase
      .from('electricity_bills')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      units: data.units,
      date: data.date,
      notes: data.notes,
      type: 'electricity',
      kilowattHours: data.kilowatt_hours,
      createdAt: data.created_at
    };
  },
  
  update: async (id: string, billData: Partial<ElectricityBill>): Promise<ElectricityBill | null> => {
    const updateData: any = {};
    
    if (billData.userId) updateData.user_id = billData.userId;
    if (billData.amount !== undefined) updateData.amount = billData.amount;
    if (billData.units !== undefined) updateData.units = billData.units;
    if (billData.date) updateData.date = billData.date;
    if (billData.notes !== undefined) updateData.notes = billData.notes;
    if (billData.kilowattHours !== undefined) updateData.kilowatt_hours = billData.kilowattHours;
    
    const { data, error } = await supabase
      .from('electricity_bills')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      units: data.units,
      date: data.date,
      notes: data.notes,
      type: 'electricity',
      kilowattHours: data.kilowatt_hours,
      createdAt: data.created_at
    };
  },
  
  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('electricity_bills')
      .delete()
      .eq('id', id);
    
    return !error;
  },
  
  getAll: async (): Promise<ElectricityBill[]> => {
    const { data, error } = await supabase
      .from('electricity_bills')
      .select('*');
    
    if (error || !data) return [];
    
    return data.map(bill => ({
      id: bill.id,
      userId: bill.user_id,
      amount: bill.amount,
      units: bill.units,
      date: bill.date,
      notes: bill.notes,
      type: 'electricity',
      kilowattHours: bill.kilowatt_hours,
      createdAt: bill.created_at
    }));
  }
};

export const petrolBillService = {
  create: async (billData: Omit<PetrolBill, 'id' | 'createdAt'>): Promise<PetrolBill> => {
    const newBill = {
      user_id: billData.userId,
      amount: billData.amount,
      units: billData.units,
      date: billData.date,
      notes: billData.notes,
      liters: billData.liters,
      mileage: billData.mileage,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('petrol_bills')
      .insert(newBill)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create petrol bill');
    
    // Update user points
    try {
      const user = await userService.getById(billData.userId);
      if (user) {
        const newPoints = user.points + Math.floor(billData.units * 0.5);
        await userService.update(user.id, { points: newPoints });
      }
    } catch (error) {
      console.error('Error updating user points:', error);
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      units: data.units,
      date: data.date,
      notes: data.notes,
      type: 'petrol',
      liters: data.liters,
      mileage: data.mileage,
      createdAt: data.created_at
    };
  },
  
  // Other methods similar to waterBillService...
  getByUserId: async (userId: string): Promise<PetrolBill[]> => {
    const { data, error } = await supabase
      .from('petrol_bills')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error || !data) return [];
    
    return data.map(bill => ({
      id: bill.id,
      userId: bill.user_id,
      amount: bill.amount,
      units: bill.units,
      date: bill.date,
      notes: bill.notes,
      type: 'petrol',
      liters: bill.liters,
      mileage: bill.mileage,
      createdAt: bill.created_at
    }));
  },
  
  getById: async (id: string): Promise<PetrolBill | null> => {
    const { data, error } = await supabase
      .from('petrol_bills')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      units: data.units,
      date: data.date,
      notes: data.notes,
      type: 'petrol',
      liters: data.liters,
      mileage: data.mileage,
      createdAt: data.created_at
    };
  },
  
  update: async (id: string, billData: Partial<PetrolBill>): Promise<PetrolBill | null> => {
    const updateData: any = {};
    
    if (billData.userId) updateData.user_id = billData.userId;
    if (billData.amount !== undefined) updateData.amount = billData.amount;
    if (billData.units !== undefined) updateData.units = billData.units;
    if (billData.date) updateData.date = billData.date;
    if (billData.notes !== undefined) updateData.notes = billData.notes;
    if (billData.liters !== undefined) updateData.liters = billData.liters;
    if (billData.mileage !== undefined) updateData.mileage = billData.mileage;
    
    const { data, error } = await supabase
      .from('petrol_bills')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      units: data.units,
      date: data.date,
      notes: data.notes,
      type: 'petrol',
      liters: data.liters,
      mileage: data.mileage,
      createdAt: data.created_at
    };
  },
  
  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('petrol_bills')
      .delete()
      .eq('id', id);
    
    return !error;
  },
  
  getAll: async (): Promise<PetrolBill[]> => {
    const { data, error } = await supabase
      .from('petrol_bills')
      .select('*');
    
    if (error || !data) return [];
    
    return data.map(bill => ({
      id: bill.id,
      userId: bill.user_id,
      amount: bill.amount,
      units: bill.units,
      date: bill.date,
      notes: bill.notes,
      type: 'petrol',
      liters: bill.liters,
      mileage: bill.mileage,
      createdAt: bill.created_at
    }));
  }
};

// Notification operations
export const notificationService = {
  create: async (notificationData: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<Notification> => {
    const newNotification = {
      user_id: notificationData.userId,
      title: notificationData.title,
      message: notificationData.message,
      read: false,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('notifications')
      .insert(newNotification)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create notification');
    
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      message: data.message,
      read: data.read,
      createdAt: data.created_at
    };
  },
  
  getByUserId: async (userId: string): Promise<Notification[]> => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error || !data) return [];
    
    return data.map(notification => ({
      id: notification.id,
      userId: notification.user_id,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      createdAt: notification.created_at
    }));
  },
  
  markAsRead: async (id: string): Promise<Notification | null> => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      message: data.message,
      read: data.read,
      createdAt: data.created_at
    };
  },
  
  markAllAsRead: async (userId: string): Promise<number> => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
      .select();
    
    if (error || !data) return 0;
    return data.length;
  },
  
  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
    
    return !error;
  },
  
  getUnreadCount: async (userId: string): Promise<number> => {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error || count === null) return 0;
    return count;
  }
};

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

// Function to initialize demo data in Supabase tables
export const initializeDemoData = async (): Promise<void> => {
  // Skip initialization if using mock Supabase
  if (isMockSupabase) {
    console.warn("Using mock Supabase client. Demo data will be provided directly in service methods.");
    return;
  }
  
  // Check if data is already initialized
  const { data: existingUsers } = await supabase
    .from('users')
    .select('id')
    .limit(1);
  
  if (existingUsers && existingUsers.length > 0) return;
  
  // Create demo users
  const users = [
    {
      name: "Emma Wilson",
      email: "emma@example.com",
      password: "password123",
      notifications: true,
      points: 850,
      savings_percent: 75
    },
    {
      name: "James Carter",
      email: "james@example.com",
      password: "password123",
      notifications: true,
      points: 920,
      savings_percent: 80
    },
    {
      name: "Olivia Martinez",
      email: "olivia@example.com",
      password: "password123",
      notifications: false,
      points: 750,
      savings_percent: 65
    },
    {
      name: "Noah Thompson",
      email: "noah@example.com",
      password: "password123",
      notifications: true,
      points: 680,
      savings_percent: 70
    },
    {
      name: "Sophia Lee",
      email: "sophia@example.com",
      password: "password123",
      notifications: true,
      points: 890,
      savings_percent: 78
    }
  ];
  
  for (const userData of users) {
    try {
      const { data: user } = await supabase
        .from('users')
        .insert({
          ...userData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (!user) continue;
      
      // Add bills and notifications for each user
      const today = new Date();
      
      // Water bills
      for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        
        await supabase.from('water_bills').insert({
          user_id: user.id,
          amount: 30 + Math.random() * 20,
          units: 40 + Math.random() * 10,
          cubic_meters: 40 + Math.random() * 10,
          date: date.toISOString().split('T')[0],
          created_at: new Date().toISOString()
        });
      }
      
      // Electricity bills
      for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        
        await supabase.from('electricity_bills').insert({
          user_id: user.id,
          amount: 80 + Math.random() * 40,
          units: 100 + Math.random() * 50,
          kilowatt_hours: 100 + Math.random() * 50,
          date: date.toISOString().split('T')[0],
          created_at: new Date().toISOString()
        });
      }
      
      // Petrol bills
      for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        
        await supabase.from('petrol_bills').insert({
          user_id: user.id,
          amount: 50 + Math.random() * 30,
          units: 30 + Math.random() * 10,
          liters: 30 + Math.random() * 10,
          mileage: 12000 + i * 500 + Math.random() * 100,
          date: date.toISOString().split('T')[0],
          created_at: new Date().toISOString()
        });
      }
      
      // Add notifications
      await supabase.from('notifications').insert([
        {
          user_id: user.id,
          title: "Welcome to Eco Habits!",
          message: "Start tracking your bills to reduce consumption and earn eco points.",
          read: false,
          created_at: new Date().toISOString()
        },
        {
          user_id: user.id,
          title: "New Feature Available",
          message: "You can now view your consumption history in beautiful charts.",
          read: false,
          created_at: new Date().toISOString()
        }
      ]);
      
    } catch (error) {
      console.error('Error creating demo data:', error);
    }
  }
};

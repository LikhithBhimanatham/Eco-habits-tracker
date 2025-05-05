import { User, WaterBill, ElectricityBill, PetrolBill, Notification } from './models';
import { hashPassword, comparePassword } from '@/utils/password-utils';

// Database collections (tables)
const COLLECTIONS = {
  USERS: 'eco_users',
  WATER_BILLS: 'eco_water_bills',
  ELECTRICITY_BILLS: 'eco_electricity_bills',
  PETROL_BILLS: 'eco_petrol_bills',
  NOTIFICATIONS: 'eco_notifications'
};

// Helper functions
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const getCollection = <T>(collectionName: string): T[] => {
  const data = localStorage.getItem(collectionName);
  return data ? JSON.parse(data) : [];
};

const saveCollection = <T>(collectionName: string, data: T[]): void => {
  localStorage.setItem(collectionName, JSON.stringify(data));
};

// User operations
export const userService = {
  create: (userData: Omit<User, 'id' | 'points' | 'savingsPercent' | 'createdAt'>): User => {
    const users = getCollection<User>(COLLECTIONS.USERS);
    
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      throw new Error('User with this email already exists');
    }
    
    // Hash the password before storing
    const hashedPassword = hashPassword(userData.password);
    
    const newUser: User = {
      id: generateId(),
      ...userData,
      password: hashedPassword, // Store hashed password
      points: 0,
      savingsPercent: 0,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveCollection(COLLECTIONS.USERS, users);
    
    // Return user without actual password
    const { password, ...userWithoutPassword } = newUser;
    return { ...userWithoutPassword, password: '••••••••' } as User;
  },
  
  getById: (id: string): User | null => {
    const users = getCollection<User>(COLLECTIONS.USERS);
    return users.find(user => user.id === id) || null;
  },
  
  getByEmail: (email: string): User | null => {
    const users = getCollection<User>(COLLECTIONS.USERS);
    return users.find(user => user.email === email) || null;
  },
  
  update: (id: string, userData: Partial<User>): User | null => {
    const users = getCollection<User>(COLLECTIONS.USERS);
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) return null;
    
    // Hash password if it's being updated and not the masked placeholder
    if (userData.password && userData.password !== '••••••••') {
      userData.password = hashPassword(userData.password);
    }
    
    // Update user data
    users[index] = { ...users[index], ...userData };
    saveCollection(COLLECTIONS.USERS, users);
    
    // Return user without actual password
    const { password, ...userWithoutPassword } = users[index];
    return { ...userWithoutPassword, password: '••••••••' } as User;
  },
  
  delete: (id: string): boolean => {
    const users = getCollection<User>(COLLECTIONS.USERS);
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) return false;
    
    saveCollection(COLLECTIONS.USERS, filteredUsers);
    return true;
  },
  
  getAll: (): User[] => {
    return getCollection<User>(COLLECTIONS.USERS);
  },
  
  // Get top users for leaderboard
  getLeaderboard: (limit: number = 5): User[] => {
    const users = getCollection<User>(COLLECTIONS.USERS);
    return [...users]
      .sort((a, b) => b.points - a.points)
      .slice(0, limit)
      .map((user, index) => ({ ...user, rank: index + 1 }));
  }
};

// Generic bill service creator
const createBillService = <T extends WaterBill | ElectricityBill | PetrolBill>(collectionName: string) => {
  return {
    create: (billData: Omit<T, 'id' | 'createdAt'>): T => {
      const bills = getCollection<T>(collectionName);
      
      const newBill = {
        id: generateId(),
        ...billData,
        createdAt: new Date().toISOString()
      } as T;
      
      bills.push(newBill);
      saveCollection(collectionName, bills);
      
      // Update user points based on bill savings
      try {
        const user = userService.getById(billData.userId);
        if (user) {
          // Simple algorithm to award points based on bill amount
          // In a real app, this would be more sophisticated
          const newPoints = user.points + Math.floor(billData.units * 0.5);
          userService.update(user.id, { points: newPoints });
        }
      } catch (error) {
        console.error('Error updating user points:', error);
      }
      
      return newBill;
    },
    
    getByUserId: (userId: string): T[] => {
      const bills = getCollection<T>(collectionName);
      return bills.filter(bill => bill.userId === userId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    
    getById: (id: string): T | null => {
      const bills = getCollection<T>(collectionName);
      return bills.find(bill => bill.id === id) || null;
    },
    
    update: (id: string, billData: Partial<T>): T | null => {
      const bills = getCollection<T>(collectionName);
      const index = bills.findIndex(bill => bill.id === id);
      
      if (index === -1) return null;
      
      // Update bill data
      bills[index] = { ...bills[index], ...billData };
      saveCollection(collectionName, bills);
      return bills[index];
    },
    
    delete: (id: string): boolean => {
      const bills = getCollection<T>(collectionName);
      const filteredBills = bills.filter(bill => bill.id !== id);
      
      if (filteredBills.length === bills.length) return false;
      
      saveCollection(collectionName, filteredBills);
      return true;
    },
    
    getAll: (): T[] => {
      return getCollection<T>(collectionName);
    }
  };
};

// Create bill services
export const waterBillService = createBillService<WaterBill>(COLLECTIONS.WATER_BILLS);
export const electricityBillService = createBillService<ElectricityBill>(COLLECTIONS.ELECTRICITY_BILLS);
export const petrolBillService = createBillService<PetrolBill>(COLLECTIONS.PETROL_BILLS);

// Notification operations
export const notificationService = {
  create: (notificationData: Omit<Notification, 'id' | 'read' | 'createdAt'>): Notification => {
    const notifications = getCollection<Notification>(COLLECTIONS.NOTIFICATIONS);
    
    const newNotification: Notification = {
      id: generateId(),
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    notifications.push(newNotification);
    saveCollection(COLLECTIONS.NOTIFICATIONS, notifications);
    return newNotification;
  },
  
  getByUserId: (userId: string): Notification[] => {
    const notifications = getCollection<Notification>(COLLECTIONS.NOTIFICATIONS);
    return notifications
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  
  markAsRead: (id: string): Notification | null => {
    const notifications = getCollection<Notification>(COLLECTIONS.NOTIFICATIONS);
    const index = notifications.findIndex(notification => notification.id === id);
    
    if (index === -1) return null;
    
    notifications[index].read = true;
    saveCollection(COLLECTIONS.NOTIFICATIONS, notifications);
    return notifications[index];
  },
  
  markAllAsRead: (userId: string): number => {
    const notifications = getCollection<Notification>(COLLECTIONS.NOTIFICATIONS);
    let count = 0;
    
    const updatedNotifications = notifications.map(notification => {
      if (notification.userId === userId && !notification.read) {
        count++;
        return { ...notification, read: true };
      }
      return notification;
    });
    
    saveCollection(COLLECTIONS.NOTIFICATIONS, updatedNotifications);
    return count;
  },
  
  delete: (id: string): boolean => {
    const notifications = getCollection<Notification>(COLLECTIONS.NOTIFICATIONS);
    const filteredNotifications = notifications.filter(notification => notification.id !== id);
    
    if (filteredNotifications.length === notifications.length) return false;
    
    saveCollection(COLLECTIONS.NOTIFICATIONS, filteredNotifications);
    return true;
  },
  
  getUnreadCount: (userId: string): number => {
    const notifications = getCollection<Notification>(COLLECTIONS.NOTIFICATIONS);
    return notifications.filter(notification => notification.userId === userId && !notification.read).length;
  }
};

// Auth service
export const authService = {
  login: (email: string, password: string): User => {
    const user = userService.getByEmail(email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Compare provided password with stored hash
    if (!comparePassword(password, user.password)) {
      throw new Error('Invalid email or password');
    }
    
    // Store current user ID in session storage (more secure than localStorage for sensitive data)
    sessionStorage.setItem('currentUserId', user.id);
    
    // Return user without exposing the password hash
    const { password: pass, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, password: '••••••••' } as User;
  },
  
  logout: (): void => {
    sessionStorage.removeItem('currentUserId');
  },
  
  getCurrentUser: (): User | null => {
    const userId = sessionStorage.getItem('currentUserId');
    if (!userId) return null;
    
    const user = userService.getById(userId);
    if (!user) return null;
    
    // Return user without exposing the password hash
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, password: '••••••••' } as User;
  },
  
  isAuthenticated: (): boolean => {
    return !!sessionStorage.getItem('currentUserId');
  }
};

// Data initialization for demo purposes
export const initializeDemoData = (): void => {
  // Check if data is already initialized
  if (localStorage.getItem('data_initialized')) return;
  
  // Create demo users
  const users = [
    {
      name: "Emma Wilson",
      email: "emma@example.com",
      password: "password123",
      notifications: true
    },
    {
      name: "James Carter",
      email: "james@example.com",
      password: "password123",
      notifications: true
    },
    {
      name: "Olivia Martinez",
      email: "olivia@example.com",
      password: "password123",
      notifications: false
    },
    {
      name: "Noah Thompson",
      email: "noah@example.com",
      password: "password123",
      notifications: true
    },
    {
      name: "Sophia Lee",
      email: "sophia@example.com",
      password: "password123",
      notifications: true
    }
  ];
  
  users.forEach(userData => {
    try {
      const user = userService.create(userData);
      
      // Add some random bills for each user
      const today = new Date();
      
      // Water bills
      for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        
        waterBillService.create({
          userId: user.id,
          type: 'water',
          amount: 30 + Math.random() * 20,
          units: 40 + Math.random() * 10,
          cubicMeters: 40 + Math.random() * 10,
          date: date.toISOString().split('T')[0]
        });
      }
      
      // Electricity bills
      for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        
        electricityBillService.create({
          userId: user.id,
          type: 'electricity',
          amount: 80 + Math.random() * 40,
          units: 100 + Math.random() * 50,
          kilowattHours: 100 + Math.random() * 50,
          date: date.toISOString().split('T')[0]
        });
      }
      
      // Petrol bills
      for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        
        petrolBillService.create({
          userId: user.id,
          type: 'petrol',
          amount: 50 + Math.random() * 30,
          units: 30 + Math.random() * 10,
          liters: 30 + Math.random() * 10,
          mileage: 12000 + i * 500 + Math.random() * 100,
          date: date.toISOString().split('T')[0]
        });
      }
      
      // Add notifications
      notificationService.create({
        userId: user.id,
        title: "Welcome to Eco Habits!",
        message: "Start tracking your bills to reduce consumption and earn eco points."
      });
      
      notificationService.create({
        userId: user.id,
        title: "New Feature Available",
        message: "You can now view your consumption history in beautiful charts."
      });
      
      // Update user points based on their bills
      userService.update(user.id, {
        points: Math.floor(Math.random() * 1000) + 500,
        savingsPercent: Math.floor(Math.random() * 30) + 60
      });
    } catch (error) {
      console.error('Error creating demo data:', error);
    }
  });
  
  localStorage.setItem('data_initialized', 'true');
};

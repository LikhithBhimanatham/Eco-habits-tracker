
// Database models for the eco habits tracker application

// User model
export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In a real DB, this would be hashed
  notifications: boolean;
  points: number;
  savingsPercent: number;
  createdAt: string;
}

// Utility bill base model
export interface UtilityBill {
  id: string;
  userId: string;
  amount: number;
  units: number;
  date: string;
  notes?: string;
  createdAt: string;
}

// Specific bill types
export interface WaterBill extends UtilityBill {
  type: 'water';
  cubicMeters: number;
}

export interface ElectricityBill extends UtilityBill {
  type: 'electricity';
  kilowattHours: number;
}

export interface PetrolBill extends UtilityBill {
  type: 'petrol';
  liters: number;
  mileage?: number;
}

// Notification model
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

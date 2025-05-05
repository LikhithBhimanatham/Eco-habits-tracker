
import { PetrolBill } from '@/db/models';
import { userService } from './user-service';
import { supabase } from './base-service';

// Petrol bill operations
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


import { WaterBill } from '@/db/models';
import { userService } from './user-service';
import { supabase } from './base-service';

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

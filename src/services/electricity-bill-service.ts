
import { ElectricityBill } from '@/db/models';
import { userService } from './user-service';
import { supabase } from './base-service';

// Electricity bill operations
export const electricityBillService = {
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

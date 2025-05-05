
import { Notification } from '@/db/models';
import { supabase } from './base-service';

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

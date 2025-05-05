
import { isMockSupabase, supabase } from './base-service';

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
      username: "EmmaW",
      email: "emma@example.com",
      password: "password123",
      notifications: true,
      points: 850,
      savings_percent: 75
    },
    {
      username: "JamesC",
      email: "james@example.com",
      password: "password123",
      notifications: true,
      points: 920,
      savings_percent: 80
    },
    {
      username: "OliviaM",
      email: "olivia@example.com",
      password: "password123",
      notifications: false,
      points: 750,
      savings_percent: 65
    },
    {
      username: "NoahT",
      email: "noah@example.com",
      password: "password123",
      notifications: true,
      points: 680,
      savings_percent: 70
    },
    {
      username: "SophiaL",
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

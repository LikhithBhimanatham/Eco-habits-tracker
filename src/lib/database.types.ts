
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          password: string // In a real application this would be handled by Supabase Auth
          notifications: boolean
          points: number
          savings_percent: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          password?: string
          notifications?: boolean
          points?: number
          savings_percent?: number
          created_at?: string
        }
        Update: {
          name?: string
          email?: string
          password?: string
          notifications?: boolean
          points?: number
          savings_percent?: number
        }
      }
      water_bills: {
        Row: {
          id: string
          user_id: string
          amount: number
          units: number
          date: string
          notes?: string
          cubic_meters: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          units: number
          date: string
          notes?: string
          cubic_meters: number
          created_at?: string
        }
        Update: {
          user_id?: string
          amount?: number
          units?: number
          date?: string
          notes?: string
          cubic_meters?: number
        }
      }
      electricity_bills: {
        Row: {
          id: string
          user_id: string
          amount: number
          units: number
          date: string
          notes?: string
          kilowatt_hours: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          units: number
          date: string
          notes?: string
          kilowatt_hours: number
          created_at?: string
        }
        Update: {
          user_id?: string
          amount?: number
          units?: number
          date?: string
          notes?: string
          kilowatt_hours?: number
        }
      }
      petrol_bills: {
        Row: {
          id: string
          user_id: string
          amount: number
          units: number
          date: string
          notes?: string
          liters: number
          mileage?: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          units: number
          date: string
          notes?: string
          liters: number
          mileage?: number
          created_at?: string
        }
        Update: {
          user_id?: string
          amount?: number
          units?: number
          date?: string
          notes?: string
          liters?: number
          mileage?: number
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          user_id?: string
          title?: string
          message?: string
          read?: boolean
        }
      }
    }
  }
}

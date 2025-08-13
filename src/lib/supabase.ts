import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key_here';

// Only throw error if both are still placeholder values in production
if ((!supabaseUrl || !supabaseAnonKey) && import.meta.env.PROD) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  age_group: string;
  duration: number;
  file_url: string;
  thumbnail_url?: string;
  status: 'draft' | 'published' | 'processing';
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'diagnostic' | 'progress' | 'skill-based' | 'achievement';
  age_group: string;
  questions: AssessmentQuestion[];
  duration: number;
  status: 'draft' | 'active' | 'archived';
  completions: number;
  average_score: number;
  created_at: string;
  updated_at: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  email: string;
  parent_email: string;
  parent_phone: string;
  program: string;
  progress: number;
  last_login: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  student_id: string;
  amount: number;
  program: string;
  status: 'completed' | 'pending' | 'failed';
  payment_method: string;
  created_at: string;
}
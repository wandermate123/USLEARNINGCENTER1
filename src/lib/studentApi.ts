import { supabase, type Student, type Video } from './supabase';

export interface StudentSession {
  id: string;
  student_id: string;
  title: string;
  start_time: string; // ISO string
  teacher?: string;
  platform?: string; // e.g., "Zoom"
  zoom_url?: string;
}

export interface CreateStudentProfileData {
  email: string;
  name: string;
  firebase_uid?: string;
}

export async function fetchStudentByEmail(email: string): Promise<Student | null> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('email', email)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn('fetchStudentByEmail error:', error.message);
    return null;
  }
  return data as unknown as Student | null;
}

export async function createStudentProfile(profileData: CreateStudentProfileData): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .insert({
      email: profileData.email,
      name: profileData.name,
      firebase_uid: profileData.firebase_uid,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('createStudentProfile error:', error.message);
    throw new Error(`Failed to create student profile: ${error.message}`);
  }
  
  return data as unknown as Student;
}

export async function fetchUpcomingSessions(studentId: string, nowIso?: string): Promise<StudentSession[]> {
  const now = nowIso ?? new Date().toISOString();
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('student_id', studentId)
    .gte('start_time', now)
    .order('start_time', { ascending: true })
    .limit(5);

  if (error) {
    console.warn('fetchUpcomingSessions error:', error.message);
    return [];
  }
  return (data as unknown as StudentSession[]) ?? [];
}

export async function fetchRecommendedVideos(limit = 3): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('fetchRecommendedVideos error:', error.message);
    return [] as unknown as Video[];
  }
  return (data as unknown as Video[]) ?? [];
}


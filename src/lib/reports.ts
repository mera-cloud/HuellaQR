import { supabase } from '@/lib/supabase';
import type { CanMeet, FoundReport, ReportStatus } from '@/lib/types';

export interface FoundReportInput {
  finderName: string;
  location: string;
  foundAt: string;
  photoUrl: string | null;
  finderContact: string;
  canMeet: CanMeet;
  message: string;
}

export async function listMyReports(): Promise<FoundReport[]> {
  const { data, error } = await supabase
    .from('found_reports')
    .select('id, pet_id, finder_name, location, found_at, photo_url, finder_contact, can_meet, message, status, created_at, pets!inner(name)')
    .order('created_at', { ascending: false })
    .returns<FoundReport[]>();
  if (error) throw error;
  return data ?? [];
}

export async function updateReportStatus(id: string, status: ReportStatus): Promise<void> {
  const { error } = await supabase.from('found_reports').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function submitFoundReport(publicCode: string, input: FoundReportInput): Promise<string> {
  const { data, error } = await supabase.rpc('submit_found_report', {
    p_code: publicCode,
    p_finder_name: input.finderName,
    p_location: input.location,
    p_found_at: new Date(input.foundAt).toISOString(),
    p_photo_url: input.photoUrl,
    p_finder_contact: input.finderContact,
    p_can_meet: input.canMeet,
    p_message: input.message,
  });
  if (error) throw error;
  if (typeof data !== 'string') throw new Error('Respuesta inesperada del servidor');
  return data;
}

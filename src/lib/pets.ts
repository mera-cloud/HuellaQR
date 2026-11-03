import { supabase } from '@/lib/supabase';
import type { PetSex, PetSpecies, PetStatus, Pet, PublicPet } from '@/lib/types';

const PET_COLUMNS =
  'id, owner_id, public_code, name, species, breed, birth_date, sex, weight_kg, distinctive_features, medical_info, medical_public, photo_url, status, active, created_at, updated_at';

export interface PetInput {
  name: string;
  species: PetSpecies;
  breed: string;
  birth_date: string;
  sex: PetSex;
  weight_kg: number | null;
  distinctive_features: string;
  medical_info: string | null;
  medical_public: boolean;
  photo_url: string | null;
}

export async function listMyPets(): Promise<Pet[]> {
  const { data, error } = await supabase
    .from('pets')
    .select(PET_COLUMNS)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getMyPet(id: string): Promise<Pet | null> {
  const { data, error } = await supabase.from('pets').select(PET_COLUMNS).eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createPet(ownerId: string, input: PetInput): Promise<Pet> {
  const { data, error } = await supabase
    .from('pets')
    .insert({ ...input, owner_id: ownerId })
    .select(PET_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function updatePet(id: string, input: PetInput): Promise<Pet> {
  const { data, error } = await supabase
    .from('pets')
    .update(input)
    .eq('id', id)
    .select(PET_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function updatePetStatus(id: string, status: PetStatus): Promise<void> {
  const { error } = await supabase.from('pets').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function setPetActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase.from('pets').update({ active }).eq('id', id);
  if (error) throw error;
}

export async function deletePet(id: string): Promise<void> {
  const { error } = await supabase.from('pets').delete().eq('id', id);
  if (error) throw error;
}

export async function getPublicPet(code: string): Promise<PublicPet | null> {
  const { data, error } = await supabase.rpc('get_public_pet', { p_code: code });
  if (error) throw error;
  return data?.[0] ?? null;
}

export type PetSpecies = 'perro' | 'gato';
export type PetSex = 'macho' | 'hembra';
export type PetStatus = 'en_casa' | 'extraviada' | 'en_reencuentro';
export type CanMeet = 'si' | 'no' | 'acordar';
export type ReportStatus = 'nuevo' | 'atendido';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
}

export interface Pet {
  id: string;
  owner_id: string;
  public_code: string;
  name: string;
  species: PetSpecies;
  breed: string;
  birth_date: string | null;
  sex: PetSex;
  weight_kg: number | null;
  distinctive_features: string;
  medical_info: string | null;
  medical_public: boolean;
  photo_url: string | null;
  status: PetStatus;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicPet {
  pet_name: string;
  pet_species: PetSpecies;
  pet_breed: string;
  pet_birth_date: string | null;
  pet_sex: PetSex;
  pet_distinctive_features: string;
  pet_medical_info: string | null;
  pet_status: PetStatus;
  pet_photo_url: string | null;
  owner_first_name: string;
}

export interface FoundReport {
  id: string;
  pet_id: string;
  finder_name: string;
  location: string;
  found_at: string;
  photo_url: string | null;
  finder_contact: string;
  can_meet: CanMeet;
  message: string | null;
  status: ReportStatus;
  created_at: string;
  pets: { name: string } | null;
}

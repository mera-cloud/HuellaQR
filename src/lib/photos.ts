import { supabase } from '@/lib/supabase';

const PHOTO_BUCKET = 'pet-photos';
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validatePhotoFile(file: File): string | null {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) return 'Sube una fotografía en formato JPG, PNG o WebP.';
  if (file.size > MAX_PHOTO_BYTES) return 'La fotografía no puede pesar más de 5 MB.';
  return null;
}

export async function uploadPhoto(file: File, folder: string): Promise<string> {
  const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: '3600' });
  if (error) throw error;

  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}

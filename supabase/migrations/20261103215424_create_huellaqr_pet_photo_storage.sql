/*
# Pet photo storage bucket and upload rules

Plain-English summary: creates a storage space for pet photos and photos sent with found reports. Photos are publicly viewable by link (they appear on public pet profiles), but uploads are restricted.

## 1. Storage
- Bucket `pet-photos`: public read, JPG/PNG/WebP only, maximum 5 MB per file.

## 2. Upload rules
- Signed-in owners can upload, replace and delete files only inside their own folder: `pets/<their user id>/`.
- Anyone (including visitors without an account) can upload into the `found/` folder, used for photos attached to found reports.

## 3. Important notes
1. Visitors cannot change or delete existing files.
2. Found-report photos are checked by the reporting function before they are saved.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('pet-photos', 'pet-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "owners_insert_pet_photos" ON storage.objects;
CREATE POLICY "owners_insert_pet_photos" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'pet-photos'
    AND (storage.foldername(name))[1] = 'pets'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

DROP POLICY IF EXISTS "owners_update_pet_photos" ON storage.objects;
CREATE POLICY "owners_update_pet_photos" ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'pet-photos'
    AND (storage.foldername(name))[1] = 'pets'
    AND (storage.foldername(name))[2] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'pet-photos'
    AND (storage.foldername(name))[1] = 'pets'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

DROP POLICY IF EXISTS "owners_delete_pet_photos" ON storage.objects;
CREATE POLICY "owners_delete_pet_photos" ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'pet-photos'
    AND (storage.foldername(name))[1] = 'pets'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

DROP POLICY IF EXISTS "anyone_insert_found_photos" ON storage.objects;
CREATE POLICY "anyone_insert_found_photos" ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'pet-photos'
    AND (storage.foldername(name))[1] = 'found'
  );

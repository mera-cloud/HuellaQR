/*
# Create owner profiles and pets tables

Plain-English summary: sets up the core data for HuellaQR. Each pet owner has a profile (full name and phone). Each pet belongs to exactly one owner and receives a random public code that is printed into its QR.

## 1. New tables
- `profiles`: one row per owner account. `id` matches the Supabase Auth user id. Stores full name and phone number.
- `pets`: one row per pet. Holds identification data, physical description, optional medical info, the owner's choice to share medical info, status (at home, lost, in reunion process), an active flag and a random `public_code` used by the QR.

## 2. Security
- RLS is enabled on both tables.
- Owners can read, create, edit and delete only their own rows.
- The `pets` table grants column-level privileges. The `public_code`, `owner_id` (on update) and `id` columns cannot be changed by clients.
- Public visitors have no direct access to these tables. They use secure functions added in a later migration.

## 3. Important notes
1. `public_code` is generated randomly by the database (64 random bits, hexadecimal).
2. Deleting an owner's profile removes their pets as well.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 2 AND 100),
  phone text NOT NULL CHECK (char_length(btrim(phone)) BETWEEN 7 AND 20),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  public_code text NOT NULL UNIQUE DEFAULT substr(replace(gen_random_uuid()::text, '-', ''), 1, 16),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 60),
  species text NOT NULL CHECK (species IN ('perro', 'gato')),
  breed text NOT NULL CHECK (char_length(btrim(breed)) BETWEEN 1 AND 60),
  birth_date date,
  sex text NOT NULL CHECK (sex IN ('macho', 'hembra')),
  weight_kg numeric(5, 2) CHECK (weight_kg IS NULL OR (weight_kg > 0 AND weight_kg < 200)),
  distinctive_features text NOT NULL CHECK (char_length(btrim(distinctive_features)) BETWEEN 1 AND 500),
  medical_info text CHECK (medical_info IS NULL OR char_length(medical_info) <= 1000),
  medical_public boolean NOT NULL DEFAULT false,
  photo_url text,
  status text NOT NULL DEFAULT 'en_casa' CHECK (status IN ('en_casa', 'extraviada', 'en_reencuentro')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pets_owner_id_idx ON pets (owner_id);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

GRANT SELECT, DELETE ON pets TO authenticated;
GRANT INSERT (owner_id, name, species, breed, birth_date, sex, weight_kg, distinctive_features, medical_info, medical_public, photo_url) ON pets TO authenticated;
GRANT UPDATE (name, species, breed, birth_date, sex, weight_kg, distinctive_features, medical_info, medical_public, photo_url, status, active) ON pets TO authenticated;

DROP POLICY IF EXISTS "select_own_pets" ON pets;
CREATE POLICY "select_own_pets" ON pets FOR SELECT
  TO authenticated USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "insert_own_pets" ON pets;
CREATE POLICY "insert_own_pets" ON pets FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "update_own_pets" ON pets;
CREATE POLICY "update_own_pets" ON pets FOR UPDATE
  TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "delete_own_pets" ON pets;
CREATE POLICY "delete_own_pets" ON pets FOR DELETE
  TO authenticated USING (auth.uid() = owner_id);

CREATE OR REPLACE FUNCTION touch_pet_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pets_touch_updated_at ON pets;
CREATE TRIGGER pets_touch_updated_at BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION touch_pet_updated_at();

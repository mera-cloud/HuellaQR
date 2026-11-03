/*
# Public pet profile and found-report functions

Plain-English summary: adds two secure functions that are the only way people without an account can interact with the database.
1. `get_public_pet`: returns the public profile of an active pet using its QR code. It returns the owner's first name only. It never returns email, phone, address or the owner id. Medical info is returned only if the owner chose to share it.
2. `submit_found_report`: saves a found-pet report for the pet matching the QR code, after validating the data.

## 1. Functions
- `get_public_pet(p_code)`: read-only, runs with elevated rights but exposes only whitelisted columns.
- `submit_found_report(...)`: validates input and inserts one row in `found_reports`.

## 2. Security
- Both functions revoke the default public execute permission and are granted only to `anon` and `authenticated`.
- Photos attached to reports must come from the pet-photos bucket folder reserved for found photos.
- Reports are accepted only for active pets and dates within the last year (or up to one day in the future).

## 3. Important notes
1. Missing or inactive codes return a generic "pet_not_found" error.
*/

CREATE OR REPLACE FUNCTION get_public_pet(p_code text)
RETURNS TABLE (
  pet_name text,
  pet_species text,
  pet_breed text,
  pet_birth_date date,
  pet_sex text,
  pet_distinctive_features text,
  pet_medical_info text,
  pet_status text,
  pet_photo_url text,
  owner_first_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.name,
    p.species,
    p.breed,
    p.birth_date,
    p.sex,
    p.distinctive_features,
    CASE WHEN p.medical_public THEN p.medical_info END,
    p.status,
    p.photo_url,
    split_part(btrim(pr.full_name), ' ', 1)
  FROM pets p
  JOIN profiles pr ON pr.id = p.owner_id
  WHERE p.public_code = p_code
    AND p.active
$$;

REVOKE EXECUTE ON FUNCTION get_public_pet(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_public_pet(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION submit_found_report(
  p_code text,
  p_finder_name text,
  p_location text,
  p_found_at timestamptz,
  p_photo_url text,
  p_finder_contact text,
  p_can_meet text,
  p_message text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pet_id uuid;
  v_report_id uuid;
BEGIN
  SELECT p.id INTO v_pet_id
  FROM pets p
  WHERE p.public_code = p_code
    AND p.active;

  IF v_pet_id IS NULL THEN
    RAISE EXCEPTION 'pet_not_found' USING ERRCODE = 'P0002';
  END IF;

  IF p_found_at IS NULL OR p_found_at > now() + interval '1 day' OR p_found_at < now() - interval '1 year' THEN
    RAISE EXCEPTION 'invalid_found_at' USING ERRCODE = '22007';
  END IF;

  IF p_photo_url IS NOT NULL AND position('/pet-photos/found/' IN p_photo_url) = 0 THEN
    RAISE EXCEPTION 'invalid_photo' USING ERRCODE = '22023';
  END IF;

  INSERT INTO found_reports (
    pet_id, finder_name, location, found_at, photo_url, finder_contact, can_meet, message
  ) VALUES (
    v_pet_id,
    btrim(p_finder_name),
    btrim(p_location),
    p_found_at,
    p_photo_url,
    btrim(p_finder_contact),
    p_can_meet,
    NULLIF(btrim(p_message), '')
  )
  RETURNING id INTO v_report_id;

  RETURN v_report_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION submit_found_report(text, text, text, timestamptz, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION submit_found_report(text, text, text, timestamptz, text, text, text, text) TO anon, authenticated;

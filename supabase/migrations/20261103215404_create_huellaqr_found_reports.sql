/*
# Create found pet reports table

Plain-English summary: stores the reports sent by people who find a pet. Each report is linked to one pet. Only the owner of that pet can read reports and mark them as handled. Reports are created through a secure function (added in the next migration), never directly by visitors.

## 1. New tables
- `found_reports`: finder name, location, date and time found, optional photo, finder contact (phone or email), whether the finder can meet, optional message, and status (new or handled).

## 2. Security
- RLS is enabled.
- Owners of the pet can read its reports and change only the `status` column.
- No client can insert or delete reports directly.

## 3. Important notes
1. Reports are deleted automatically if their pet is deleted.
2. Status values: 'nuevo' (new) and 'atendido' (handled).
*/

CREATE TABLE IF NOT EXISTS found_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  finder_name text NOT NULL CHECK (char_length(btrim(finder_name)) BETWEEN 2 AND 100),
  location text NOT NULL CHECK (char_length(btrim(location)) BETWEEN 3 AND 200),
  found_at timestamptz NOT NULL,
  photo_url text,
  finder_contact text NOT NULL CHECK (char_length(btrim(finder_contact)) BETWEEN 5 AND 120),
  can_meet text NOT NULL CHECK (can_meet IN ('si', 'no', 'acordar')),
  message text CHECK (message IS NULL OR char_length(message) <= 500),
  status text NOT NULL DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'atendido')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS found_reports_pet_id_idx ON found_reports (pet_id);

ALTER TABLE found_reports ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON found_reports TO authenticated;
GRANT UPDATE (status) ON found_reports TO authenticated;

DROP POLICY IF EXISTS "select_reports_of_own_pets" ON found_reports;
CREATE POLICY "select_reports_of_own_pets" ON found_reports FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pets p WHERE p.id = found_reports.pet_id AND p.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "update_reports_of_own_pets" ON found_reports;
CREATE POLICY "update_reports_of_own_pets" ON found_reports FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM pets p WHERE p.id = found_reports.pet_id AND p.owner_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM pets p WHERE p.id = found_reports.pet_id AND p.owner_id = auth.uid()
  ));

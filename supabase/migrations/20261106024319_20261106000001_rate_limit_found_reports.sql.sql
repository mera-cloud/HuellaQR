/*
# Rate limit for found pet reports

Plain-English summary: limits how many reports a single pet can receive within a rolling
60-minute window. After 5 reports in any 60-minute period, further reports are rejected
with a controlled error until the window passes.

## 1. What changes
- The `submit_found_report` function is replaced with a new version that counts existing
  reports for the matched pet whose `created_at` falls within the last 60 minutes.
- If that count is 5 or more, the function raises the `rate_limit_exceeded` error
  (SQLSTATE 45000) and does NOT insert the new report.
- Otherwise the function proceeds exactly as before: validates the date, validates the
  photo URL, and inserts the row.

## 2. How the limit is enforced atomically
- The function acquires a `SHARE ROW EXCLUSIVE` lock on `found_reports` before counting.
  This lock allows concurrent reads from other transactions but blocks concurrent
  inserts. Two simultaneous calls to `submit_found_report` cannot both count "4" and
  then both insert: the second call waits until the first commits, then sees 5 and is
  rejected.
- `found_reports` has no INSERT RLS policy and no direct INSERT grant to any client role.
  `submit_found_report` (SECURITY DEFINER) is the only path to create a report, so
  nothing can bypass this check.

## 3. Security
- No RLS policies, table grants, or storage policies are changed.
- All existing validations (pet exists and is active, date within range, photo URL
  check) are preserved unchanged.
- The function remains SECURITY DEFINER with search_path set to public, callable by
  anon and authenticated only.

## 4. Important notes
1. The limit is per pet, identified by its validated `public_code`. It does not depend
   on the caller's IP address.
2. The window is rolling: any 60-minute period is checked against `created_at`, so
   once the oldest of 5 reports passes the 60-minute mark, a new report is allowed again.
3. Rejected reports are never inserted: the RAISE EXCEPTION aborts the function before
   the INSERT statement.
4. The constant is defined as `v_max_reports INT := 5` and the window as
   `interval '60 minutes'`, both easy to adjust.
*/

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
  v_recent_count int;
  v_max_reports int := 5;
BEGIN
  -- Acquire a lock that serializes inserts while allowing concurrent reads.
  -- Two simultaneous calls cannot both pass the count check and insert.
  LOCK TABLE found_reports IN SHARE ROW EXCLUSIVE MODE;

  SELECT p.id INTO v_pet_id
  FROM pets p
  WHERE p.public_code = p_code
    AND p.active;

  IF v_pet_id IS NULL THEN
    RAISE EXCEPTION 'pet_not_found' USING ERRCODE = 'P0002';
  END IF;

  -- Rolling 60-minute window: count reports for this pet created in the last hour.
  SELECT count(*) INTO v_recent_count
  FROM found_reports
  WHERE found_reports.pet_id = v_pet_id
    AND found_reports.created_at >= now() - interval '60 minutes';

  IF v_recent_count >= v_max_reports THEN
    RAISE EXCEPTION 'rate_limit_exceeded' USING ERRCODE = '45000';
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

-- Preserve the execute grants: revoke from PUBLIC, grant only to anon + authenticated.
REVOKE EXECUTE ON FUNCTION submit_found_report(text, text, text, timestamptz, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION submit_found_report(text, text, text, timestamptz, text, text, text, text) TO anon, authenticated;

-- Partial index to make the rate-limit count fast.
CREATE INDEX IF NOT EXISTS found_reports_pet_id_created_at_idx
  ON found_reports (pet_id, created_at);

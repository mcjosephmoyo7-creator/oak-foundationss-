-- ============================================================
-- Day 3: Event Check-In System Schema
-- Tables: attendees, check_ins, admin_users
-- RPC: check_in_attendee
-- RLS: Admin-only access policies
-- ============================================================

-- ============================================================
-- TABLE: attendees
-- ============================================================
CREATE TABLE IF NOT EXISTS attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  qr_code TEXT UNIQUE,
  accommodation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendees_qr_code ON attendees (qr_code);
CREATE INDEX IF NOT EXISTS idx_attendees_full_name ON attendees (full_name);

-- ============================================================
-- TABLE: check_ins
-- ============================================================
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendee_id UUID NOT NULL REFERENCES attendees(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  checked_in_by UUID REFERENCES auth.users(id),
  UNIQUE(attendee_id, check_in_date)
);

CREATE INDEX IF NOT EXISTS idx_check_ins_date ON check_ins (check_in_date);
CREATE INDEX IF NOT EXISTS idx_check_ins_attendee ON check_ins (attendee_id);

-- ============================================================
-- TABLE: admin_users
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- RPC: check_in_attendee
-- ============================================================
CREATE OR REPLACE FUNCTION check_in_attendee(p_attendee_id UUID)
RETURNS JSON AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_is_admin BOOLEAN;
  v_attendee RECORD;
  v_existing RECORD;
  v_new_check_in RECORD;
BEGIN
  -- Verify caller is an admin
  SELECT EXISTS(
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO v_is_admin;

  IF NOT v_is_admin THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Unauthorized: admin access required'
    );
  END IF;

  -- Verify attendee exists
  SELECT id, full_name, email, accommodation, qr_code
  INTO v_attendee
  FROM attendees
  WHERE id = p_attendee_id;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Attendee not found'
    );
  END IF;

  -- Check if already checked in today
  SELECT id INTO v_existing
  FROM check_ins
  WHERE attendee_id = p_attendee_id AND check_in_date = v_today
  LIMIT 1;

  IF FOUND THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Already checked in today',
      'attendee', json_build_object(
        'id', v_attendee.id,
        'full_name', v_attendee.full_name,
        'email', v_attendee.email,
        'accommodation', v_attendee.accommodation
      )
    );
  END IF;

  -- Insert new check-in
  INSERT INTO check_ins (attendee_id, check_in_date, checked_in_by)
  VALUES (p_attendee_id, v_today, auth.uid())
  RETURNING id, attendee_id, check_in_date, checked_in_at
  INTO v_new_check_in;

  RETURN json_build_object(
    'success', true,
    'message', 'Check-in successful',
    'check_in', json_build_object(
      'id', v_new_check_in.id,
      'checked_in_at', v_new_check_in.checked_in_at,
      'check_in_date', v_new_check_in.check_in_date
    ),
    'attendee', json_build_object(
      'id', v_attendee.id,
      'full_name', v_attendee.full_name,
      'email', v_attendee.email,
      'accommodation', v_attendee.accommodation
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- attendees: admins can read all; authenticated users can read their own qr_code
CREATE POLICY "Admins can read all attendees"
  ON attendees FOR SELECT
  TO authenticated
  USING (is_admin());

-- check_ins: admins can read all
CREATE POLICY "Admins can read all check_ins"
  ON check_ins FOR SELECT
  TO authenticated
  USING (is_admin());

-- check_ins: admins can insert
CREATE POLICY "Admins can insert check_ins"
  ON check_ins FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- admin_users: users can read their own record
CREATE POLICY "Users can read own admin record"
  ON admin_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- Enable Realtime on check_ins
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE check_ins;

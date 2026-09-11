-- ============================================================
-- Enhance check_in_attendee to return attendee organization & role
-- These fields are needed by the approval page to display
-- the attendee's organisation and role/capacity after check-in.
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
  SELECT id, full_name, email, accommodation, qr_code, organization, role
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
        'accommodation', v_attendee.accommodation,
        'qr_code', v_attendee.qr_code,
        'organization', v_attendee.organization,
        'role', v_attendee.role
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
      'accommodation', v_attendee.accommodation,
      'qr_code', v_attendee.qr_code,
      'organization', v_attendee.organization,
      'role', v_attendee.role
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
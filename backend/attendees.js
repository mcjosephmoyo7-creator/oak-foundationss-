const crypto = require("crypto");
const supabase = require("./supabaseClient");
const { validateAttendee } = require("./validation");

async function registerAttendee(attendee) {
  // Validate information
  const errors = validateAttendee(attendee);

  if (errors.length > 0) {
    return {
      success: false,
      errors
    };
  }

  // Generate unique ID for QR/registration
  const uniqueId = crypto.randomUUID();

  const attendeeData = {
    first_name: attendee.first_name.trim(),
    last_name: attendee.last_name.trim(),
    email: attendee.email.trim().toLowerCase(),
    organization: attendee.organization || null,
    role: attendee.role || null,
    phone: attendee.phone || null,
    dietary_requirements: attendee.dietary_requirements || null,
    "travel-support": attendee["travel-support"] ?? false,
    accomodation_needed: attendee.accomodation_needed ?? false,
    unique_id: uniqueId,
    status: "registered"
  };

  const { data, error } = await supabase
    .from("attendes")
    .insert([attendeeData])
    .select()
    .single();

  if (error) {
    console.error("Registration error:", error);

    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: true,
    attendee: data
  };
}


async function getAttendeeById(id) {
  const { data, error } = await supabase
    .from("attendes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: true,
    attendee: data
  };
}


async function getAttendeeByUniqueId(uniqueId) {
  const { data, error } = await supabase
    .from("attendes")
    .select("*")
    .eq("unique_id", uniqueId)
    .single();

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: true,
    attendee: data
  };
}


async function updateAttendeeStatus(id, status) {
  const { data, error } = await supabase
    .from("attendes")
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: true,
    attendee: data
  };
}


async function checkInAttendee(uniqueId) {
  const { data, error } = await supabase
    .from("attendes")
    .update({
      status: "checked_in",
      checked_in_at: new Date().toISOString()
    })
    .eq("unique_id", uniqueId)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: true,
    attendee: data
  };
}


module.exports = {
  registerAttendee,
  getAttendeeById,
  getAttendeeByUniqueId,
  updateAttendeeStatus,
  checkInAttendee
};
const supabase = require("./supabaseClient");


async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: true,
    profile: data
  };
}


async function updateProfile(userId, profileData) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      fullname: profileData.fullname,
      email: profileData.email,
      phone: profileData.phone,
      avatar_url: profileData.avatar_url,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId)
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
    profile: data
  };
}


module.exports = {
  getProfile,
  updateProfile
};
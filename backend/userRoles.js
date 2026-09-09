const supabase = require("./supabaseClient");


async function getUserRole(userId) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: true,
    role: data
  };
}


async function assignUserRole(userId, role) {
  const { data, error } = await supabase
    .from("user_roles")
    .insert([
      {
        user_id: userId,
        role
      }
    ])
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
    role: data
  };
}


module.exports = {
  getUserRole,
  assignUserRole
};
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Handle browser CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Method not allowed",
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    // Get Supabase credentials automatically provided
    // to the Edge Function
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Supabase environment variables are missing"
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseKey
    );

    // Read request body
    const body = await req.json();

    const {
      first_name,
      last_name,
      email,
      organization,
      role,
      phone,
      dietary_requirements,
      travel_support,
      accommodation_needed,
    } = body;

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "First name, last name and email are required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Validate email
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid email address",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check whether email is already registered
    const {
      data: existingAttendee,
      error: existingError,
    } = await supabase
      .from("attendes")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (existingError) {
      console.error(existingError);

      return new Response(
        JSON.stringify({
          success: false,
          error: existingError.message,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Prevent duplicate registration
    if (existingAttendee) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "An attendee with this email is already registered",
        }),
        {
          status: 409,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Generate a unique ID
    // This can be used as the attendee's QR identifier
    const uniqueId = crypto.randomUUID();

    // Insert attendee into Supabase
    const { data, error } = await supabase
      .from("attendes")
      .insert({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.trim().toLowerCase(),

        organization:
          organization?.trim() || null,

        role:
          role?.trim() || null,

        phone:
          phone?.trim() || null,

        dietary_requirements:
          dietary_requirements?.trim() || null,

        // IMPORTANT:
        // These database column names contain hyphen/spelling
        // exactly as defined in the Supabase database.
        "travel-support":
          travel_support ?? false,

        accomodation_needed:
          accommodation_needed ?? false,

        unique_id: uniqueId,

        status: "registered",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);

      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Successful registration
    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Attendee registered successfully",
        attendee: data,
      }),
      {
        status: 201,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "Unexpected error:",
      error
    );

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

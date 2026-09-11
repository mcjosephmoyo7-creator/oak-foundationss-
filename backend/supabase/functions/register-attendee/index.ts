import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type DenoRuntime = {
  env: { get(name: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

const deno = (globalThis as typeof globalThis & { Deno: DenoRuntime }).Deno;

const jsonResponse = (
  body: Record<string, unknown>,
  status: number
): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

deno.serve(async (req: Request) => {
  // Handle browser CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return jsonResponse(
      {
        success: false,
        error: "Method not allowed",
      },
      405
    );
  }

  try {
    // Get Supabase credentials automatically provided
    // to the Edge Function
    const supabaseUrl = deno.env.get("SUPABASE_URL");
    const supabaseKey =
      deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return jsonResponse(
        {
          success: false,
          error: "Registration service is not configured",
        },
        500
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Read request body (safe: invalid JSON -> 400, never 500)
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return jsonResponse(
        {
          success: false,
          error: "Invalid request body",
        },
        400
      );
    }

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

    // Normalize string fields defensively
    const str = (value: unknown): string =>
      typeof value === "string" ? value.trim() : "";

    const firstName = str(first_name);
    const lastName = str(last_name);
    const emailValue = str(email).toLowerCase();

    // Validate required fields
    if (!firstName || !lastName || !emailValue) {
      return jsonResponse(
        {
          success: false,
          error: "First name, last name and email are required",
        },
        400
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailValue)) {
      return jsonResponse(
        {
          success: false,
          error: "Invalid email address",
        },
        400
      );
    }

    // Check whether email is already registered
    const {
      data: existingAttendee,
      error: existingError,
    } = await supabase
      .from("attendees")
      .select("*")
      .eq("email", emailValue)
      .maybeSingle();

    if (existingError) {
      console.error(existingError);

      return jsonResponse(
        {
          success: false,
          error: existingError.message,
        },
        500
      );
    }

    // Return the existing attendee so the client can recover
    // their current QR pass instead of blocking the flow
    if (existingAttendee) {
      return jsonResponse(
        {
          success: false,
          already_registered: true,
          error: "An attendee with this email is already registered",
          attendee: existingAttendee,
        },
        409
      );
    }

    // Generate a unique ID
    // This can be used as the attendee's QR identifier
    const qrCode = `OAK-2026-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    // Insert attendee into Supabase
    const { data, error } = await supabase
      .from("attendees")
      .insert({
        full_name: `${firstName} ${lastName}`,
        email: emailValue,
        phone: str(phone) || null,
        organization: str(organization) || null,
        role: str(role) || null,
        dietary_requirements: str(dietary_requirements) || null,
        travel_support: (travel_support as boolean) ?? false,
        accommodation_needed: (accommodation_needed as boolean) ?? false,
        qr_code: qrCode,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);

      return jsonResponse(
        {
          success: false,
          error: error.message,
        },
        500
      );
    }

    // Successful registration
    return jsonResponse(
      {
        success: true,
        message: "Attendee registered successfully",
        attendee: data,
      },
      201
    );
  } catch (error) {
    console.error("Unexpected error:", error);

    return jsonResponse(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      500
    );
  }
});
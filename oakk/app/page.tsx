"use client";

import { FormEvent, useState } from "react";

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
};

const initialForm: FormState = {
  first_name: "",
  last_name: "",
  email: "",
};

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      setMessage("Configure the local Supabase environment variables first.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/register-attendee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      setMessage(
        response.ok
          ? "Registration submitted successfully."
          : result.error || "Registration could not be submitted."
      );

      if (response.ok) {
        setForm(initialForm);
      }
    } catch {
      setMessage("Could not reach the local Supabase function.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <section>
        <p>Oak Foundations</p>
        <h1>Attendee registration</h1>
        <p>Register through the local Supabase Edge Function.</p>
        <form onSubmit={handleSubmit}>
          <label>
            First name
            <input
              required
              value={form.first_name}
              onChange={(event) => setForm({ ...form, first_name: event.target.value })}
            />
          </label>
          <label>
            Last name
            <input
              required
              value={form.last_name}
              onChange={(event) => setForm({ ...form, last_name: event.target.value })}
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Register attendee"}
          </button>
        </form>
        {message && <p role="status">{message}</p>}
      </section>
    </main>
  );
}

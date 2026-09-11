"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthProvider, { useAuth } from "../../components/dashboard/AuthProvider";

function LoginForm() {
  const { isAdmin, loading, signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAdmin) router.replace("/dashboard");
  }, [isAdmin, loading, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await signIn(email.trim(), password);
    if (result.error) setError(result.error);
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[#EDF1F7] px-4 py-8 sm:flex sm:items-center sm:justify-center">
      <section className="mx-auto w-full max-w-90">
        <div className="mb-5 text-center">
          <Image src="/oak-logo.svg" alt="OAK Foundation" width={108} height={40} className="mx-auto h-10 w-auto" priority />
          <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1D3E6E]">Partner Convening 2026</p>
        </div>

        <div className="rounded-2xl bg-[#F7FAFD] p-6 shadow-sm ring-1 ring-[#D6DEE8]/70 sm:p-7">
          <h1 className="text-lg font-bold text-[#162E55]">Sign in</h1>
          <p className="mt-1 text-xs text-[#3A5A85]">Sign in to continue.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</p>}
            <label className="block text-xs font-semibold text-[#3A5A85]">
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="mt-1.5 w-full rounded-lg border border-[#C9D4E0] px-3 py-2.5 text-sm text-[#162E55] outline-none focus:border-[#1D3E6E] focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="block text-xs font-semibold text-[#3A5A85]">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="mt-1.5 w-full rounded-lg border border-[#C9D4E0] px-3 py-2.5 text-sm text-[#162E55] outline-none focus:border-[#1D3E6E] focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full rounded-lg bg-[#1D3E6E] px-4 py-2.5 text-sm font-semibold text-[#EDF1F7] transition-colors hover:bg-[#112344] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <Link href="/register" className="mt-4 block text-center text-xs font-semibold text-[#1D3E6E] hover:underline">
          Register an attendee instead
        </Link>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}

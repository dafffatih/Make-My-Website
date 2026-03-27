"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams?.get("registered") === "true";
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh(); // Refresh state to update session
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-700 ease-out z-10">
      <div className="flex flex-col items-center mb-10">
        <Link href="/dashboard" className="flex items-center gap-3 group mb-8">
          <div className="w-10 h-10 rounded-xl bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-white text-xl">public</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tighter text-white">Make My Website</span>
        </Link>
        <h1 className="text-3xl font-headline font-bold text-white mb-2 tracking-tight">Welcome back</h1>
        <p className="text-on-surface-variant text-sm text-center">Please enter your details to sign in.</p>
      </div>

      <div className="bg-surface-container-low/60 backdrop-blur-xl border border-outline-variant/20 p-8 rounded-3xl shadow-2xl relative">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {isRegistered && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm px-4 py-3 rounded-lg text-center">
              Registration successful! Please sign in.
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant block" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="name@example.com" 
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-surface-container-high/50 border border-outline-variant/30 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-outline"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface-variant block" htmlFor="password">Password</label>
              <a href="#" className="text-xs text-primary font-bold hover:underline">Forgot password?</a>
            </div>
            <input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-surface-container-high/50 border border-outline-variant/30 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-outline"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] text-white font-bold tracking-wide hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <span className="border-b border-outline-variant/20 w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Or continue with</span>
          <span className="border-b border-outline-variant/20 w-1/5 lg:w-1/4"></span>
        </div>

        <div className="mt-8">
          <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-outline-variant/30 bg-surface-container-high/30 hover:bg-white/5 transition-colors text-white font-bold text-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
        </div>
      </div>

      <p className="text-center text-on-surface-variant text-sm mt-8">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary font-bold hover:underline">
          Sign up for free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-manrope">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4f46e5]/20 rounded-full blur-[120px] -z-10 translate-y-1/2 -translate-x-1/3" />

      <Suspense fallback={<div className="text-white z-10 w-full max-w-md p-6 text-center animate-pulse">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-manrope py-12">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 translate-y-1/3 translate-x-1/3" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#4f46e5]/20 rounded-full blur-[120px] -z-10 -translate-y-1/3 -translate-x-1/3" />

      <div className="w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-700 ease-out z-10">
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="flex items-center gap-3 group mb-8">
            <div className="w-10 h-10 rounded-xl bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-xl">public</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tighter text-white">Make My Website</span>
          </Link>
          <h1 className="text-3xl font-headline font-bold text-white mb-2 tracking-tight">Create an account</h1>
          <p className="text-on-surface-variant text-sm text-center">Join us today and unleash your digital success.</p>
        </div>

        <div className="bg-surface-container-low/60 backdrop-blur-xl border border-outline-variant/20 p-8 rounded-3xl shadow-2xl relative">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant block" htmlFor="name">Full Name</label>
              <input 
                id="name"
                type="text" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-surface-container-high/50 border border-outline-variant/30 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-outline"
                required
              />
            </div>

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant block" htmlFor="password">Password</label>
                <div className="relative">
                  <input 
                    id="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-surface-container-high/50 border border-outline-variant/30 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-outline pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors p-1"
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant block" htmlFor="confirm_password">Confirm Password</label>
                <div className="relative">
                  <input 
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full bg-surface-container-high/50 border border-outline-variant/30 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-outline pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors p-1"
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <label className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer w-5 h-5 rounded appearance-none border border-outline-variant/30 bg-surface-container-high/50 checked:bg-primary checked:border-primary transition-all cursor-pointer" required />
                  <span className="material-symbols-outlined absolute text-[14px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                </div>
                <span className="text-xs text-on-surface-variant">
                  I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                </span>
              </label>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] text-white font-bold tracking-wide hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <span className="border-b border-outline-variant/20 w-1/5 lg:w-1/4"></span>
            <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Or sign up with</span>
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
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

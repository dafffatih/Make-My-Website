"use client"

import { useState } from "react"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

      if (!res.ok) throw new Error("Failed")

      setStatus("success")
      setName("")
      setEmail("")
      setMessage("")
      setTimeout(() => setStatus("idle"), 4000)
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 4000)
    }
  }

  return (
    <div className="bg-surface-container p-12 rounded-3xl border border-outline-variant/10 shadow-3xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors">Full Name</label>
          <input
            className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-4 focus:ring-0 focus:border-primary text-white transition-all placeholder:text-zinc-700"
            placeholder="Alexander Graham"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors">Business Email</label>
          <input
            className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-4 focus:ring-0 focus:border-primary text-white transition-all placeholder:text-zinc-700"
            placeholder="alex@company.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors">Project Brief</label>
          <textarea
            className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-4 focus:ring-0 focus:border-primary text-white transition-all placeholder:text-zinc-700 resize-none"
            placeholder="Tell us about your digital ambition..."
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button
          className="w-full py-5 rounded-full bg-white text-black font-black tracking-widest uppercase text-xs hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : status === "success" ? "✓ Sent Successfully!" : status === "error" ? "Failed — Try Again" : "Send Brief"}
        </button>
      </form>
    </div>
  )
}

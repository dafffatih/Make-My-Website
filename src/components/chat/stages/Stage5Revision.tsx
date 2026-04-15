"use client";

import { useState } from "react";
import { submitRevision } from "@/app/actions/project";
import { Send } from "lucide-react";

export default function Stage5Revision({ project, onRevisionSubmit }: { project: any, onRevisionSubmit: () => void }) {
  const [loading, setLoading] = useState(false);
  const [revisionDetails, setRevisionDetails] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!project) return null;

  const ticketsLeft = project.revisionTickets;
  const maxTickets = project.maxRevisions;
  const noTickets = ticketsLeft <= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionDetails.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await submitRevision(project.id, revisionDetails);
      setSuccessMsg("Revision submitted successfully. Our team will review it shortly.");
      setRevisionDetails("");
      onRevisionSubmit();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to submit revision");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTicket = () => {
     alert("Buying more tickets... (Not implemented in this demo)");
  }

  return (
    <div className="p-8 pb-32">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-white">Revisions</h3>
        <p className="text-on-surface-variant text-sm mt-1">
          Request changes to your website. You have a limited number of revision tickets based on your package.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
         {/* Ticketing Info */}
         <div className="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-primary border-b border-outline-variant/10 pb-2">Your Tickets</h4>
            
            <div className="flex items-center justify-between">
               <span className="text-on-surface-variant text-sm">Tickets Remaining</span>
               <div className="flex gap-1">
                  {[...Array(maxTickets)].map((_, i) => (
                     <div 
                        key={i} 
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                           i < ticketsLeft 
                              ? 'border-primary bg-primary/20 shadow-[0_0_10px_rgba(79,70,229,0.3)]' 
                              : 'border-outline-variant/20 bg-transparent'
                        }`}
                     >
                        {i < ticketsLeft && <span className="w-2 h-2 rounded-full bg-primary" />}
                     </div>
                  ))}
               </div>
            </div>

            <div className="flex items-baseline gap-2">
               <span className="text-4xl font-black text-white">{ticketsLeft}</span>
               <span className="text-sm text-on-surface-variant font-bold uppercase tracking-widest">/ {maxTickets} Left</span>
            </div>

            {noTickets && (
               <div className="pt-4 border-t border-outline-variant/10">
                  <p className="text-xs text-red-400 font-medium mb-3">You have ran out of revision tickets.</p>
                  <button 
                     onClick={handleBuyTicket}
                     className="w-full py-4 text-xs font-bold uppercase tracking-widest border border-primary/50 text-primary hover:bg-primary/10 rounded-xl transition-all"
                  >
                     Buy Additional Tickets
                  </button>
               </div>
            )}
         </div>

         {/* Submission Form */}
         <div className="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-primary border-b border-outline-variant/10 pb-2">Submit Revision</h4>
            
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">What would you like to change?</label>
                  <textarea
                     className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-3 focus:ring-0 focus:border-primary text-white transition-all placeholder:text-zinc-700 resize-none disabled:opacity-50"
                     rows={5}
                     placeholder="E.g., Please change the hero image to something more corporate..."
                     value={revisionDetails}
                     onChange={(e) => setRevisionDetails(e.target.value)}
                     disabled={noTickets || loading}
                     required
                  />
               </div>

               {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-bold">
                     {errorMsg}
                  </div>
               )}

               {successMsg && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-bold">
                     {successMsg}
                  </div>
               )}

               <button
                  type="submit"
                  disabled={noTickets || loading || !revisionDetails.trim()}
                  className="w-full mt-4 py-5 rounded-full bg-white text-black font-black tracking-widest uppercase text-xs hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex justify-center items-center gap-2"
               >
                  {loading ? (
                     <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                     <>
                        Use 1 Ticket <Send className="w-4 h-4" />
                     </>
                  )}
               </button>
            </form>
         </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { processPayment, updateProjectStage } from "@/app/actions/project";
import { Check, CheckCircle2, Lock, Rocket } from "lucide-react";

const DOMAIN_FEE = 100;

export default function Stage4Finalize({ project, onPaymentComplete }: { project: any, onPaymentComplete: () => void }) {
  const [loading, setLoading] = useState(false);
  const [includeDomain, setIncludeDomain] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!project) return null;

  const remainingBalance = project.totalAmount - project.amountPaid;
  const isFullyPaid = remainingBalance <= 0;
  
  // Calculate final charge including domain if it wasn't paid yet and user toggled it
  const domainCost = (!project.paidDomain && includeDomain) ? DOMAIN_FEE : 0;
  const finalCharge = remainingBalance + domainCost;

  const handlePayment = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await processPayment(project.id, remainingBalance, includeDomain, DOMAIN_FEE);
      onPaymentComplete();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      if (!project.paidDomain && includeDomain) {
        await processPayment(project.id, 0, true, DOMAIN_FEE);
      }
      await updateProjectStage(project.id, 5); // move to revisions
      onPaymentComplete();
    } catch (err: any) {
       console.error(err);
       setErrorMsg("Failed to deploy");
    } finally {
       setLoading(false);
    }
  }

  return (
    <div className="p-8 pb-32">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-white">Final Delivery</h3>
        <p className="text-on-surface-variant text-sm mt-1">
          {isFullyPaid && project.paidDomain 
            ? "Your project is fully paid and your domain is configured. You can now deploy." 
            : "Review the remaining balance and domain set-up before final deployment."}
        </p>
      </div>

      <div className="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl space-y-6 max-w-2xl">
        <h4 className="font-bold uppercase tracking-widest text-xs text-primary mb-4 border-b border-outline-variant/10 pb-2">Final Cost Breakdown</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Total Project Cost</span>
            <span className="text-white font-medium">${project.totalAmount.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Amount Paid So Far</span>
            <span className="text-green-400 font-medium">-${project.amountPaid.toLocaleString()}</span>
          </div>

          {!project.paidDomain && (
            <div className="pt-4 mt-2 border-t border-outline-variant/10">
              <label className="flex items-start gap-3 p-4 rounded-xl border border-outline-variant/20 cursor-pointer hover:border-outline-variant/50 transition-colors">
                <div className="relative flex items-center mt-0.5">
                  <input 
                    type="checkbox" 
                    className="peer shrink-0 appearance-none w-5 h-5 border-2 border-outline-variant/50 rounded-md checked:bg-primary checked:border-0 focus:ring-0 transition-colors"
                    checked={includeDomain}
                    onChange={(e) => setIncludeDomain(e.target.checked)}
                  />
                  <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm font-bold text-white mb-1">
                    <span>Add Domain Setup</span>
                    <span>+${DOMAIN_FEE}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">You didn't purchase domain set-up during the deposit. Check this to add it now.</p>
                </div>
              </label>
            </div>
          )}
          
          {project.paidDomain && (
             <div className="pt-4 border-t border-outline-variant/10">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400" /> Domain Setup</span>
                  <span className="text-green-400 font-medium">Paid (${project.domainFee})</span>
                </div>
             </div>
          )}
          
          <div className="pt-6 border-t border-outline-variant/10 flex justify-between items-center">
            <span className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Balance Remaining</span>
            <span className="text-3xl font-black text-white">${finalCharge.toLocaleString()}</span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-bold">
            {errorMsg}
          </div>
        )}

        {finalCharge > 0 ? (
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-4 py-5 rounded-full bg-white text-black font-black tracking-widest uppercase text-xs hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Pay Balance ${finalCharge.toLocaleString()} <Lock className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
             onClick={handleDeploy}
             disabled={loading}
             className="w-full mt-4 py-5 rounded-full bg-primary text-white font-black tracking-widest uppercase text-xs hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex justify-center items-center gap-2"
          >
             {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Deploy Website Now <Rocket className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { processPayment } from "@/app/actions/project";
import { Check, Lock } from "lucide-react";

const DOMAIN_FEE = 100;

export default function Stage2Payment({ project, onPaymentComplete }: { project: any, onPaymentComplete: () => void }) {
  const [loading, setLoading] = useState(false);
  const [payFull, setPayFull] = useState(false);
  const [includeDomain, setIncludeDomain] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!project) return null;

  const minDp = project.totalAmount * 0.2;
  const paymentAmount = payFull ? project.totalAmount : minDp;
  const finalCharge = paymentAmount + (includeDomain ? DOMAIN_FEE : 0);

  const handlePayment = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await processPayment(project.id, paymentAmount, includeDomain, DOMAIN_FEE);
      onPaymentComplete();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 pb-32">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-white">Deposit Payment</h3>
        <p className="text-on-surface-variant text-sm mt-1">
          Review your project costs and secure your spot in our development queue.
        </p>
      </div>

      <div className="bg-surface-container p-6 rounded-3xl border border-outline-variant/10 shadow-xl space-y-6 max-w-2xl">
        <h4 className="font-bold uppercase tracking-widest text-xs text-primary mb-4 border-b border-outline-variant/10 pb-2">Cost Breakdown</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Base Package ({project.package})</span>
            <span className="text-white font-medium">${project.basePrice.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Selected Add-ons</span>
            <span className="text-white font-medium">${project.addonsPrice.toLocaleString()}</span>
          </div>
          
          <div className="pt-3 border-t border-outline-variant/10 flex justify-between">
            <span className="text-white font-bold">Subtotal</span>
            <span className="text-white font-bold">${project.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-6">
          <h4 className="font-bold uppercase tracking-widest text-xs text-primary mb-4 border-b border-outline-variant/10 pb-2">Payment Options</h4>
          
          <div className="grid gap-3">
            <button 
              onClick={() => setPayFull(false)}
              className={`p-4 rounded-xl border flex flex-col items-start transition-all ${!payFull ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(79,70,229,0.15)]' : 'border-outline-variant/20 hover:border-outline-variant/50'}`}
            >
              <div className="flex justify-between w-full mb-1">
                <span className={`font-bold ${!payFull ? 'text-primary' : 'text-white'}`}>20% Deposit (Minimum)</span>
                <span className={`font-bold ${!payFull ? 'text-primary' : 'text-white'}`}>${minDp.toLocaleString()}</span>
              </div>
              <span className="text-xs text-on-surface-variant">Pay the minimum to start development. Balance due at delivery.</span>
            </button>
            
            <button 
              onClick={() => setPayFull(true)}
              className={`p-4 rounded-xl border flex flex-col items-start transition-all ${payFull ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(79,70,229,0.15)]' : 'border-outline-variant/20 hover:border-outline-variant/50'}`}
            >
              <div className="flex justify-between w-full mb-1">
                <span className={`font-bold ${payFull ? 'text-primary' : 'text-white'}`}>100% Full Payment</span>
                <span className={`font-bold ${payFull ? 'text-primary' : 'text-white'}`}>${project.totalAmount.toLocaleString()}</span>
              </div>
              <span className="text-xs text-on-surface-variant">Pay in full now and skip the final payment stage later.</span>
            </button>
          </div>
        </div>

        <div className="pt-6">
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
                <span>Add Domain Setup & Configuration</span>
                <span>+${DOMAIN_FEE}</span>
              </div>
              <p className="text-xs text-on-surface-variant">Domain registration, DNS setup, and SSL certificate installation. You can choose to add this later at Final Delivery.</p>
            </div>
          </label>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-bold">
            {errorMsg}
          </div>
        )}

        <div className="pt-6 border-t border-outline-variant/10 flex justify-between items-center">
          <span className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Amount Due Now</span>
          <span className="text-3xl font-black text-white">${finalCharge.toLocaleString()}</span>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full mt-4 py-5 rounded-full bg-white text-black font-black tracking-widest uppercase text-xs hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex justify-center items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Pay ${finalCharge.toLocaleString()} <Lock className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, ShieldCheck, PhoneCall, Radio } from "lucide-react";
import { EmergencyPayload } from "../types";

interface EmergencyTakeoverProps {
  emergency: EmergencyPayload;
  onResolve: () => void;
}

export default function EmergencyTakeover({ emergency, onResolve }: EmergencyTakeoverProps) {
  const [countdown, setCountdown] = useState(10);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (countdown > 0 && !sent) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !sent) {
      setSent(true);
    }
  }, [countdown, sent]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-red-950/95 backdrop-blur-2xl flex flex-col p-6 text-white overflow-hidden"
    >
      {/* Background Pulse */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(239,68,68,0.2)_0%,transparent_70%)] animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(239,68,68,0.8)]">
            <AlertCircle size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter uppercase italic">Safety Protocol</h1>
            <p className="text-red-400 font-sans text-xs uppercase tracking-widest font-bold">Automatic Protocol Active</p>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="p-6 bg-white/10 border border-white/20 rounded-3xl">
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-300 mb-2">Crash Force</h2>
            <div className="text-5xl font-mono tracking-tighter font-bold">12.4G</div>
            <p className="text-xs text-red-200 mt-2 font-mono uppercase tracking-tighter">Location: {emergency.coordinates.join(', ')}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Emergency Dispatch</span>
              {sent ? (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                  <Radio size={14} className="animate-pulse" /> HELP REQUEST SENT
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-400">WAITING FOR RESPONSE...</span>
              )}
            </div>
            
            <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: `${(countdown / 10) * 100}%` }}
                className="h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
              />
            </div>
            
            {!sent && (
              <p className="text-center font-mono text-4xl font-bold tracking-tighter">{countdown}s</p>
            )}
          </div>

          <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-slate-400">
               <PhoneCall size={14} />
               <span className="text-[10px] font-bold uppercase tracking-widest">Live Dispatcher Line</span>
            </div>
            <p className="text-xs italic text-slate-300 leading-relaxed font-serif">
              "{emergency.dispatch_details}"
            </p>
          </div>
        </div>

        <div className="mt-auto space-y-3 pb-8">
          <button
            onClick={onResolve}
            className="w-full h-16 bg-white text-red-600 rounded-2xl font-bold uppercase tracking-widest text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95 transition-transform"
          >
            I AM OKAY
          </button>
          <button
            className="w-full h-16 bg-red-600/20 border border-red-500 text-white rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <Radio size={20} className="animate-pulse" />
            SEND HELP NOW
          </button>
        </div>
      </div>
    </motion.div>
  );
}

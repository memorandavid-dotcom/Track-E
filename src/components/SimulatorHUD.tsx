import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Zap, ShieldAlert, Cpu, Radio, Network, WifiOff, FileJson } from "lucide-react";

interface SimulatorHUDProps {
  onImpact: (gForce: number) => void;
  onVisual: (base64: string) => void;
  onDeadReckoning: (heading: string, velocity: number, time: number) => void;
}

export default function SimulatorHUD({ onImpact, onVisual, onDeadReckoning }: SimulatorHUDProps) {
  const [showSim, setShowSim] = useState(false);
  const [logs, setLogs] = useState<string[]>(["SYSTEM READY", "V2X_SYNC_ESTABLISHED"]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${msg}`]);
  };

  return (
    <div className="absolute right-6 top-6 z-[60] flex flex-col items-end gap-2">
      <button
        onClick={() => {
          setShowSim(!showSim);
          if (!showSim) addLog("ACCESSING_LOG_CONSOLE");
        }}
        className={`p-4 rounded-xl border backdrop-blur-md transition-all duration-300 flex items-center gap-2 ${
          showSim 
            ? 'bg-blue-600/90 border-blue-400 text-white shadow-[0_0_30px_rgba(59,130,246,0.6)]' 
            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
        }`}
      >
        <Terminal size={20} />
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] font-mono">Debug Console</span>
      </button>

      <AnimatePresence>
        {showSim && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="w-72 glass-panel p-6 shadow-2xl space-y-6 overflow-hidden border-blue-500/30"
          >
            {/* Real-time Diagnostics Feed */}
            <div className="bg-slate-950 p-3 rounded-lg border border-blue-500/20 font-mono text-[9px] text-blue-400 space-y-1">
               {logs.map((log, idx) => (
                 <div key={idx} className="flex gap-2">
                    <span className="opacity-40">➔</span> {log}
                 </div>
               ))}
               <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-1.5 h-3 bg-blue-500 ml-1 translate-y-0.5" />
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
                <Network size={12} /> Inject Events
              </h3>
              
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    addLog("EVENT: IMPACT_DETECTION_TRIGGER");
                    onImpact(12.4);
                  }}
                  className="w-full flex items-center gap-3 p-3 bg-red-600/10 border border-red-500/20 rounded-xl hover:bg-red-600/20 transition-all group"
                >
                  <Zap size={16} className="text-red-500 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-white uppercase">Crash Test</div>
                    <div className="text-[8px] text-red-300 opacity-60">High impact force</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    addLog("EVENT: GPS_SIGNAL_DEGRADATION");
                    onDeadReckoning("NE", 60, 2);
                  }}
                  className="w-full flex items-center gap-3 p-3 bg-amber-600/10 border border-amber-500/20 rounded-xl hover:bg-amber-600/20 transition-all group"
                >
                  <WifiOff size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-white uppercase">Signal Loss</div>
                    <div className="text-[8px] text-amber-300 opacity-60">Offline movement tracking</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    addLog("EVENT: RADAR_ANALYTICS_QUERY");
                    // Mock base64 for hazard simulation
                    onVisual("dummy-base64");
                  }}
                  className="w-full flex items-center gap-3 p-3 bg-emerald-600/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-600/20 transition-all group"
                >
                  <ShieldAlert size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-white uppercase">Road Scan</div>
                    <div className="text-[8px] text-emerald-300 opacity-60">Check for obstructions</div>
                  </div>
                </button>
              </div>

              <div className="pt-4 space-y-2">
                <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
                  <Cpu size={12} /> Console Tools
                </h3>
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={() => addLog("PROTO: DUMP_JSON_STATE")} className="flex items-center justify-center p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                      <FileJson size={14} className="text-blue-400" />
                   </button>
                   <button onClick={() => setLogs(["SYSTEM RESET", "READY"])} className="flex items-center justify-center p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                      <Radio size={14} className="text-white opacity-40" />
                   </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
               <span className="text-[8px] font-mono text-slate-500">KERNEL_HASH: 7F2A...</span>
               <span className="text-[8px] font-mono text-emerald-500">ENCRYPTED_LINK_UP</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

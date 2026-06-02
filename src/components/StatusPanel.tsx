import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Zap, ShieldCheck, MapPin, Cpu, Globe, Database } from "lucide-react";
import { RouteSuggestion, EmergencyPayload, TrafficPrediction, RoadAnalysis } from "../types";
import PredictiveFluxSlider from "./PredictiveFluxSlider";
import { useState } from "react";

interface StatusPanelProps {
  route?: RouteSuggestion;
  traffic?: TrafficPrediction;
  emergency?: EmergencyPayload;
  roadAnalysis?: RoadAnalysis;
}

export default function StatusPanel({ route, traffic, emergency, roadAnalysis }: StatusPanelProps) {
  const [timeOffset, setTimeOffset] = useState(0);

  return (
    <div className="flex flex-col gap-6 overflow-y-auto pb-10">
      <AnimatePresence mode="popLayout">
        {roadAnalysis && (
          <motion.div
             key="road-analysis"
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="glass-card p-5 border-l-4 border-l-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="uppercase font-bold tracking-widest text-[10px] text-slate-500">Hazard Detection</h3>
                <p className="text-[10px] font-mono text-blue-300">LIVE_SCAN_ACTIVE</p>
              </div>
            </div>
            <div className="text-base text-white font-medium leading-tight mb-2">
               {roadAnalysis.hazardDetected ? `⚠ ${roadAnalysis.hazardType?.toUpperCase()}: ${roadAnalysis.suggestedAction}` : roadAnalysis.suggestedAction}
            </div>
          </motion.div>
        )}

        {traffic && (
          <motion.div
             key="traffic"
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="glass-card p-5 space-y-4"
          >
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                   <h3 className="uppercase font-bold tracking-widest text-[10px] text-slate-500">Traffic Forecast</h3>
                </div>
                <span className="text-[10px] font-mono text-blue-400 font-bold">Accuracy: 89%</span>
             </div>

             <div className="text-xl text-slate-100 font-bold tracking-tight italic">
                {traffic.riskProbability > 0.6 ? `⚠ Heavy Traffic: ${traffic.optimalDepartureWindow}` : 'Smooth Traffic Predicted'}
             </div>
             
             <PredictiveFluxSlider timeOffset={timeOffset} onTimeChange={(v) => setTimeOffset(v)} />
             
             <div className="p-3 bg-white/5 rounded-xl flex justify-between border border-white/5">
                <div className="flex items-center gap-2">
                   <Globe size={12} className="text-slate-500" />
                   <span className="text-[9px] font-bold uppercase text-slate-500 tracking-widest">Data Source</span>
                </div>
                <span className="text-[9px] font-mono text-white">Live Road Sensor V4</span>
             </div>
          </motion.div>
        )}

        {route && (
          <motion.div
            key="route"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel p-6 flex flex-col font-sans"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-emerald-400" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Journey Details</h2>
              </div>
              <div className="text-[8px] bg-emerald-500/20 px-2 py-0.5 rounded-full text-emerald-400 border border-emerald-500/30 font-bold uppercase">SECURE_ACTIVE</div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
               <div className="space-y-1">
                  <p className="text-[8px] uppercase font-bold text-slate-500 tracking-widest">Safety Rating</p>
                  <p className="text-3xl font-bold tracking-tighter text-white font-mono">{route.json.safety_index}<span className="text-sm opacity-30">/10</span></p>
               </div>
               <div className="space-y-1">
                  <p className="text-[8px] uppercase font-bold text-slate-500 tracking-widest">Smart Sensors</p>
                  <p className="text-3xl font-bold tracking-tighter text-blue-400 font-mono">{route.json.node_count}</p>
               </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 font-sans">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Suggested Speed</span>
                    <span className="text-xs text-white font-bold">{route.json.optimal_speed}</span>
                 </div>
                 <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                 </div>
              </div>
              
              <div className="flex gap-3 items-start p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
                <ShieldCheck size={18} className="shrink-0 text-blue-400" />
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-blue-400 tracking-widest block underline">Travel Advice</span>
                  <p className="text-xs font-sans text-slate-200 leading-relaxed font-medium">
                    {route.advice}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { motion } from "motion/react";
import { Navigation, Shield, AlertTriangle, Truck, Bike } from "lucide-react";
import { VehicleType } from "../types";

interface ControlPanelProps {
  origin: string;
  destination: string;
  vehicle: VehicleType;
  onOriginChange: (val: string) => void;
  onDestinationChange: (val: string) => void;
  onVehicleChange: (val: VehicleType) => void;
  onGetRoute: () => void;
  loading: boolean;
}

export default function ControlPanel({
  origin,
  destination,
  vehicle,
  onOriginChange,
  onDestinationChange,
  onVehicleChange,
  onGetRoute,
  loading
}: ControlPanelProps) {
  return (
    <div className="flex flex-col gap-8 p-6 h-full">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">Journey Origin</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => onOriginChange(e.target.value)}
            className="w-full h-14 glass-input text-base"
            placeholder="Search Starting Point..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
            className="w-full h-14 glass-input text-base"
            placeholder="Search Destination..."
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">Travel Mode</label>
          <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => onVehicleChange('motorbike')}
              className={`min-w-[48%] h-16 glass-button flex flex-col items-center justify-center gap-1 ${
                vehicle === 'motorbike' ? 'bg-blue-600/30 border-blue-500/50 text-blue-300 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10' : ''
              }`}
            >
              <Bike size={24} />
              <span className="text-[10px] font-bold">Motorbike</span>
            </button>
            <button
              onClick={() => onVehicleChange('car')}
              className={`min-w-[48%] h-16 glass-button flex flex-col items-center justify-center gap-1 ${
                vehicle === 'car' ? 'bg-blue-600/30 border-blue-500/50 text-blue-300 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10' : ''
              }`}
            >
              <Truck size={24} />
              <span className="text-[10px] font-bold">Car</span>
            </button>
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={onGetRoute}
        className="glass-button-primary w-full h-16 disabled:opacity-50 mt-4 flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.4)]"
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Navigation size={24} />
          </motion.div>
        ) : (
          <>
            <Navigation size={20} />
            <span className="text-base tracking-[0.2em]">Find Best Route</span>
          </>
        )}
      </button>

      <div className="mt-auto grid grid-cols-2 gap-4 pb-12">
         <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
            <div className="text-[9px] text-slate-500 uppercase mb-1 font-bold">Network Connectivity</div>
            <div className="text-xl font-mono text-emerald-400 font-bold tracking-tighter">142 <span className="text-[10px] text-slate-500 opacity-50 uppercase">Live Points</span></div>
         </div>
         <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
            <div className="text-[9px] text-slate-500 uppercase mb-1 font-bold">Response Time</div>
            <div className="text-xl font-mono text-blue-400 font-bold tracking-tighter">24 <span className="text-[10px] text-slate-500 opacity-50 uppercase">ms</span></div>
         </div>
      </div>
    </div>
  );
}

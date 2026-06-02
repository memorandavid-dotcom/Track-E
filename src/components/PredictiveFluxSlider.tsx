import { motion } from "motion/react";

interface PredictiveFluxSliderProps {
  timeOffset: number;
  onTimeChange: (val: number) => void;
}

export default function PredictiveFluxSlider({ timeOffset, onTimeChange }: PredictiveFluxSliderProps) {
  // Mock conversion function for demo
  const getFormatTime = (offset: number) => {
    const start = 17 * 60 + 30; // 5:30 PM
    const current = start + offset;
    const hours = Math.floor(current / 60);
    const mins = current % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="space-y-3 p-4 bg-white/5 rounded-2xl border border-white/10">
      <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-widest text-slate-500">
        <span>Temporal Projection</span>
        <span className="text-blue-400 font-mono">{getFormatTime(timeOffset)}</span>
      </div>
      
      <div className="relative h-6 flex items-center">
        <input
          type="range"
          min="0"
          max="120"
          step="15"
          value={timeOffset}
          onChange={(e) => onTimeChange(parseInt(e.target.value))}
          className="w-full h-1 bg-white/10 rounded-full appearance-none outline-none cursor-pointer accent-blue-500"
        />
        {/* Tick marks */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between pointer-events-none px-0.5">
           {[0, 30, 60, 90, 120].map((tick) => (
             <div key={tick} className="w-1 h-1 rounded-full bg-white/20" />
           ))}
        </div>
      </div>
      
      <div className="flex justify-between text-[8px] font-mono opacity-40 uppercase">
        <span>NOW</span>
        <span>+2H</span>
      </div>
    </div>
  );
}

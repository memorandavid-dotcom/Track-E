import { motion, AnimatePresence } from "motion/react";
import { X, User, Settings, Shield, Cpu, Database, Bell, Lock } from "lucide-react";
import { useState } from "react";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

type Tab = "profile" | "settings" | "security";

export default function ProfileSettingsModal({ isOpen, onClose, userEmail }: ProfileSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">T</div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight uppercase italic">Track-E Profile</h2>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">User Authorized Access</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation - Horizontal dragging and hidden scrollbar for mobile */}
          <div className="flex px-6 pt-2 border-b border-white/5 overflow-x-auto no-scrollbar scroll-smooth">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${activeTab === 'profile' ? 'text-blue-400 border-blue-400' : 'text-slate-500 border-transparent'}`}
            >
              <User size={14} /> Profile
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${activeTab === 'settings' ? 'text-blue-400 border-blue-400' : 'text-slate-500 border-transparent'}`}
            >
              <Settings size={14} /> Preferences
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${activeTab === 'security' ? 'text-blue-400 border-blue-400' : 'text-slate-500 border-transparent'}`}
            >
              <Shield size={14} /> Security
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-8 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl text-white font-bold shadow-xl">
                      {userEmail?.[0].toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Authenticated User</p>
                      <h3 className="text-lg font-bold text-white tracking-tight">{userEmail || 'Guest User'}</h3>
                      <p className="text-[10px] text-emerald-400 font-mono mt-1">● ACCOUNT: ACTIVE</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                      <p className="text-[9px] text-slate-500 uppercase font-bold">Journeys Completed</p>
                      <p className="text-2xl font-mono text-white font-bold">142</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                      <p className="text-[9px] text-slate-500 uppercase font-bold">Safety Score Avg</p>
                      <p className="text-2xl font-mono text-emerald-400 font-bold">9.4/10</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h3 className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-4">Core Preferences</h3>
                    
                    {[
                      { icon: <Bell size={18} />, label: "Push Notifications", status: "On", active: true },
                      { icon: <Cpu size={18} />, label: "Smart Connectivity", status: "Active", active: true },
                      { icon: <Database size={18} />, label: "Offloaded Data", status: "2.4 GB", active: false },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="text-slate-400 group-hover:text-blue-400 transition-colors">{item.icon}</div>
                          <span className="text-sm font-medium text-slate-200">{item.label}</span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold uppercase ${item.active ? 'text-emerald-400' : 'text-slate-500'}`}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3 text-red-400">
                      <Lock size={20} />
                      <h3 className="text-sm font-bold uppercase tracking-widest">Privacy Protocol</h3>
                    </div>
                    <p className="text-xs text-red-200/70 leading-relaxed font-serif italic">
                      "All location data is encrypted. We do not store your travel history longer than 24 hours to ensure your privacy."
                    </p>
                    <button className="w-full py-3 bg-red-600/20 border border-red-500/30 rounded-xl text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-600/30 transition-colors">
                      Clear App Data
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-950 border-t border-white/5 mt-auto">
             <p className="text-center text-[9px] text-slate-600 uppercase font-bold tracking-[0.3em]">
               End-to-End Encryption Enabled
             </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

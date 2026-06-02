import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Search, Activity, Shield, Map as MapIcon, PlusCircle } from 'lucide-react';
import ControlPanel from './components/ControlPanel';
import MapDisplay from './components/MapDisplay';
import StatusPanel from './components/StatusPanel';
import SimulatorHUD from './components/SimulatorHUD';
import EmergencyTakeover from './components/EmergencyTakeover';
import ProfileSettingsModal from './components/ProfileSettingsModal';
import { geminiService } from './services/geminiService';
import { VehicleType, RouteSuggestion, TrafficPrediction, EmergencyPayload, RoadAnalysis, MapMarker } from './types';

export default function App() {
  const [origin, setOrigin] = useState('Manila Cathedral');
  const [destination, setDestination] = useState('Mapúa University');
  const [vehicle, setVehicle] = useState<VehicleType>('motorbike');
  const [loading, setLoading] = useState(false);
  
  // Map State
  const [userPosition, setUserPosition] = useState({ lat: 14.5995, lng: 120.9842 });
  const [markers, setMarkers] = useState<MapMarker[]>([
    { id: 'v2x-1', position: { lat: 14.5990, lng: 120.9850 }, type: 'v2x', label: 'Signal Hub' },
    { id: 'station-1', position: { lat: 14.6050, lng: 120.9900 }, type: 'station', label: 'Transit Hub' },
  ]);
  
  // Mobile UI States
  const [activeTab, setActiveTab] = useState<'map' | 'transit' | 'status'>('map');
  const [isDeadReckoning, setIsDeadReckoning] = useState(false);
  const [showTakeover, setShowTakeover] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Results State
  const [route, setRoute] = useState<RouteSuggestion | undefined>();
  const [traffic, setTraffic] = useState<TrafficPrediction | undefined>();
  const [emergency, setEmergency] = useState<EmergencyPayload | undefined>();
  const [roadAnalysis, setRoadAnalysis] = useState<RoadAnalysis | undefined>();
  const [notifications, setNotifications] = useState<string[]>([]);

  // Initial proactive check
  useEffect(() => {
    const checkInitialTraffic = async () => {
      try {
        const prediction = await geminiService.predictTraffic(origin, "5:30 PM");
        setTraffic(prediction);
      } catch (err) {
        console.error("Traffic prediction error:", err);
      }
    };
    checkInitialTraffic();
  }, [origin]);

  const handleGetRoute = useCallback(async () => {
    setLoading(true);
    setRoute(undefined);
    try {
      const result = await geminiService.getRouteRecommendation(
        origin,
        destination,
        vehicle,
        "Evening peak hour, potentially raining"
      );
      setRoute(result);
      setActiveTab('map');
    } catch (err) {
      console.error("Routing error:", err);
    } finally {
      setLoading(false);
    }
  }, [origin, destination, vehicle]);

  const handleImpact = async (gForce: number) => {
    try {
      const result = await geminiService.analyzeImpact(gForce, 14.5995, 120.9842);
      setEmergency(result);
      setShowTakeover(true);
    } catch (err) {
      console.error("Impact analysis error:", err);
    }
  };

  const handleVisualAnalysis = async (base64: string) => {
    try {
      const base64Clean = base64.split(',')[1] || base64;
      const result = await geminiService.analyzeRoadImage(base64Clean);
      setRoadAnalysis(result);
      if (result.updateLocalMap) {
        setNotifications(prev => [...prev, `MAP_UPDATE: ${result.hazardType || "Block"} confirmed.`]);
        // Add marker to map
        setMarkers(prev => [
          ...prev, 
          { 
            id: `hazard-${Date.now()}`, 
            position: { ...userPosition }, 
            type: 'hazard', 
            label: result.hazardType || 'Obstruction' 
          }
        ]);
      }
    } catch (err) {
      console.error("Image analysis error:", err);
    }
  };

  const handleDeadReckoning = async (heading: string, velocity: number, time: number) => {
    setIsDeadReckoning(true);
    try {
      const result = await geminiService.deadReckoning([userPosition.lat, userPosition.lng], heading, velocity, time);
      setNotifications(prev => [...prev, `OFFLINE: Estimated position updated. Next: ${result.nextTurn}`]);
      
      // Update user position on the real map
      setUserPosition({ 
        lat: result.estimatedPosition[0], 
        lng: result.estimatedPosition[1] 
      });

      // Reset dead reckoning after 10s for demo purposes
      setTimeout(() => setIsDeadReckoning(false), 10000);
    } catch (err) {
      console.error("Signal lock error:", err);
      setIsDeadReckoning(false);
    }
  };

  const handleManualReport = () => {
    const newHazard: MapMarker = {
      id: `manual-${Date.now()}`,
      position: { lat: userPosition.lat + 0.001, lng: userPosition.lng + 0.001 },
      type: 'hazard',
      label: 'Reported Obstruction'
    };
    setMarkers(prev => [...prev, newHazard]);
    setNotifications(prev => [...prev, "SENT: Alert shared with nearby drivers."]);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#050810] text-slate-200 font-sans overflow-hidden relative">
      <AnimatePresence>
        {showTakeover && emergency && (
          <EmergencyTakeover 
            emergency={emergency} 
            onResolve={() => setShowTakeover(false)} 
          />
        )}
        {showProfile && (
          <ProfileSettingsModal 
            isOpen={showProfile} 
            onClose={() => setShowProfile(false)} 
          />
        )}
      </AnimatePresence>

      {/* Mesh Gradients */}
      <div className="mesh-gradient-1 opacity-10"></div>
      <div className="mesh-gradient-2 opacity-5"></div>

      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 glass-nav z-40 shrink-0">
        <div className="flex items-center gap-2">
          <div 
            onClick={() => setShowProfile(true)}
            className="w-7 h-7 bg-blue-500 rounded flex items-center justify-center font-bold text-white text-xs shadow-[0_0_15px_rgba(59,130,246,0.5)] cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          >
            T
          </div>
          <h1 className="text-sm font-bold tracking-tight text-white uppercase italic">Track-E</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <span className="text-[8px] font-mono uppercase tracking-widest text-emerald-400 font-bold">Active</span>
          </div>
          <Activity size={16} className="text-slate-400" />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 relative overflow-hidden z-30">
        {/* Map is always background in Mobile Look */}
        <MapDisplay 
          isDeadReckoning={isDeadReckoning} 
          userPosition={userPosition}
          markers={markers}
          onMarkerClick={(m) => setNotifications(prev => [...prev, `FOCUS: ${m.label}`])}
          trafficIntensity={traffic?.riskProbability || 0}
        />
        
        <SimulatorHUD 
          onImpact={handleImpact} 
          onVisual={handleVisualAnalysis} 
          onDeadReckoning={handleDeadReckoning} 
        />

        {/* Floating Quick Action: Report Hazard */}
        {activeTab === 'map' && (
          <button 
            onClick={handleManualReport}
            className="absolute bottom-32 right-6 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50 border-4 border-[#050810] z-40 active:scale-95 transition-transform"
          >
            <PlusCircle size={28} className="text-white" />
          </button>
        )}

        {/* Content Overlays based on Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'transit' && (
            <motion.div
              key="transit"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 top-10 glass-panel rounded-t-[40px] z-50 flex flex-col pt-2 overflow-y-auto no-scrollbar"
            >
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-4" />
              <ControlPanel 
                origin={origin}
                destination={destination}
                vehicle={vehicle}
                onOriginChange={setOrigin}
                onDestinationChange={setDestination}
                onVehicleChange={setVehicle}
                onGetRoute={handleGetRoute}
                loading={loading}
              />
            </motion.div>
          )}

          {activeTab === 'status' && (
            <motion.div
              key="status"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 top-10 glass-panel rounded-t-[40px] z-50 flex flex-col p-6 overflow-y-auto no-scrollbar"
            >
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-4 shrink-0" />
              <StatusPanel 
                route={route} 
                traffic={traffic} 
                emergency={emergency} 
                roadAnalysis={roadAnalysis} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Quick Info (Only show on Map tab) */}
        {activeTab === 'map' && route && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-24 left-6 right-6 p-4 glass-card bg-blue-600/20 border-blue-500/20 backdrop-blur-md flex items-center justify-between"
          >
             <div>
                <p className="text-[8px] uppercase font-bold text-blue-300 tracking-[0.2em]">Safety Rating</p>
                <div className="flex items-center gap-1">
                   <span className="text-xl font-mono font-bold text-white">{route.json.safety_index}/10</span>
                   <span className="text-[8px] text-blue-200 opacity-60 uppercase font-bold tracking-widest">Accuracy: {Math.round(route.json.confidence_score * 100)}%</span>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[8px] uppercase font-bold text-blue-300 tracking-[0.2em]">Estimated Arrival</p>
                <p className="text-xl font-mono font-bold text-white">{route.json.estimated_arrival}</p>
             </div>
          </motion.div>
        )}

        {/* Notifications stack (bottom) */}
        <div className="absolute bottom-20 left-6 right-6 pointer-events-none space-y-2 z-40">
          <AnimatePresence>
            {notifications.slice(-2).map((note, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 100 }}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex gap-3 items-start shadow-xl"
              >
                <Bell size={14} className="mt-0.5 shrink-0 text-blue-400" />
                <p className="text-[9px] font-mono leading-tight uppercase font-bold text-slate-300">{note}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation Bar (Mobile Tab Switcher) */}
      <footer className="h-16 bg-slate-900/95 border-t border-white/5 flex items-center justify-around z-50 shrink-0">
        <button 
          onClick={() => setActiveTab('transit')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'transit' ? 'text-blue-400' : 'text-slate-500'}`}
        >
          <Search size={20} />
          <span className="text-[8px] uppercase font-bold tracking-widest font-mono">Transit</span>
        </button>

        <button 
          onClick={() => setActiveTab('map')}
          className="relative -top-4"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-[#050810] shadow-2xl transition-all ${activeTab === 'map' ? 'bg-blue-600 scale-110 shadow-blue-500/50' : 'bg-slate-800'}`}>
             <MapIcon size={24} className="text-white" />
          </div>
        </button>

        <button 
          onClick={() => setActiveTab('status')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'status' ? 'text-blue-400' : 'text-slate-500'}`}
        >
          <Shield size={20} />
          <span className="text-[8px] uppercase font-bold tracking-widest font-mono">Safety</span>
        </button>
      </footer>
    </div>
  );
}

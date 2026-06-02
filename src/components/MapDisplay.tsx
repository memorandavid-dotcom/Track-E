import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from "motion/react";
import { MapMarker } from '../types';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapDisplayProps {
  isDeadReckoning?: boolean;
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  userPosition?: { lat: number; lng: number };
  trafficIntensity?: number;
}

// Custom component to handle view updates
function MapUpdater({ center }: { center: { lat: number, lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapDisplay({ 
  isDeadReckoning, 
  markers = [], 
  onMarkerClick, 
  userPosition,
  trafficIntensity = 0 
}: MapDisplayProps) {
  const center = userPosition || { lat: 14.5995, lng: 120.9842 };

  // Custom Icons
  const userIcon = new L.DivIcon({
    html: `<div class="relative">
             <div class="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping"></div>
             <div class="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="white" stroke-width="3" fill="none" class="transform rotate-45"><path d="M3 11l19-9-9 19-2-8-8-2z"></path></svg>
             </div>
           </div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const getMarkerIcon = (type: string) => {
    let color = 'bg-slate-500';
    let icon = '';
    
    if (type === 'hazard') {
      color = 'bg-red-500';
      icon = '!';
    } else if (type === 'v2x') {
      color = 'bg-emerald-500 animate-pulse';
      icon = 'V';
    } else if (type === 'station') {
      color = 'bg-amber-500';
      icon = 'S';
    }

    return new L.DivIcon({
      html: `<div class="${color} w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-bold text-white">
               ${icon}
             </div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const safePath: [number, number][] = [
    [14.5995, 120.9842],
    [14.6050, 120.9890],
    [14.6100, 121.0000],
  ];

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      <style>{`
        .leaflet-container {
          background: #050810 !important;
          width: 100%;
          height: 100%;
        }
        .leaflet-tile {
          filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) opacity(0.5);
        }
        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>

      <MapContainer
        center={[center.lat, center.lng]}
        zoom={15}
        zoomControl={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={center} />

        {/* User Position */}
        <Marker position={[center.lat, center.lng]} icon={userIcon} />

        {/* Other Markers */}
        {markers.map((m) => (
          <Marker 
            key={m.id} 
            position={[m.position.lat, m.position.lng]} 
            icon={getMarkerIcon(m.type)}
            eventHandlers={{
              click: () => onMarkerClick?.(m),
            }}
          >
            <Popup className="custom-popup">
              <div className="text-slate-900 p-1 min-w-[100px]">
                <h3 className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">
                  {m.type}
                </h3>
                <p className="text-xs font-bold leading-tight">{m.label}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Safe Path */}
        <Polyline 
          positions={safePath} 
          pathOptions={{ color: '#10b981', weight: 4, opacity: 0.8 }} 
        />

        {/* Traffic Intensity Circle */}
        {trafficIntensity > 0 && (
          <Circle 
            center={[center.lat, center.lng]}
            radius={800}
            pathOptions={{
              fillColor: '#ef4444',
              fillOpacity: trafficIntensity * 0.3,
              strokeWeight: 0,
            }}
          />
        )}
      </MapContainer>

      {/* Overlays */}
      <AnimatePresence>
        {isDeadReckoning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-20"
          >
             <div className="absolute inset-0 bg-amber-950/20 backdrop-blur-[1px]" />
             <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-amber-600/90 rounded-full text-white font-sans text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
                GPS SIGNAL LOST // CONNECTING OFFLINE SENSORS
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-20 left-6 z-30">
        <div className="bg-slate-900/80 backdrop-blur px-2 py-1 rounded border border-white/10 text-[9px] font-mono text-blue-400 uppercase tracking-widest">
          Map Status: Active
        </div>
      </div>
    </div>
  );
}

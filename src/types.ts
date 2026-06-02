export type VehicleType = 'motorbike' | 'car';

export interface RouteSuggestion {
  advice: string;
  safetyScore: number;
  safetyWarning?: string;
  json: {
    safety_index: number;
    vehicle: VehicleType;
    optimal_speed: string;
    estimated_arrival: string;
    confidence_score: number;
    node_count: number;
  };
}

export interface EmergencyPayload {
  severity_level: 'low' | 'medium' | 'high';
  timestamp: string;
  coordinates: [number, number];
  dispatch_details: string;
}

export interface DeadReckoningResult {
  estimatedPosition: [number, number];
  nextTurn: string;
  confidence: number;
}

export interface TrafficPrediction {
  prediction: string;
  optimalDepartureWindow: string;
  riskProbability: number;
}

export interface RoadAnalysis {
  hazardDetected: boolean;
  hazardType?: string;
  suggestedAction: string;
  updateLocalMap: boolean;
}

export interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  type: 'hazard' | 'station' | 'v2x' | 'user';
  label?: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface HazardReport {
  type: string;
  position: { lat: number; lng: number };
  timestamp: string;
}

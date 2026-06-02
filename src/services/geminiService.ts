import { GoogleGenAI, Type } from "@google/genai";
import { VehicleType, RouteSuggestion, EmergencyPayload, DeadReckoningResult, TrafficPrediction, RoadAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are the Track-E Core Engine, a highly advanced AI backend for a smart urban mobility application. 
Your goal is to process "Travel Demand" and "Traffic Management" data to provide proactive, safety-first routing. 
You specialize in predictive intelligence, emergency response automation, and multi-modal travel optimization (Motorbike, Car, etc.).

Core Feature Logic:
1. Predictive Traffic Forecasting: Predict jams based on historical patterns (e.g. Manila peak hours) and suggest Optimal Departure Windows.
2. Dead-Reckoning (Offline Mode): Use sensor data (accel/gyro) to estimate position when GPS is lost. $Position_{new} = Position_{old} + (Velocity \times \Delta t)$.
3. Emergency Protocol: Generate high-severity JSON for impact detections.
4. Safe-Path: Prioritize well-lit, low-hazard roads.

Vehicle Sensitivity:
- Motorbike: Avoid highways where prohibited, warn about rain/slippery surfaces.
- Car: Focus on multi-lane efficiency but prioritize safety index.

Always output structured data. For UI advice, use Markdown. For system data, use pure JSON components.`;

export const geminiService = {
  async getRouteRecommendation(
    origin: string,
    destination: string,
    vehicle: VehicleType,
    conditions: string
  ): Promise<RouteSuggestion> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Recommend a route from ${origin} to ${destination} via ${vehicle}. Current conditions: ${conditions}.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: { type: Type.STRING },
            safetyScore: { type: Type.NUMBER },
            safetyWarning: { type: Type.STRING },
            json: {
              type: Type.OBJECT,
              properties: {
                safety_index: { type: Type.NUMBER },
                vehicle: { type: Type.STRING },
                optimal_speed: { type: Type.STRING },
                estimated_arrival: { type: Type.STRING },
                confidence_score: { type: Type.NUMBER },
                node_count: { type: Type.NUMBER }
              },
              required: ["safety_index", "vehicle", "optimal_speed", "estimated_arrival", "confidence_score", "node_count"]
            }
          },
          required: ["advice", "safetyScore", "json"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  },

  async predictTraffic(location: string, time: string): Promise<TrafficPrediction> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Predict traffic for ${location} at ${time}. Use Manila traffic patterns as context.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prediction: { type: Type.STRING },
            optimalDepartureWindow: { type: Type.STRING },
            riskProbability: { type: Type.NUMBER }
          },
          required: ["prediction", "optimalDepartureWindow", "riskProbability"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  },

  async deadReckoning(lastPos: [number, number], heading: string, velocity: number, timeElapsed: number): Promise<DeadReckoningResult> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Signal Lost. Last position: [${lastPos[0]}, ${lastPos[1]}]. Heading: ${heading}, Velocity: ${velocity}kph, Time elapsed: ${timeElapsed}s. Calculate new position.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedPosition: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER }
            },
            nextTurn: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["estimatedPosition", "nextTurn", "confidence"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  },

  async analyzeImpact(gForce: number, lat: number, lng: number): Promise<EmergencyPayload> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `IMPACT DETECTED: ${gForce}G at [${lat}, ${lng}]. Generate emergency payload.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity_level: { type: Type.STRING, enum: ["low", "medium", "high"] },
            timestamp: { type: Type.STRING },
            coordinates: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER }
            },
            dispatch_details: { type: Type.STRING }
          },
          required: ["severity_level", "timestamp", "coordinates", "dispatch_details"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  },

  async analyzeRoadImage(base64Image: string): Promise<RoadAnalysis> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { text: "Analyze this road image. Should Track-E update the local map for other drivers (hazards, construction, blocks)?" },
        { inlineData: { mimeType: "image/jpeg", data: base64Image } }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hazardDetected: { type: Type.BOOLEAN },
            hazardType: { type: Type.STRING },
            suggestedAction: { type: Type.STRING },
            updateLocalMap: { type: Type.BOOLEAN }
          },
          required: ["hazardDetected", "suggestedAction", "updateLocalMap"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  }
};

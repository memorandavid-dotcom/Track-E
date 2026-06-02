# Track-E Smart Urban Mobility Platform

Track-E is a high-performance, mobile-first urban mobility application designed for safe, smart, and proactive city navigation. Moving away from standard navigators, Track-E combines real-time data visualizers, adaptive route forecasting, and offline tracking capabilities into a single-screen dashboard tailored for everyday drivers—no deep technical know-how required.

---

## 🌟 The Core Vision

Standard navigation systems rely completely on constant, active GPS and simple route times. Track-E goes step-by-step beyond standard navigation:
- **Proactive Safety First**: Rather than just showing the fastest path, Track-E helps you find the safest route, warning you about street conditions specific to whether you are in a car or on a motorbike.
- **Edge Resilience**: Keeps you safe even during tunnels, elevated skyways, or storm-induced GPS blackouts using offline movement estimation.
- **Community Safety Mesh**: Enables instant hazard broadcasting to dynamically assist nearby drivers and alert dispatch teams in real-time.

---

## 🚀 Key Features

### 1. Fully-Interactive Smart Map
- **Leaflet & OpenStreetMap Engine**: An adaptive, responsive map designed with a high-contrast dark theme.
- **Dynamic Assets & Markers**: Auto-updates dynamically with real-time location tags, smart traffic heat zones, travel path polyline guides, and custom warnings.
- **Tap for Focus**: Tap on signals, stations, or driver-reported hazards to focus on the information effortlessly.

### 2. Intelligent Routing Engine (Gemini-Powered)
- **Multi-Modal Optimization**: Computes tailored travel recommendations based on whether you are riding a **Motorbike** or driving a **Car**.
- **Context-Aware Analytics**: Analyzes real-time surroundings (such as weather, precipitation, and rush hours) to calculate an official **Safety Rating** (Scale 1–10) and suggested speed limits.

### 3. Traffic Forecast & Peak Travel Calculator
- **Predictive Departure Index**: Forecasts traffic congestion levels for any target location.
- **Optimal Departure Windows**: Indicates when you should start your journey to bypass upcoming peak hours and gridlocks.

### 4. Safety Protocol & Rescuers Dispatch (Emergency Mode)
- **Automatic High-G Response**: Simulates a vehicle crash event to trigger the safety dispatch protocols.
- **Emergency Dispatch Transmitters**: Prompts a rescue payload with exact GPS stamps and coordinates, giving drivers a single-tap button to request search and rescue backup.

### 5. Road Camera Scanner
- **Hazard Identifiers**: Analyzes camera/radar photos on the move to auto-confirm road obstructions.
- **Smart Map Integration**: Adds hazard pins to your local map, keeping drivers on your route well-informed.

---

## 💻 What does the Simulator HUD ("SIM_OS Debug Console") do?

For developers, testers, and fleet operations, Track-E includes an interactive **Simulator console** accessible on the top right. This feature mimics real-world automotive hardware sensors:

1. **Crash Test Emulator**: Triggers a simulated high-impact collision (at `12.4G` magnitude) to verify that the high-priority safety dispatch system opens and functions as expected.
2. **Signal Loss Event**: Emulates absolute GPS signal loss. This activates the offline tracking mode, instructing the app’s background sensors to estimate current positions based on the last known speed, heading vector, and elapsed time.
3. **Road Scan Integration**: Emulates a forward-facing camera taking a picture of a road block or hazard, scanning it to automatically create a custom map hazard warning on the interface.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript (built for speedy, modern UI components).
- **Build System**: Vite (with Hot Module Replacement).
- **Styling**: Tailwind CSS v4 (offering high-contrast layout classes and fluent media controls).
- **Map engine**: Leaflet & Leaflet-React (fluid vector layers and high-performance markers).
- **Animations**: Motion / motion/react (providing clean animations and micro-interaction transitions).
- **AI Integration**: `@google/genai` (directly powering predictive routing, offline estimations, and visual scans).

---

## 🚀 Getting Started

### 1. Declare Environment Variables
Create a `.env` file in your root folder:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Install Dependencies & Build
Run the following commands to install packages, run code checks, and compile the application:
```bash
# Install packages
npm install

# Run type check and linter
npm run lint

# Compile production-ready static assets
npm run build

# Start the dev server locally
npm run dev
```

The application will be accessible locally on your specified browser interface. Use the simplified, modern navigation panels on-screen to travel safely across the city!

import { useState, useEffect, useMemo } from "react";
import { SimulationTimer } from "./timer.jsx"; 
import { ArcticSidebar } from "./ArcticSidebar.jsx"; 

const MOCK_BOATS = [
  { id: "boat_1", name: "Patrol Boat", cost: 100, rangeNm: 100, topSpeedKnots: 20 },
  { id: "boat_2", name: "Icebreaker", cost: 500, rangeNm: 500, topSpeedKnots: 10 },
];

export default function SidebarTest() {
  // ==============================
  // 1. TIMER STATE & LOGIC
  // ==============================
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0); // Starting at 0 for a fresh simulation

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);


  // ==============================
  // 2. SIDEBAR STATE & LOGIC
  // ==============================
  const [stage, setStage] = useState("PLANNING");
  const [qty, setQty] = useState({});
  const [activeShipId, setActiveShipId] = useState(null);

  // Generate ships based on quantity selected
  const ships = useMemo(() => {
    return MOCK_BOATS.flatMap(b => 
      Array(qty[b.id] || 0).fill(null).map((_, i) => ({
        id: `${b.id}_${i}`,
        name: b.name,
        boatId: b.id,
        speedKnots: b.topSpeedKnots,
        // Mock route: We give them 2 points so they are valid for "DEPLOY" immediately
        route: [{x: 0, y: 0}, {x: 1, y: 1}], 
      }))
    );
  }, [qty]);

  // Allow Draw/Deploy logic
  const canDeploy = ships.length > 0;
  
  // Handler for the "Start" button inside the sidebar
  const handleStartSimulation = () => {
    setRunning(true);
    // Optional: You usually hide the sidebar or change views here
    console.log("Simulation started!"); 
  };


  // ==============================
  // 3. RENDER
  // ==============================
  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      
      {/* Background / Map Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <h1 className="text-white font-arame opacity-20">Map Background Placeholder</h1>
      </div>

      {/* Sidebar Component */}
      <ArcticSidebar
        boats={MOCK_BOATS}
        previousOperations={[]}
        ships={ships}

        stage={stage}
        setStage={setStage}
        qtyByBoatId={qty}
        setQtyByBoatId={setQty}
        
        costColor={() => "text-white"}
        fmtMoney={(n) => `$${n}`}

        // Multi-ship drawing props
        activeShipId={activeShipId}
        setActiveShipId={setActiveShipId}
        activeRoutePoints={0}
        
        // Navigation & State Guards
        canGoToDraw={ships.length > 0}
        canDeploy={canDeploy} 
        
        // Actions
        onGoToDraw={() => setStage("DRAW")}
        onGoToDeploy={() => setStage("DEPLOY")}
        onUndoRoute={() => console.log("Undo clicked")}
        onClearRoute={() => console.log("Clear clicked")}
        onStartSimulation={handleStartSimulation}
        onClose={() => {}}
      />

      {/* Timer Component (Fixed position handled inside the component or via absolute here) */}
      <SimulationTimer 
        seconds={time} 
        isRunning={running} 
        // Allow pausing from the timer itself
        onTogglePlay={() => setRunning(!running)} 
        onEnd={() => setRunning(false)}
      />

    </div>
  );
}
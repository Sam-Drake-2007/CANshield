import { useState, useMemo } from "react";
import { SimulationTimer } from "./timer.jsx"; 
import { ArcticSidebar } from "./ArcticSidebar.jsx"; 

const MOCK_BOATS = [
  { id: "boat_1", name: "Patrol Boat", cost: 100, rangeNm: 100, topSpeedKnots: 20 },
  { id: "boat_2", name: "Icebreaker", cost: 500, rangeNm: 500, topSpeedKnots: 10 },
];

export default function SidebarTest() {
  // ==============================
  // 1. STATE
  // ==============================
  const [running, setRunning] = useState(false);
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
        route: [{x: 0, y: 0}, {x: 1, y: 1}], 
      }))
    );
  }, [qty]);

  const canDeploy = ships.length > 0;
  
  // ==============================
  // 2. HANDLERS
  // ==============================
  const handleStartSimulation = () => {
    // This triggers the Timer component to start counting down
    setRunning(true);
    console.log("Simulation started!"); 
  };

  const handleSimulationEnd = () => {
    setRunning(false);
    console.log("Simulation ended!");
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

      {/* Timer Component */}
      {/* It will appear/start only when running becomes true */}
      <SimulationTimer 
        duration={300} // Set your desired countdown time here
        isRunning={running} 
        onEnd={handleSimulationEnd}
      />

    </div>
  );
}
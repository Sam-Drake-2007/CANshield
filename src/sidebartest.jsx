import { useState, useMemo } from "react";
// MAKE SURE THIS PATH IS CORRECT for your project structure:
import { ArcticSidebar } from "./ArcticSidebar"; 

const MOCK_BOATS = [
  { id: "boat_1", name: "Patrol Boat", cost: 100, rangeNm: 100, topSpeedKnots: 20 },
  { id: "boat_2", name: "Icebreaker", cost: 500, rangeNm: 500, topSpeedKnots: 10 },
];

export default function SidebarTest() {
  const [stage, setStage] = useState("PLANNING");
  const [qty, setQty] = useState({});

  // Minimal logic to generate "ships" so the DRAW tab doesn't crash
  const ships = useMemo(() => {
    return MOCK_BOATS.flatMap(b => 
      Array(qty[b.id] || 0).fill(null).map((_, i) => ({
        id: `${b.id}_${i}`,
        name: b.name,
        boatId: b.id,
        route: [], // empty route
      }))
    );
  }, [qty]);

  return (
    // Just a plain flat background
    <div className="w-full h-screen bg-neutral-900">
      <ArcticSidebar
        // Data
        boats={MOCK_BOATS}
        previousOperations={[]}
        ships={ships}

        // State
        stage={stage}
        setStage={setStage}
        qtyByBoatId={qty}
        setQtyByBoatId={setQty}
        
        // Formatting dummies
        costColor={() => "text-white"}
        fmtMoney={(n) => `$${n}`}

        // Interactive dummies (safe defaults)
        activeShipId={null}
        activeRoutePoints={0}
        canGoToDraw={ships.length > 0}
        canDeploy={false}
        
        // No-op event handlers
        onGoToDraw={() => setStage("DRAW")}
        onGoToDeploy={() => setStage("DEPLOY")}
        onUndoRoute={() => {}}
        onClearRoute={() => {}}
        onStartSimulation={() => {}}
        onClose={() => {}}
      />
    </div>
  );
}
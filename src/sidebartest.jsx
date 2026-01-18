import { useState, useMemo } from "react";
// MAKE SURE THIS PATH IS CORRECT:
import { ArcticSidebar } from "./ArcticSidebar"; 

const MOCK_BOATS = [
  { id: "boat_1", name: "Patrol Boat", cost: 100, rangeNm: 100, topSpeedKnots: 20 },
  { id: "boat_2", name: "Icebreaker", cost: 500, rangeNm: 500, topSpeedKnots: 10 },
];

export default function SidebarTest() {
  const [stage, setStage] = useState("PLANNING");
  const [qty, setQty] = useState({});

  // Logic to generate ships with PRE-FILLED routes
  const ships = useMemo(() => {
    return MOCK_BOATS.flatMap(b => 
      Array(qty[b.id] || 0).fill(null).map((_, i) => ({
        id: `${b.id}_${i}`,
        name: b.name,
        boatId: b.id,
        speedKnots: b.topSpeedKnots,
        // We fake a route so the sidebar thinks we drew it
        route: [{x: 0, y: 0}, {x: 1, y: 1}], 
      }))
    );
  }, [qty]);

  // We allow deploy if there is at least 1 ship
  const canDeploy = ships.length > 0;

  return (
    <div className="w-full h-screen bg-neutral-900">
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

        activeShipId={null}
        activeRoutePoints={0}
        
        // Force these to true so you can click the buttons
        canGoToDraw={ships.length > 0}
        canDeploy={canDeploy} 
        
        onGoToDraw={() => setStage("DRAW")}
        onGoToDeploy={() => setStage("DEPLOY")}
        
        onUndoRoute={() => {}}
        onClearRoute={() => {}}
        onStartSimulation={() => alert("Simulation Started!")}
        onClose={() => {}}
      />
    </div>
  );
}
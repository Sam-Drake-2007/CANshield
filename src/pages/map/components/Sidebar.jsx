import { useMemo } from "react";

function QtyStepper({ value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={disabled || value <= 0}
        onClick={() => onChange(value - 1)}
        className="h-8 w-8 font-arame ring-2 ring-white/25 duration-500 bg-b1/60 text-white/80 hover:bg-r2/25 hover:ring-r hover:cursor-pointer hover:duration-500 hover:text-r"
      >
        –
      </button>
      <div className="w-8 text-center text-white/90 font-semibold">{value}</div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(value + 1)}
        className="h-8 w-8 font-arame ring-2 ring-white/25 duration-500 bg-b1/60 text-white/80 hover:bg-r2/25 hover:ring-r hover:cursor-pointer hover:duration-500 hover:text-r"
      >
        +
      </button>
    </div>
  );
}

export function Sidebar({
  boats,
  previousOperations,

  stage,
  setStage,

  qtyByBoatId,
  setQtyByBoatId,

  selectedPresetId,
  setSelectedPresetId,

  costColor,
  fmtMoney,

  // multi-ship drawing
  ships = [],
  activeShipId,
  setActiveShipId,
  activeRoutePoints = 0,
  canGoToDraw,
  canDeploy,
  onGoToDraw,
  onGoToDeploy,
  onUndoRoute,
  onClearRoute,
  onStartSimulation,

  onClose,
}) {
  const isPlanning = stage === "PLANNING";
  const isDraw = stage === "DRAW";
  const isDeploy = stage === "DEPLOY";

  const totalShipsPlanned = useMemo(() => {
    return boats.reduce((acc, b) => acc + (qtyByBoatId[b.id] || 0), 0);
  }, [boats, qtyByBoatId]);

  const totalCost = useMemo(() => {
    return boats.reduce((acc, b) => acc + (qtyByBoatId[b.id] || 0) * b.cost, 0);
  }, [boats, qtyByBoatId]);

  const estimatedCoverage = useMemo(() => {
    const score = boats.reduce((acc, b) => {
      const qty = qtyByBoatId[b.id] || 0;
      const perShip = b.rangeNm * 0.008 + b.topSpeedKnots * 1.2;
      return acc + perShip * qty;
    }, 0);
    return Math.max(0, Math.min(100, score));
  }, [boats, qtyByBoatId]);

  const updateQty = (boatId, next) => {
    setQtyByBoatId((prev) => ({ ...prev, [boatId]: Math.max(0, next) }));
  };

  const resetFleet = () => {
    setSelectedPresetId?.(null);
    setQtyByBoatId(Object.fromEntries(boats.map((b) => [b.id, 0])));
  };

  const applyOperationPreset = (op) => {
    setStage("PLANNING");
    setSelectedPresetId(op.id);

    const next = Object.fromEntries(boats.map((b) => [b.id, 0]));
    for (const s of op.ships) {
      if (next[s.boatId] !== undefined) next[s.boatId] = s.quantity;
    }
    setQtyByBoatId(next);
  };

  const allShipsRouted = useMemo(() => {
    if (!ships.length) return false;
    return ships.every((s) => (s.route?.length ?? 0) >= 2);
  }, [ships]);

  const activeShip = useMemo(
    () => ships.find((s) => s.id === activeShipId) ?? null,
    [ships, activeShipId]
  );

return (
  <div className="absolute left-4 top-4 bottom-4 z-[1000] w-[360px] max-w-[92vw]">
    <div className="h-full bg-black/50 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col">
      
      <div className="flex items-start justify-between gap-3 p-4"> 
        
        <div>
          <div className="text-white/80 font-arame text-lg leading-wide">CANshield</div>
          <div className="mt-2 text-white/60 font-arame text-xs">
            MAP: Arctic Corridor
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 ring-2 ring-white/25 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setStage("PLANNING")}
                  className={`px-3 py-1.5 text-xs font-arame  transition ${
                    stage === "PLANNING"
                      ? "bg-white/80 text-b"
                      : "text-white/80 hover:bg-white/5"
                  }`}
                >
                  PLANNING
              </button>

              <button
                  type="button"
                  disabled={!canGoToDraw}
                  onClick={onGoToDraw}
                  className={`px-3 py-1.5 text-xs font-arame transition ${
                    stage === "DRAW"
                      ? "bg-white/80 text-b"
                      : "text-white/80 hover:bg-white/5 disabled:opacity-40"
                  }`}
                  title={!canGoToDraw ? "Pick at least 1 ship first" : ""}
                >
                  DRAW
              </button>

              <button
                  type="button"
                  disabled={!canDeploy}
                  onClick={onGoToDeploy}
                  className={`px-3 py-1.5 text-xs font-arame transition ${
                    stage === "DEPLOY"
                      ? "bg-white/80 text-b"
                      : "text-white/80 hover:bg-white/5 disabled:opacity-40"
                  }`}
                  title={!canDeploy ? "Every ship needs a 2+ point route" : ""}
                >
                  DEPLOY
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* ===== DRAW ===== */}
          {isDraw && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-white/80 font-arame">Draw routes</div>
                <div className="text-xs font-arame text-white/60">
                  {allShipsRouted ? "All routed ✓" : "All ships must be routed"}
                </div>
              </div>

              <div className="text-xs font-arame text-white/60 leading-wide">
                Select a ship, then click on the map to add points. Land clicks are ignored.
              </div>

              <div className=" ring-2 ring-white/25 bg-white/5 overflow-hidden">
                <div className="px-3 py-2 ring-2 ring-white/25 text-xs font-arame text-white/80">
                  Deployed ships
                </div>
                <div className="divide-y divide-white/10">
                  {ships.map((s, idx) => {
                    const active = s.id === activeShipId;
                    const ok = (s.route?.length ?? 0) >= 2;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveShipId?.(s.id)}
                        className={[
                          "w-full text-left px-3 py-2 transition",
                          active ? "bg-white/5" : "hover:bg-white/10",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-sm text-white/80 font-arame truncate">
                              {s.name} #{idx + 1}
                            </div>
                            <div className="mt-0.5 text-xs font-arame text-white/60">
                              Route:{" "}
                              <span className={ok ? "text-white/80" : "text-r2"}>
                                {s.route?.length ?? 0} pts
                              </span>
                            </div>
                          </div>
                          <div className="text-xs font-arame text-white/60 whitespace-nowrap">
                            {s.speedKnots} kn
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onUndoRoute}
                  disabled={!activeShip || activeRoutePoints === 0}
                className="ring-2 ring-white/25 duration-500 bg-b1/60 px-3 py-2 text-xs font-arame text-white/80 disabled:opacity-40
      enabled:hover:bg-r2/25 enabled:hover:ring-r enabled:hover:cursor-pointer enabled:hover:duration-500 enabled:hover:text-r"
                >
                  Undo
                </button>
                <button
                  type="button"
                  onClick={onClearRoute}
                  disabled={!activeShip || activeRoutePoints === 0}
                  className="ring-2 ring-white/25 duration-500 bg-b1/60 px-3 py-2 text-xs font-arame text-white/80 disabled:opacity-40
      enabled:hover:bg-r2/25 enabled:hover:ring-r enabled:hover:cursor-pointer enabled:hover:duration-500 enabled:hover:text-r"
                >
                  Clear
                </button>
              </div>

              <div className="text-xs text-white/60 font-arame">
                DEPLOY unlocks when <span className="text-white/80 font-arame">every ship</span> has{" "}
                <span className="text-white/80 font-arame">2+ points</span>.
              </div>
            </div>
          )}

          {/* ===== DEPLOY ===== */}
          {isDeploy && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-white/80 font-arame">Deployment summary</div>
                <div className="text-xs font-arame text-white/60">Routes locked</div>
              </div>

              <div className="ring-2 font-arame ring-white/25 bg-b1/40 p-3">
                <div className="text-xs text-white/60">Ships</div>
                <div className="mt-1 text-white/80 font-arame text-lg">{ships.length}</div>

                <div className="mt-3 text-xs text-white/60">Routing status</div>
                <div className="mt-1 text-white/80">
                  {allShipsRouted ? "All ships have valid routes ✓" : "Missing routes (should be impossible here)"}
                </div>
              </div>

              <button
                type="button"
                onClick={onStartSimulation}
                disabled={!allShipsRouted || ships.length === 0}
                className="w-full px-4 py-2 bg-b1/60 text-white/80 ring-2 ring-white/25 duration-500 font-arame text-sm 
                hover:bg-r2/25 hover:ring-r hover:cursor-pointer hover:duration-500 hover:text-r disabled:opacity-40"
              >
                Start
              </button>

              <div className="text-xs font-arame text-white/60">
                Starting hides the sidebar and begins the timer.
              </div>
            </div>
          )}

          {/* ===== PLANNING (default) ===== */}
          {isPlanning && (
            <>
              {/* Fleet */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white/80 font-arame">Fleet</div>
                  <button
                    type="button"
                    onClick={resetFleet}
                    className="text-xs font-arame text-white/80 duration-300 hover:text-r hover:cursor-pointer hover:underline"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-4">
                  {boats.map((b) => {
                    const qty = qtyByBoatId[b.id] || 0;
                    const subtotal = qty * b.cost;

                    return (
                      <div key={b.id} className="ring-2 ring-white/25 bg-b1/40 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div
                              className="text-white/80 font-arame leading-tight truncate"
                              title={b.name}
                            >
                              {b.name}
                            </div>

                            <div className="my-2 text-[0.6rem] font-arame text-white/60">
                              <span className="mr-3">Speed: {b.topSpeedKnots} kn</span>
                              <span>Range: {b.rangeNm} nm</span>
                            </div>

                            <div className="mt-1 flex items-center justify-between gap-3 text-sm font-arame text-white/80">
                              <div className="whitespace-nowrap shrink-0">{fmtMoney(b.cost)} each</div>

                              <div className="whitespace-nowrap shrink-0 text-white/60">
                                Subtotal:{" "}
                                <span className="text-white/80 font-arame">
                                  {fmtMoney(subtotal)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <QtyStepper
                              value={qty}
                              onChange={(n) => updateQty(b.id, n)}
                              disabled={false}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className=" ring-2 ring-white/25 bg-b1/40 p-3">
                    <div className="text-xs text-white/60">Ships planned</div>
                    <div className="text-white/80 font-arame text-lg">{totalShipsPlanned}</div>
                  </div>
                  <div className="ring-2 ring-white/25 bg-b1/40 p-3">
                    <div className="text-xs text-white/60">Est. coverage</div>
                    <div className="text-white/80 font-arame text-lg">
                      {estimatedCoverage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Previous Operations */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white/80 font-arame">Previous Operations</div>
                  <div className="text-xs text-white/60">
                    loads <span className="text-white/80 font-arame">fleet preset</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {previousOperations.map((op) => {
                    const active = op.id === selectedPresetId;

                    return (
                      <button
                        key={op.id}
                        type="button"
                        onClick={() => applyOperationPreset(op)}
                        className={[
                          "w-full text-left ring-2 p-3 transition",
                          active
                            ? "bg-white/80 text-b"
                            : "text-white/80 hover:bg-white/5",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-white/60">{op.createdAt}</div>
                          <div className={`text-sm font-arame ${costColor(op.totalCost)}`}>
                            {fmtMoney(op.totalCost)}
                          </div>
                        </div>

                        <div className="mt-1 flex items-center justify-between">
                          <div className="text-xs text-white/60">
                            Coverage:{" "}
                            <span className="text-white/80 font-arame">
                              {op.avgCoveragePercent}%
                            </span>
                          </div>
                          <div className="text-xs text-white/60">
                            Fleet:{" "}
                            <span className="text-white/80 font-arame">
                              {op.ships.map((s) => `${s.quantity}×${s.boatId}`).join("  ·  ")}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 font-arame border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-white/60">Total cost</div>
              <div className={` text-xl ${costColor(totalCost)}`}>
                {fmtMoney(totalCost)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {stage === "PLANNING" ? (
                <button
                  type="button"
                  disabled={!canGoToDraw}
                  onClick={onGoToDraw}
                  className="px-4 py-2 bg-b1/60 text-white/80
                    ring-2 ring-white/25 duration-500 font-arame text-sm
                  hover:bg-r2/25 hover:ring-r hover:cursor-pointer hover:duration-500 hover:text-r disabled:opacity-40"
                >
                  Continue to Draw
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStage("PLANNING")}
                  className="px-4 py-2 bg-b1/60 text-white/80
                    ring-2 ring-white/25 duration-500 font-arame text-sm
                  hover:bg-r2/25 hover:ring-r hover:cursor-pointer hover:duration-500 hover:text-r"
                >
                  Back to Planning
                </button>
              )}
            </div>
          </div>

          <div className="mt-2 text-xs font-amare text-white/60">
            {stage === "PLANNING" && "Pick a fleet, then draw a route for each ship."}
            {stage === "DRAW" && "Select each ship and draw its patrol route."}
            {stage === "DEPLOY" && "Review summary, then start simulation."}
          </div>
        </div>
      </div>
    </div>
  );
}

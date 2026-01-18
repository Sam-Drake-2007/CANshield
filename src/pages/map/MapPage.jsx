import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Circle,
  Marker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo, useState, useEffect, useCallback } from "react";

import { Sidebar } from "./components/Sidebar.jsx";
import { SimulationTimer } from "./timer.jsx";

import { ISLAND_OUTLINES } from "../../utils/islandOutlines.js";
import loadArcticWaterMask from "../../services/loadArcticWaterMask.js";

import { RouteDrawingLayer } from "./components/RouteDrawingLayer.jsx";

import { useMultiShipSimulation } from "../../hooks/useMultiShipSimulation.js";
import { useCoverageTracker } from "../../hooks/useCoverageTracker.js";

import {
  GRID_ROWS,
  GRID_COLS,
  DEMO_DURATION_MS,
  DEMO_TIME_SCALE,
  STAGES,
  DASHED_ROUTE_STYLE,
  DRAW_STYLE,
  SEA_STYLE,
  BOAT_ICONS,
  shortShipLabel,
  costColor,
  fmtMoney,
} from "./Map.utils.js";

// ✅ Keep these here (or move into a map.data.js later)
export const ARCTIC_BOUNDS = [
  [73.87565, -104.19434], // SW
  [76.49101, -87.63794], // NE
];

// ✅ Use your real boats (you can move these into Map.data.js too)
export const BOATS = [
  {
    id: "halifax",
    name: "Halifax-class Frigate",
    cost: 450000,
    topSpeedKnots: 45,
    rangeNm: 9500,
    coverageRadiusM: 20000,
  },
  {
    id: "dewolf",
    name: "Harry DeWolf-class Patrol Vessel",
    cost: 250000,
    topSpeedKnots: 30,
    rangeNm: 6800,
    coverageRadiusM: 12000,
  },
  {
    id: "kingston",
    name: "Kingston-class Coastal Defence Vessel",
    cost: 150000,
    topSpeedKnots: 28,
    rangeNm: 5000,
    coverageRadiusM: 8000,
  },
];

// Optional: used in sidebar "Previous Operations"
export const PREVIOUS_OPERATIONS = [
  {
    id: "op_103",
    createdAt: "2026-01-15",
    ships: [
      { boatId: "halifax", quantity: 1 },
      { boatId: "dewolf", quantity: 2 },
    ],
    totalCost: 950000,
    avgCoveragePercent: 83.9,
  },
  {
    id: "op_102",
    createdAt: "2026-01-13",
    ships: [{ boatId: "halifax", quantity: 2 }],
    totalCost: 900000,
    avgCoveragePercent: 71.2,
  },
  {
    id: "op_101",
    createdAt: "2026-01-12",
    ships: [{ boatId: "halifax", quantity: 1 }],
    totalCost: 450000,
    avgCoveragePercent: 38.6,
  },
];

export default function MapPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stage, setStage] = useState(STAGES.PLANNING);

  const isDraw = stage === STAGES.DRAW;
  const isDeploy = stage === STAGES.DEPLOY;
  const isRunning = stage === STAGES.RUNNING;
  const isResults = stage === STAGES.RESULTS;

  const [timerRunning, setTimerRunning] = useState(false);
  const [maskObj, setMaskObj] = useState(null);

  useEffect(() => {
    (async () => {
      const m = await loadArcticWaterMask({
        bounds: ARCTIC_BOUNDS,
        rows: GRID_ROWS,
        cols: GRID_COLS,
      });
      setMaskObj(m);
    })();
  }, []);

  // =========================
  // Fleet config
  const [qtyByBoatId, setQtyByBoatId] = useState(() =>
    Object.fromEntries(BOATS.map((b) => [b.id, 0]))
  );
  const [selectedPresetId, setSelectedPresetId] = useState(null);

  // Ship instances (created once you go to DRAW)
  const [ships, setShips] = useState([]);
  const [activeShipId, setActiveShipId] = useState(null);

  const totalShips = useMemo(() => {
    return BOATS.reduce((acc, b) => acc + (qtyByBoatId[b.id] || 0), 0);
  }, [qtyByBoatId]);

  const totalCost = useMemo(() => {
    return BOATS.reduce((acc, b) => acc + (qtyByBoatId[b.id] || 0) * b.cost, 0);
  }, [qtyByBoatId]);

  const activeShip = useMemo(
    () => ships.find((s) => s.id === activeShipId) ?? null,
    [ships, activeShipId]
  );

  // Route editing helpers
  const setActiveRoute = useCallback(
    (updater) => {
      if (!activeShipId) return;
      setShips((prev) =>
        prev.map((s) =>
          s.id === activeShipId
            ? {
                ...s,
                route: typeof updater === "function" ? updater(s.route) : updater,
              }
            : s
        )
      );
    },
    [activeShipId]
  );

  const onClearRoute = useCallback(() => setActiveRoute([]), [setActiveRoute]);
  const onUndoRoute = useCallback(
    () => setActiveRoute((prev) => (prev.length ? prev.slice(0, -1) : prev)),
    [setActiveRoute]
  );

  // Create ships from current fleet qty
  const initShipsFromFleet = useCallback(() => {
    const next = [];
    for (const boat of BOATS) {
      const qty = qtyByBoatId[boat.id] || 0;
      for (let i = 0; i < qty; i++) {
        const id = `${boat.id}-${i}-${crypto.randomUUID()}`;
        next.push({
          id,
          boatId: boat.id,
          name: boat.name,
          speedKnots: boat.topSpeedKnots,
          route: [],
        });
      }
    }
    setShips(next);
    setActiveShipId(next[0]?.id ?? null);
  }, [qtyByBoatId]);

  const canGoToDraw = totalShips > 0;

  const allShipsHaveRoutes = useMemo(() => {
    return ships.length > 0 && ships.every((s) => (s.route?.length ?? 0) >= 2);
  }, [ships]);

  const canDeploy = ships.length > 0 && allShipsHaveRoutes;

  const goToDraw = useCallback(() => {
    if (!canGoToDraw) return;
    initShipsFromFleet();
    if (ships.length && !activeShipId) setActiveShipId(ships[0]?.id ?? null);

    setStage(STAGES.DRAW);
  }, [canGoToDraw, ships.length, activeShipId, initShipsFromFleet]);

  const goToDeploy = useCallback(() => {
    if (!canDeploy) return;
    setStage(STAGES.DEPLOY);
  }, [canDeploy]);

  const startSimulation = useCallback(() => {
    if (!isDeploy) return;

    // start timer + hide sidebar + start ship sim
    setTimerRunning(true);
    setSidebarOpen(false);
    setStage(STAGES.RUNNING);
  }, [isDeploy]);

  // Sea polygon with island holes
  const seaPolygon = useMemo(() => {
    const outer = [
      [ARCTIC_BOUNDS[0][0], ARCTIC_BOUNDS[0][1]], // SW
      [ARCTIC_BOUNDS[0][0], ARCTIC_BOUNDS[1][1]], // SE
      [ARCTIC_BOUNDS[1][0], ARCTIC_BOUNDS[1][1]], // NE
      [ARCTIC_BOUNDS[1][0], ARCTIC_BOUNDS[0][1]], // NW
    ];
    const holes = ISLAND_OUTLINES.map((poly) => poly);
    return [outer, ...holes];
  }, []);

  // Ship movement + coverage
  const boatById = useMemo(
    () => Object.fromEntries(BOATS.map((b) => [b.id, b])),
    []
  );

  const radiusByShipId = useMemo(() => {
    const m = new Map();
    for (const s of ships) {
      const boat = boatById[s.boatId];
      m.set(s.id, boat?.coverageRadiusM ?? 0);
    }
    return m;
  }, [ships, boatById]);

  const onSimFinish = useCallback(() => {
    setStage(STAGES.RESULTS);
    setTimerRunning(false);
  }, []);

  const shipPositions = useMultiShipSimulation({
    running: isRunning,
    ships,
    durationMs: DEMO_DURATION_MS,
    onFinish: onSimFinish,
    timeScale: DEMO_TIME_SCALE,
  });

  const coverageSnapshot = useCoverageTracker({
    running: isRunning,
    ships,
    positionsById: shipPositions,
    maskObj,
    getRadiusMetersByShipId: (id) => radiusByShipId.get(id) ?? 0,
    sampleMs: 200,
  });

  const coverageSummary = useMemo(() => {
    const vals =
      coverageSnapshot?.perShip
        ?.map((x) => x.coveragePercent)
        .filter((v) => typeof v === "number" && Number.isFinite(v)) ?? [];

    if (!vals.length) return { min: 0, avg: 0, max: 0, total: 0 };

    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const total = coverageSnapshot?.totalCoveragePercent ?? 0;

    return { min, avg, max, total };
  }, [coverageSnapshot]);

  const finalStats = useMemo(() => {
    const totalRoutePoints = ships.reduce(
      (a, s) => a + (s.route?.length ?? 0),
      0
    );
    return {
      totalCost,
      totalShips,
      shipsDeployed: ships.length,
      totalRoutePoints,
      durationSeconds: Math.round(DEMO_DURATION_MS / 1000),
    };
  }, [totalCost, totalShips, ships]);

  const handleTimerEnd = useCallback(() => {
    // If timer ends first, force results screen
    setTimerRunning(false);
    setStage(STAGES.RESULTS);
  }, []);

  // Render
  return (
    <div className="w-screen h-screen relative">
      {/* Sidebar (hidden during RUNNING) */}
      {sidebarOpen && stage !== STAGES.RUNNING && (
        <Sidebar
          boats={BOATS}
          previousOperations={PREVIOUS_OPERATIONS}
          ships={ships}
          stage={stage}
          setStage={setStage}
          qtyByBoatId={qtyByBoatId}
          setQtyByBoatId={setQtyByBoatId}
          selectedPresetId={selectedPresetId}
          setSelectedPresetId={setSelectedPresetId}
          costColor={costColor}
          fmtMoney={fmtMoney}
          activeShipId={activeShipId}
          setActiveShipId={setActiveShipId}
          activeRoutePoints={activeShip?.route?.length ?? 0}
          canGoToDraw={canGoToDraw}
          canDeploy={canDeploy}
          onGoToDraw={goToDraw}
          onGoToDeploy={goToDeploy}
          onUndoRoute={onUndoRoute}
          onClearRoute={onClearRoute}
          onStartSimulation={startSimulation}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Timer overlay (starts when you press Start) */}
      <SimulationTimer
        duration={Math.round(DEMO_DURATION_MS / 1000)}
        isRunning={timerRunning}
        onEnd={handleTimerEnd}
      />

      <MapContainer
        center={[75.8, -90.7]}
        zoom={7}
        maxBounds={ARCTIC_BOUNDS}
        maxBoundsViscosity={1.0}
        minZoom={7}
        maxZoom={8}
        worldCopyJump={false}
        style={{ height: "100vh", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          attribution="© OpenMapTiles © OpenStreetMap contributors"
        />

        {/* Ocean + coastline only when not running */}
        {!isRunning && (
          <>
            <Polygon positions={seaPolygon} pathOptions={SEA_STYLE} />

            {ISLAND_OUTLINES.map((poly, i) => (
              <Polygon
                key={`coast-glow-${i}`}
                positions={poly}
                pathOptions={{
                  color: "rgba(173,140,255,0.28)",
                  weight: 6,
                  opacity: 1,
                  fillOpacity: 0,
                }}
              />
            ))}
            {ISLAND_OUTLINES.map((poly, i) => (
              <Polygon
                key={`coast-${i}`}
                positions={poly}
                pathOptions={{
                  color: "rgba(255,255,255,0.32)",
                  weight: 1.8,
                  opacity: 1,
                  fillOpacity: 0,
                }}
              />
            ))}
          </>
        )}

        {/* Drawing layer */}
        <RouteDrawingLayer
          enabled={isDraw && !!activeShipId}
          route={activeShip?.route ?? []}
          setRoute={setActiveRoute}
          islandOutlines={ISLAND_OUTLINES}
        />

        {/* Show all routes */}
        {ships.map((s) =>
          (s.route?.length ?? 0) > 1 ? (
            <Polyline
              key={`route-${s.id}`}
              positions={s.route}
              pathOptions={{
                ...(isDraw && s.id === activeShipId
                  ? DRAW_STYLE
                  : DASHED_ROUTE_STYLE),
                opacity: s.id === activeShipId ? 1 : 0.35,
                weight: s.id === activeShipId ? 4 : 2,
              }}
            />
          ) : null
        )}

        {/* Coverage rings during RUNNING */}
        {isRunning &&
          ships.map((s) => {
            const pos = shipPositions?.[s.id];
            if (!pos) return null;

            const r = radiusByShipId.get(s.id) ?? 0;
            if (!r) return null;

            return (
              <Circle
                key={`cov-${s.id}`}
                center={pos}
                radius={r}
                pathOptions={{
                  color: "rgba(34,197,94,0.35)",
                  weight: 1.5,
                  fillColor: "rgba(34,197,94,0.18)",
                  fillOpacity: 0.25,
                }}
              />
            );
          })}

        {/* Ship icons + labels during RUNNING */}
        {isRunning &&
          ships.map((s) => {
            const pos = shipPositions?.[s.id];
            if (!pos) return null;

            const label = shortShipLabel(s.id);
            const boatName = boatById[s.boatId]?.name ?? s.boatId;

            return (
              <Marker
                key={`ship-${s.id}`}
                position={pos}
                icon={BOAT_ICONS[s.boatId] ?? BOAT_ICONS.halifax}
              >
                <Tooltip permanent direction="top" offset={[0, -18]} opacity={1}>
                  <div style={{ lineHeight: 1.1 }}>
                    <div style={{ fontWeight: 700 }}>{label}</div>
                    <div style={{ fontSize: 11, opacity: 0.85 }}>{boatName}</div>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Sidebar toggle hidden during RUNNING */}
      {stage !== STAGES.RUNNING && (
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          className="absolute top-4 right-4 z-[1000] font-arame border border-white/10 bg-black/45 backdrop-blur-xl px-3 py-2 text-xs font-semibold text-white/85 hover:bg-white/10"
        >
          {sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        </button>
      )}

      {/* Results modal */}
      {isResults && (
        <div className="absolute inset-0 z-[1200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[560px] max-w-[92vw] rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] p-5">
            <div className="text-white font-semibold text-lg">Game Over</div>
            <div className="mt-1 text-white/60 text-sm">Final operation stats</div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Total cost</div>
                <div className={`text-lg font-semibold ${costColor(finalStats.totalCost)}`}>
                  {fmtMoney(finalStats.totalCost)}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Ships deployed</div>
                <div className="text-lg font-semibold text-white">
                  {finalStats.shipsDeployed}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Duration</div>
                <div className="text-lg font-semibold text-white">
                  {finalStats.durationSeconds}s
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Total route points</div>
                <div className="text-lg font-semibold text-white">
                  {finalStats.totalRoutePoints}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Total coverage (union)</div>
                <div className="text-lg font-semibold text-white">
                  {coverageSummary.total.toFixed(1)}%
                </div>
                <div className="text-[11px] text-white/45 mt-1">
                  {coverageSnapshot?.totalCoveredWaterCells ?? 0} /{" "}
                  {coverageSnapshot?.totalWaterCells ?? 0} water cells
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Coverage (min / avg / max)</div>
                <div className="text-lg font-semibold text-white">
                  {coverageSummary.min.toFixed(1)}% / {coverageSummary.avg.toFixed(1)}% /{" "}
                  {coverageSummary.max.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setStage(STAGES.PLANNING);
                  setSidebarOpen(true);
                  setTimerRunning(false);
                  setShips([]);
                  setActiveShipId(null);
                }}
                className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-sm hover:opacity-90"
              >
                Back to Planning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

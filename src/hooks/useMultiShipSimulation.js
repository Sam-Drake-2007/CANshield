import { useEffect, useMemo, useRef, useState } from "react";

// --- distance in meters (haversine) ---
function haversineMeters(a, b) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371000;
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);

  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(s));
}

function buildRouteIndex(route) {
  if (!route || route.length < 2) {
    return {
      route: route || [],
      cumulativeDistances: [0],
      total: 0,
    };
  }

  const cumulativeDistances = [0];
  let total = 0;

  for (let i = 0; i < route.length - 1; i++) {
    const d = haversineMeters(route[i], route[i + 1]);
    total += d;
    cumulativeDistances.push(total);
  }

  return { route, cumulativeDistances, total };
}

function positionAtDistance(routeIndex, distanceMeters) {
  const { route, cumulativeDistances, total } = routeIndex;

  if (!route?.length) return null;
  if (route.length === 1) return route[0];
  if (!(total > 0)) return route[0];

  const d = Math.max(0, Math.min(total, distanceMeters));

  let i = 0;
  while (i < cumulativeDistances.length - 1 && cumulativeDistances[i + 1] < d) i++;

  const a = route[i];
  const b = route[i + 1];

  const segLen = cumulativeDistances[i + 1] - cumulativeDistances[i];
  const t = segLen === 0 ? 0 : (d - cumulativeDistances[i]) / segLen;

  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function toFiniteNumber(x) {
  if (typeof x === "number") return Number.isFinite(x) ? x : 0;
  if (typeof x === "string") {
    const n = parseFloat(x);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

// knots -> meters/second
function knotsToMps(knots) {
  return toFiniteNumber(knots) * 0.514444;
}

// forward then reverse then forward ...
function pingPongDistance(traveled, total) {
  if (!(total > 0)) return 0;
  const cycle = 2 * total;
  const m = traveled % cycle;
  return m <= total ? m : cycle - m;
}

/**
 * ships: [{ id, speedKnots, route: [[lat,lng], ...] }]
 * Returns positions: { [shipId]: [lat,lng] }
 */
export function useMultiShipSimulation({
  running,
  ships,
  durationMs = 30000,
  onFinish,
  timeScale = 1,
}) {
  const [positions, setPositions] = useState({});
  const onFinishRef = useRef(onFinish);
  const finishedRef = useRef(false);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const routeIndexByShipId = useMemo(() => {
    const m = new Map();
    for (const s of ships || []) {
      m.set(s.id, buildRouteIndex(s.route || []));
    }
    return m;
  }, [ships]);

  useEffect(() => {
    if (!running) return;
    if (!ships?.length) return;

    finishedRef.current = false;

    let raf = 0;
    const start = performance.now();

    // init positions
    setPositions(() => {
      const init = {};
      for (const s of ships) init[s.id] = s.route?.[0] ?? null;
      return init;
    });

    // hard stop
    const timeoutId = window.setTimeout(() => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onFinishRef.current?.();
    }, Math.max(0, toFiniteNumber(durationMs)));

    const tick = (now) => {
      if (finishedRef.current) return;

      const elapsedSec = (now - start) / 1000;
      const next = {};

      for (const s of ships) {
        const routeIndex = routeIndexByShipId.get(s.id);

        if (!routeIndex || routeIndex.route.length === 0) {
          next[s.id] = null;
          continue;
        }

        const speedMps = knotsToMps(s.speedKnots);
        const traveled = speedMps * elapsedSec * toFiniteNumber(timeScale);

        if (!(routeIndex.total > 0) || !Number.isFinite(traveled)) {
          next[s.id] = routeIndex.route[0];
          continue;
        }

        const d = pingPongDistance(traveled, routeIndex.total);
        next[s.id] = positionAtDistance(routeIndex, d);
      }

      setPositions(next);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      finishedRef.current = true;
      clearTimeout(timeoutId);
      cancelAnimationFrame(raf);
    };
  }, [running, ships, durationMs, timeScale, routeIndexByShipId]);

  return positions;
}
import L from "leaflet";

import halifaxIcon from "../../assets/images/halifax.png";
import dewolfIcon from "../../assets/images/dewolf.png";
import kingstonIcon from "../../assets/images/kingston.png";

// Grid resolution
export const GRID_ROWS = 160;
export const GRID_COLS = 240;

// NOTE: TUNE FOR DEMOING PURPOSES
export const DEMO_DURATION_MS = 300000;
export const DEMO_TIME_SCALE = 120;

export const STAGES = {
  PLANNING: "PLANNING",
  DRAW: "DRAW",
  DEPLOY: "DEPLOY",
  RUNNING: "RUNNING",
  RESULTS: "RESULTS",
};

export const DASHED_ROUTE_STYLE = {
  color: "#22c55e",
  weight: 3,
  opacity: 0.95,
  dashArray: "8 10",
  lineCap: "round",
};

export const DRAW_STYLE = { ...DASHED_ROUTE_STYLE, color: "#ff2d2d", opacity: 0.9 };

export const SEA_STYLE = {
  fillColor: "#ad8cff",
  fillOpacity: 0.12,
  color: "rgba(255,255,255,0.18)",
  weight: 1.2,
};

export const BOAT_ICONS = {
  halifax: new L.Icon({
    iconUrl: halifaxIcon,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  }),

  dewolf: new L.Icon({
    iconUrl: dewolfIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  }),

  kingston: new L.Icon({
    iconUrl: kingstonIcon,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  }),
};

// stable-ish short label from ship.id
export function shortShipLabel(shipId) {
  let h = 0;
  for (let i = 0; i < shipId.length; i++) {
    h = (h * 31 + shipId.charCodeAt(i)) >>> 0;
  }
  const n = h % 10000;
  return `S-${String(n).padStart(4, "0")}`;
}

export function costColor(cost) {
  if (cost === 0) return "text-white";
  if (cost < 300_000) return "text-emerald-400";
  if (cost < 700_000) return "text-yellow-400";
  if (cost < 1_000_000) return "text-orange-400";
  return "text-red-500";
}

export const fmtMoney = (n) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);
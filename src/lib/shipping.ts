// India Post based shipping estimator (Speed Post style slabs)
// Origin is assumed to be Tamil Nadu (PIN starting with 6).

export const ORIGIN_PIN_PREFIX = "6";
export const FREE_SHIPPING_THRESHOLD = 1500;
const WEIGHT_PER_ITEM_G = 300; // avg weight of a handmade crochet item

export type ShippingZone = "local" | "regional" | "national" | "remote";

export interface ShippingEstimate {
  zone: ShippingZone;
  zoneLabel: string;
  cost: number;
  minDays: number;
  maxDays: number;
  weightGrams: number;
  method: string;
  etaLabel: string;
  etaRangeLabel: string;
  isFree: boolean;
}

// Remote / far-flung circles: North East (79x, 78x), J&K & Ladakh (18x-19x),
// Andaman & Nicobar (744), Lakshadweep (682 55x handled loosely)
function isRemote(pin: string): boolean {
  const p3 = pin.slice(0, 3);
  const p2 = pin.slice(0, 2);
  return (
    ["78", "79"].includes(p2) ||
    ["18", "19"].includes(p2) ||
    p3 === "744" ||
    p3 === "737" // Sikkim
  );
}

export function getZone(pin: string): ShippingZone {
  const clean = (pin || "").replace(/\D/g, "");
  if (clean.length !== 6) return "national";
  if (isRemote(clean)) return "remote";
  if (clean[0] === ORIGIN_PIN_PREFIX) return "local";
  if (["5", "7"].includes(clean[0])) return "regional"; // South India neighbours
  return "national";
}

const ZONE_CONFIG: Record<
  ShippingZone,
  { label: string; base: number; perExtra500g: number; minDays: number; maxDays: number }
> = {
  local: { label: "Local (within state)", base: 40, perExtra500g: 15, minDays: 2, maxDays: 3 },
  regional: { label: "Regional (South India)", base: 60, perExtra500g: 20, minDays: 3, maxDays: 5 },
  national: { label: "Rest of India", base: 80, perExtra500g: 25, minDays: 5, maxDays: 7 },
  remote: { label: "North East / J&K / Islands", base: 110, perExtra500g: 35, minDays: 7, maxDays: 10 },
};

export function estimateShipping(
  pin: string,
  totalItems: number,
  orderValue: number
): ShippingEstimate {
  const zone = getZone(pin);
  const cfg = ZONE_CONFIG[zone];
  const weightGrams = Math.max(WEIGHT_PER_ITEM_G, totalItems * WEIGHT_PER_ITEM_G);
  const extraSlabs = Math.max(0, Math.ceil(weightGrams / 500) - 1);
  let cost = cfg.base + extraSlabs * cfg.perExtra500g;
  const isFree = orderValue >= FREE_SHIPPING_THRESHOLD;
  if (isFree) cost = 0;

  const method = `India Post Speed Post · ${cfg.label}`;
  const etaRangeLabel = `${cfg.minDays}–${cfg.maxDays} business days`;

  return {
    zone,
    zoneLabel: cfg.label,
    cost,
    minDays: cfg.minDays,
    maxDays: cfg.maxDays,
    weightGrams,
    method,
    etaRangeLabel,
    etaLabel: `${etaRangeLabel} (${formatDateRange(cfg.minDays, cfg.maxDays)})`,
    isFree,
  };
}

function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) added++; // India Post: no Sunday delivery
  }
  return d;
}

export function formatDateRange(minDays: number, maxDays: number): string {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const start = addBusinessDays(new Date(), minDays + 1); // +1 day dispatch
  const end = addBusinessDays(new Date(), maxDays + 1);
  return `${start.toLocaleDateString("en-IN", opts)} – ${end.toLocaleDateString("en-IN", opts)}`;
}

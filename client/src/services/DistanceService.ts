// services/DistanceService.ts
import type { Address } from "../types/Types";

type FactorResult = { factor: number; remotePct?: number };

// very simple region map; extend as needed
const countryRegion: Record<string, string> = {
  Georgia: "EU",
  Germany: "EU",
  France: "EU",
  Spain: "EU",
  Italy: "EU",
  Poland: "EU",
  Netherlands: "EU",

  China: "ASIA",
  Japan: "ASIA",
  India: "ASIA",
  "South Korea": "ASIA",
  Korea: "ASIA",

  USA: "NA",
  "United States": "NA",
  Canada: "NA",

  Australia: "OC",

  Iceland: "REMOTE",
  Greenland: "REMOTE",
  Alaska: "REMOTE",
};

const pairFactor: Record<string, number> = {
  "EU-EU": 1.0,
  "EU-ASIA": 1.3,
  "ASIA-EU": 1.3,
  "EU-NA": 1.2,
  "NA-EU": 1.2,
  "ASIA-NA": 1.4,
  "NA-ASIA": 1.4,
  DEFAULT: 1.2,
};

export class DistanceService {
  static regionOf(addr: Address) {
    return countryRegion[addr.country] ?? "GLOBAL";
  }

  static getFactor(origin: Address, destination: Address): FactorResult {
    const r1 = this.regionOf(origin);
    const r2 = this.regionOf(destination);

    // Remote overrides everything
    if (r1 === "REMOTE" || r2 === "REMOTE") {
      return { factor: 1.6, remotePct: 0.1 }; // 10% remote surcharge
    }

    const key = `${r1}-${r2}`;
    const factor = pairFactor[key] ?? pairFactor.DEFAULT;
    return { factor, remotePct: 0 };
  }
}

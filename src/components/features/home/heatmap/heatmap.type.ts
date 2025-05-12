import type BN from "bn.js";

export interface HeatmapDatum {
  date: Date | string;
  values: BN[];
  state: "closed" | "today" | "open";
}

export interface HeatmapChartProps {
  data: HeatmapDatum[];
  priceBins: number[];
  width?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  onBinClick: (marketId: number, binId: number) => void;
}

export interface BinItem {
  i: number;
  j: number;
  date: Date;
  price: string;
  tickets: number;
  perc: number;
}

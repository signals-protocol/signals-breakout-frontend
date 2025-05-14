import type { PublicKey } from "@solana/web3.js";
import type BN from "bn.js";

export interface PredictionBase {
  range: string;
  avg: string;
  bet: string;
  value: string;
  toWin?: string;
  date: string;
  result: "Win" | "Loss" | null;
  shares: BN;
  txHash: string;
  binIndices: number[];
  marketId: number;
  totalCost: string;
  blockTime: number;
}
export interface LivePrediction extends PredictionBase {
  range: string;
  avg: string;
  bet: string;
  value: string;
  toWin: string;
  date: string;
  result: null;
  shares: BN;
  blockTime: number;
}
export interface EndedPrediction extends PredictionBase {
  range: string;
  avg: string;
  bet: string;
  value: string;
  date: string;
  result: "Win" | "Loss";
  shares: BN;
}

export interface PredictionSummary {
  positionValue: string;
  profitAndLoss: string;
  volumeTraded: string;
  predictionCount: string;
}

export interface TokensBought {
  marketId: BN;
  totalCost: BN;
  buyer: PublicKey;
}
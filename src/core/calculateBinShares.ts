import BN from "bn.js";
import { calculateXForMultiBins } from "range-bet-math-core";
import type { HeatmapDatum } from "components/features/home/heatmap/heatmap.type";
import { bnToBigInt, bigIntToBN } from "./utils";

export const calculateBinShares = (
  marketId: number,
  binIndices: number[],
  cost: BN,
  heatmapData: HeatmapDatum[]
): BN => {
  const market = heatmapData[marketId].values;
  const qlist = binIndices.map((binIndex) =>
    bnToBigInt(market[binIndex])
  );
  const t = market.reduce((acc, curr) => acc.add(curr), new BN(0));
  const shares = calculateXForMultiBins(
    bnToBigInt(cost),
    new BigUint64Array(qlist.sort()),
    bnToBigInt(t)
  );
  return bigIntToBN(shares);
};

import BN from "bn.js";
import PREDICTION_CONSTANTS from "components/features/home/input/constants";

export function createPriceBins(startPrice: number, length: number) {
  return Array.from({ length: length + 1 }, (_, i) => startPrice + i * 500);
}
export const binIndexToBin = (binIndex: number) => {
  return (
    binIndex * PREDICTION_CONSTANTS.tickSpacing + PREDICTION_CONSTANTS.binBase
  );
};
export const binToBinIndex = (bin: number) => {
  return (
    (bin - PREDICTION_CONSTANTS.binBase) / PREDICTION_CONSTANTS.tickSpacing
  );
};

export const getBinRange = (
  binIndices: number[],
  priceBins: number[]
): [number, number] => [
  priceBins[binIndices[0]],
  priceBins[binIndices[binIndices.length - 1] + 1],
];

export const toShare = (item: BN, total: BN) =>
  total.gt(new BN(0)) ? Number(item.mul(new BN(10000)).div(total)) / 100 : 0;

export const bnToBigInt = (bn: BN) => BigInt(bn.toString());
export const bigIntToBN = (bigInt: bigint) => new BN(bigInt.toString());

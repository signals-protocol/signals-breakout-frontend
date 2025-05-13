import PREDICTION_CONSTANTS from "components/features/home/input/constants";

export function createPriceBins(startPrice: number, length: number) {
  return Array.from({ length: length + 1 }, (_, i) => startPrice + i * 500);
}
export const binIndexToBin = (binIndex: number) => {
  return binIndex * PREDICTION_CONSTANTS.tickSpacing + PREDICTION_CONSTANTS.binBase;
};
export const binToBinIndex = (bin: number) => {
  return (bin - PREDICTION_CONSTANTS.binBase) / PREDICTION_CONSTANTS.tickSpacing;
};

export const getBinRange = (binIndex: number | null, priceBins: number[]) =>
  binIndex !== null ? [priceBins[binIndex], priceBins[binIndex + 1]] : null;

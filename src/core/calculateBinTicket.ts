import BN from "bn.js";

export const calculateBinTicket = async (
  marketId: number,
  binIndex: number,
  amount: BN
) => {
  // const config = CONFIGS[chainId];
  // const provider = new JsonRpcProvider(config.rpcUrl);
  // const bm = BetManager__factory.connect(config.RangeBetManager, provider);
  // const bin = binIndexToBin(binIndex);
  // return bm.calculateXForBin(marketId, bin, amount);
  return new BN(0);
};

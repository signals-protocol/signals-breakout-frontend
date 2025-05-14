import BN from "bn.js";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import type { RangeBetProgram } from "types/range_bet_program";
import { calculateMultiBinsSellCost } from "range-bet-math-core";
import { bigIntToBN, bnToBigInt } from "./utils";

export const calculateBinSellCost = async (
  program: Program<RangeBetProgram>,
  marketId: number,
  binIndices: number[],
  shares: BN
): Promise<BN> => {
  // Market account address (PDA) calculation
  const [marketPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("market"), new BN(marketId).toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const marketInfo = program.coder.accounts.decode(
    "market",
    await program.provider.connection
      .getAccountInfo(marketPDA)
      .then((res) => res!.data)
  );

  const value = calculateMultiBinsSellCost(
    bnToBigInt(shares),
    new BigUint64Array(
      binIndices
        .map((binIndex) => bnToBigInt(marketInfo.bins[binIndex]))
        .sort((a, b) => Number(b - a))
    ),
    bnToBigInt(marketInfo.tTotal)
  );

  return bigIntToBN(value);
};

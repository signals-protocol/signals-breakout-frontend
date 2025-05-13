import BN from "bn.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import type { RangeBetProgram } from "types/range_bet_program";
import RANGE_BET_IDL from "idl/range_bet_program.json";

export const calculateBinSellCost = async (
  provider: AnchorProvider,
  marketId: number,
  binIndex: number,
  shares: BN
): Promise<BN> => {
  const program = new Program<RangeBetProgram>(RANGE_BET_IDL, provider);

  // Market account address (PDA) calculation
  const [market] = PublicKey.findProgramAddressSync(
    [Buffer.from("market"), new BN(marketId).toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const value: BN= await program.methods
    .calculateBinSellCost(new BN(marketId), binIndex, shares)
    .accounts({ market })
    .view();

  return value;
};

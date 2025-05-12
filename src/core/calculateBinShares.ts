import BN from "bn.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import { PublicKey, type Connection } from "@solana/web3.js";
import type { RangeBetProgram } from "types/range_bet_program";
import RANGE_BET_IDL from "idl/range_bet_program.json";

export const calculateBinShares = async (
  connection: Connection,
  wallet: WalletContextState,
  marketId: number,
  binIndex: number,
  cost: BN
) => {
  const provider = new AnchorProvider(connection, wallet as any, {
    commitment: "confirmed",
  });
  const program = new Program<RangeBetProgram>(RANGE_BET_IDL, provider);

  // Market account address (PDA) calculation
  const [market] = PublicKey.findProgramAddressSync(
    [Buffer.from("market"), new BN(marketId).toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const shares = await program.methods
    .calculateXForBin(new BN(marketId), binIndex, cost)
    .accounts({ market })
    .view();

  return shares;
};

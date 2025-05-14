import BN from "bn.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import type { RangeBetProgram } from "types/range_bet_program";
import RANGE_BET_IDL from "idl/range_bet_program.json";
import { calculateMultiBinsSellCost } from "range-bet-math-core";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import { bigIntToBN, bnToBigInt } from "./utils";

export const calculateBinSellCost = async (
  connection: Connection,
  wallet: WalletContextState,
  marketId: number,
  binIndices: number[],
  shares: BN
): Promise<BN> => {
  const provider = new AnchorProvider(connection, wallet as any, {
    commitment: "confirmed",
  });
  const program = new Program<RangeBetProgram>(RANGE_BET_IDL, provider);

  // Market account address (PDA) calculation
  const [marketPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("market"), new BN(marketId).toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const marketInfo = program.coder.accounts.decode(
    "market",
    await connection.getAccountInfo(marketPDA).then((res) => res!.data)
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

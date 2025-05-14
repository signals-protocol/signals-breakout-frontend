import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import type { RangeBetProgram } from "types/range_bet_program";
import RANGE_BET_IDL from "idl/range_bet_program.json";
import { PublicKey, Transaction } from "@solana/web3.js";

export const useProgram = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const w = wallet.publicKey
    ? wallet
    : {
        publicKey: new PublicKey("11111111111111111111111111111111"), // 아무 키나
        signAllTransactions: async (txs: Transaction[]) => txs,
        signTransaction: async (tx: Transaction) => tx,
      };
  const provider = new AnchorProvider(connection, w as any, {
    commitment: "confirmed",
  });
  const program = new Program<RangeBetProgram>(RANGE_BET_IDL, provider);
  return { program, connection, wallet };
};

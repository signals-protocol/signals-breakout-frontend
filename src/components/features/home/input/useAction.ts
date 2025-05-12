import BN from "bn.js";
import RANGE_BET_IDL from "idl/range_bet_program.json";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import type { RangeBetProgram } from "types/range_bet_program";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { PublicKey } from "@solana/web3.js";
import { parseBN } from "utils/format-bn";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import CORE_PROGRAMS from "core/core.programs.config";

interface UseActionProps {
  currentBinId: number | null;
  selectedMarketId: number;
  amount: string;
  refreshMap: () => Promise<void>;
}

type ActionState =
  | "connect-account"
  | "can-predict"
  | "predict-loading"
  | "done";

export default function useAction({
  currentBinId,
  selectedMarketId,
  amount,
  refreshMap,
}: UseActionProps) {
  const nav = useNavigate();
  const wallet = useWallet();
  const { connection } = useConnection();

  const predict = async () => {
    if (currentBinId === null) return;
    if (!wallet.publicKey) return;
    try {
      setState("predict-loading");

      const provider = new AnchorProvider(connection, wallet as any, {
        commitment: "confirmed",
      });
      const program = new Program<RangeBetProgram>(RANGE_BET_IDL, provider);
      const amountBN = parseBN(amount);
      const [vaultAuth] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vault"),
          new BN(selectedMarketId).toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      const vaultAta = getAssociatedTokenAddressSync(
        new PublicKey(CORE_PROGRAMS.USDC),
        vaultAuth,
        true
      );
      const userTokenAccount = getAssociatedTokenAddressSync(
        new PublicKey(CORE_PROGRAMS.USDC),
        wallet.publicKey
      );

      await program.methods
        .buyTokens(
          new BN(selectedMarketId),
          [currentBinId],
          [amountBN],
          amountBN.mul(new BN(110)).div(new BN(100))
        )
        .accounts({
          user: wallet.publicKey,
          userTokenAccount,
          vault: vaultAta,
        })
        .rpc();

      setState("done");
      await refreshMap();
    } catch (error) {
      setState("can-predict");
    }
  };

  const toProfile = () => {
    nav("/profile");
    setState("can-predict");
  };

  const [state, setState] = useState<ActionState>("can-predict");
  useEffect(() => {
    if (!wallet.publicKey) {
      setState("connect-account");
    } else if (state === "done") {
      return;
    } else {
      setState("can-predict");
    }
  }, [wallet.publicKey]);

  const onClick = () => {
    if (state === "connect-account") {
      wallet.connect();
    } else if (state === "can-predict") {
      predict();
    } else if (state === "done") {
      toProfile();
    }
  };

  return {
    onClick,
    state,
    msg:
      state === "connect-account"
        ? "Connect Wallet"
        : state === "can-predict"
        ? "Predict"
        : state === "predict-loading"
        ? "Placing Prediction"
        : state === "done"
        ? "Prediction Confirmed"
        : "",
  };
}

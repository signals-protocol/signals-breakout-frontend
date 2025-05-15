import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, BN, AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import collateralTokenFaucetIdl from "idl/collateral_token_faucet.json";
import type { CollateralTokenFaucet } from "types/collateral_token_faucet";
import CORE_PROGRAMS from "core/core.programs.config";
import useBalance from "states/balance.state";
interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FaucetModal({ isOpen, onClose }: FaucetModalProps) {
  const [loading, setLoading] = useState(false);
  const { connection } = useConnection();
  const wallet = useWallet();
  const { refreshBalance } = useBalance();

  const handleSolFaucet = () => {
    window.open("https://faucet.solana.com/", "_blank");
  };

  const handleUsdcFaucet = async () => {
    if (!wallet.publicKey) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      setLoading(true);

      const provider = new AnchorProvider(connection, wallet as any, {
        commitment: "confirmed",
      });
      // 프로그램 인스턴스 생성
      const usdcProgram = new Program<CollateralTokenFaucet>(
        collateralTokenFaucetIdl,
        provider
      );

      await usdcProgram.methods
        .mintCollateralTokens(new BN(5 * 10 ** 6))
        .accounts({
          mint: new PublicKey(CORE_PROGRAMS.USDC),
          user: wallet.publicKey,
        })
        .rpc();

      await refreshBalance();
      alert("5 USDC has been successfully minted!");
    } catch (error) {
      console.error("USDC Faucet error:", error);
      alert("USDC Faucet request failed.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-96 max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Faucet</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">SOL (Devnet)</p>
            <button
              onClick={handleSolFaucet}
              disabled={loading}
              className="btn-primary w-24"
            >
              Get
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">USDC (Mock) (Devnet)</p>
            <button
              onClick={handleUsdcFaucet}
              disabled={loading}
              className="btn-primary w-24"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                "Get"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

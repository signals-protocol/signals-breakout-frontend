import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function ConnectWalletButton() {
  return (
    <WalletMultiButton
      style={{
        backgroundColor: "var(--color-primary)",
        height: "40px",
        borderRadius: "10px",
        fontSize: "14px",
      }}
    />
  );
}

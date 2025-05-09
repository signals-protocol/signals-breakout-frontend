import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function ConnectWalletButton() {
  return (
    <WalletMultiButton
      style={{
        backgroundColor: "var(--color-primary)",
        height: "44px",
        borderRadius: "10px",
      }}
    />
  );
}

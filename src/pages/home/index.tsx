import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const { publicKey } = useWallet();
  return <div>
    {publicKey?.toBase58()}
  </div>;
}

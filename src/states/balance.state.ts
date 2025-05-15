import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { Connection, PublicKey } from "@solana/web3.js";
import { getUSDCBalance } from "core/token";
import { useState, useEffect } from "react";
import { BehaviorSubject } from "rxjs";

const $balance = new BehaviorSubject<number>(0);

const refreshBalance = (connection: Connection, pubKey: PublicKey | null) => {
  if (pubKey) {
    return getUSDCBalance(connection, pubKey);
  } else {
    return Promise.resolve(0);
  }
};

const useBalance = () => {
  const [balance, setBalance] = useState<number>(0);
  const wallet = useWallet();
  const { connection } = useConnection();
  useEffect(() => {
    const subscription = $balance.subscribe((balance) => {
      setBalance(balance);
    });
    return () => subscription.unsubscribe();
  }, []);

  const refresh = async () => {
    const balance = await refreshBalance(connection, wallet.publicKey);
    $balance.next(balance);
  };

  return { balance, refreshBalance: refresh };
};

export default useBalance;

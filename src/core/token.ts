import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createApproveInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import CORE_PROGRAMS from "./core.programs.config";
import BN from "bn.js";
import { formatBN } from "utils/format-bn";

export async function approveUSDC(
  connection: Connection,
  wallet: Keypair,
  amount: number,
  spender: PublicKey
) {
  const owner = wallet.publicKey;
  const tokenAccount = await getAssociatedTokenAddress(
    new PublicKey(CORE_PROGRAMS.USDC),
    owner
  );

  const approveIx = createApproveInstruction(
    tokenAccount,
    spender,
    owner,
    amount
  );

  const tx = new Transaction().add(approveIx);
  const signature = await sendAndConfirmTransaction(connection, tx, [wallet]);
  return signature;
}

export async function getUSDCBalance(
  connection: Connection,
  owner: PublicKey
): Promise<number> {
  const tokenAccount = await getAssociatedTokenAddress(
    new PublicKey(CORE_PROGRAMS.USDC),
    owner
  );

  return connection
    .getTokenAccountBalance(tokenAccount)
    .then(
      (balance) =>
        +formatBN(new BN(balance.value.amount), balance.value.decimals)
    );
}

export async function getAllowance(
  connection: Connection,
  wallet: Keypair,
  spender: PublicKey
): Promise<number> {
  const owner = wallet.publicKey;
  const tokenAccount = await getAssociatedTokenAddress(
    new PublicKey(CORE_PROGRAMS.USDC),
    owner
  );

  const accountInfo = await connection.getTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  const delegatedAmount =
    accountInfo.value
      .find((account) => account.pubkey.equals(tokenAccount))
      ?.account.data.readBigInt64LE(64) || BigInt(0);

  return Number(delegatedAmount);
}

export async function transferUSDC(
  connection: Connection,
  wallet: Keypair,
  recipient: PublicKey,
  amount: number
) {
  const owner = wallet.publicKey;
  const fromTokenAccount = await getAssociatedTokenAddress(
    new PublicKey(CORE_PROGRAMS.USDC),
    owner
  );
  const toTokenAccount = await getAssociatedTokenAddress(
    new PublicKey(CORE_PROGRAMS.USDC),
    recipient
  );

  const transferIx = createTransferInstruction(
    fromTokenAccount,
    toTokenAccount,
    owner,
    amount
  );

  const tx = new Transaction().add(transferIx);
  const signature = await sendAndConfirmTransaction(connection, tx, [wallet]);
  return signature;
}

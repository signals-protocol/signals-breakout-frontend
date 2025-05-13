import { BN } from "@coral-xyz/anchor";

export function decodeBuyTokensInstruction(data: number[]): {
  marketId: number;
  binIndices: number[];
  amounts: BN[];
  maxCollateral: BN;
} {
  // 디스크리미네이터 체크
  const discriminator = data.slice(0, 8);
  if (
    ![189, 21, 230, 133, 247, 2, 110, 42].every(
      (v, i) => v === discriminator[i]
    )
  ) {
    throw new Error("Invalid instruction discriminator");
  }

  let offset = 8;

  // marketId (u64)
  const marketId = Number(new BN(data.slice(offset, offset + 8), "le"));
  offset += 8;

  // bin_indices 배열 길이 (u32)
  const binIndicesLength = Number(new BN(data.slice(offset, offset + 4), "le"));
  offset += 4;

  // bin_indices 배열
  const binIndices: number[] = [];
  for (let i = 0; i < binIndicesLength; i++) {
    binIndices.push(Number(new BN(data.slice(offset, offset + 2), "le")));
    offset += 2;
  }

  // amounts 배열 길이 (u32)
  const amountsLength = Number(new BN(data.slice(offset, offset + 4), "le"));
  offset += 4;

  // amounts 배열
  const amounts: BN[] = [];
  for (let i = 0; i < amountsLength; i++) {
    amounts.push(new BN(data.slice(offset, offset + 8), "le"));
    offset += 8;
  }

  // max_collateral (u64)
  const maxCollateral = new BN(data.slice(offset, offset + 8), "le");

  return {
    marketId,
    binIndices,
    amounts,
    maxCollateral,
  };
}
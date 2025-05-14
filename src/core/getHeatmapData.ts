import CORE_PROGRAMS from "./core.programs.config";
import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { addDays } from "date-fns";
import type { RangeBetProgram } from "types/range_bet_program";
import type { HeatmapDatum } from "components/features/home/heatmap/heatmap.type";

export const getHeatmapData = async (
  program: Program<RangeBetProgram>,
  dateBase: Date,
  priceBase: number,
  priceStep: number
): Promise<{
  heatmapData: HeatmapDatum[];
  priceBins: number[];
}> => {
  const collateralMint = new PublicKey(CORE_PROGRAMS.USDC);

  console.log(123)
  // 모든 마켓 PDA 주소 계산
  const marketPDAs = Array.from(
    { length: 31 },
    (_, i) =>
      PublicKey.findProgramAddressSync(
        [Buffer.from("market"), new BN(i).toArrayLike(Buffer, "le", 8)],
        program.programId
      )[0]
  );
  console.log(456)

  // 모든 마켓 정보 한 번에 조회
  const marketInfos = await program.provider.connection.getMultipleAccountsInfo(
    marketPDAs
  );
  console.log(789)


  // 활성화된 마켓만 필터링
  const activeMarkets = marketInfos
    .map((info, index) => {
      if (!info) return null;
      const marketInfo = program.coder.accounts.decode("market", info.data);
      if (!marketInfo.active || marketInfo.closed) return null;
      return { marketId: index, marketInfo, pda: marketPDAs[index] };
    })
    .filter((market): market is NonNullable<typeof market> => market !== null);

  // 활성화된 마켓들의 볼트 정보 조회
  const vaultPromises = activeMarkets.map(
    async ({ marketId, marketInfo, pda }) => {
      const [vaultAuthority] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), new BN(marketId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const vaultTokenAccount = await getAssociatedTokenAddress(
        collateralMint,
        vaultAuthority,
        true
      );

      return {
        marketId,
        marketInfo,
        pda,
        vaultTokenAccount,
      };
    }
  );

  const results = await Promise.all(vaultPromises);

  const binLength = results[0].marketInfo.bins.length;
  const heatmapData = results.map<HeatmapDatum>((result, i) => {
    const date = addDays(dateBase, i);
    return {
      date,
      values: result.marketInfo.bins as BN[],
      state: result.marketInfo.active ? "open" : "closed",
    };
  });

  const priceBins = Array.from(
    { length: binLength },
    (_, i) => priceBase + priceStep * i
  );

  return {
    heatmapData,
    priceBins,
  };
};

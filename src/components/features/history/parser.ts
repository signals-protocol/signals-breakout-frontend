import type { PredictionBase, TokensBought } from "./interfaces";
import { addDays } from "date-fns";
import { avgPriceFormatter, dollarFormatter } from "utils/formatter";
import { timeFormat } from "d3";
import { createPriceBins, getBinRange } from "core/utils";
import PREDICTION_CONSTANTS from "../home/input/constants";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import type { RangeBetProgram } from "types/range_bet_program";
import RANGE_BET_IDL from "idl/range_bet_program.json";
import type { VersionedTransactionResponse } from "@solana/web3.js";
import { decodeBuyTokensInstruction } from "core/decodeBuyTokensInstruction";
import { formatBN, parseBN } from "utils/format-bn";
import { calculateBinSellCost } from "core/calculateBinSellCost";
import pLimit from "p-limit";

export const parsePredictionLogs = async (
  signatures: string[],
  txs: VersionedTransactionResponse[],
  provider: AnchorProvider
  // ): Promise<LivePrediction[]> => {
): Promise<any> => {
  // assume that only one bin is target
  const priceBins = createPriceBins(
    PREDICTION_CONSTANTS.priceBase,
    PREDICTION_CONSTANTS.binCount
  );
  const program = new Program<RangeBetProgram>(RANGE_BET_IDL, provider);

  const preparsedList: PredictionBase[] = [];
  txs.forEach((tx, i) => {
    const dataLine = tx
      .meta!.logMessages!.map((l) => l.replace(/^Program data: /, ""))
      .find((l) => /^[A-Za-z0-9+/=]+$/.test(l));
    if (!dataLine) return;
    const evt = program.coder.events.decode(dataLine);
    if (evt?.name === "tokensBought") {
      const eventLog = evt.data as TokensBought;
      const message = tx!.transaction.message;
      const instr = message.compiledInstructions.find((instr) =>
        message.staticAccountKeys[instr.programIdIndex].equals(
          program.programId
        )
      );
      const decoded = decodeBuyTokensInstruction(Array.from(instr!.data));

      const binIndex = decoded.binIndices[0];
      const range = getBinRange(binIndex, priceBins)!;
      const tickets = decoded.amounts[0];
      const avg = eventLog.totalCost.mul(parseBN("1")).div(tickets);
      const date = addDays(
        PREDICTION_CONSTANTS.dateBase,
        eventLog.marketId.toNumber()
      );
      preparsedList.push({
        range: `${dollarFormatter(range[0], 0, 2)} to ${dollarFormatter(
          range[1],
          0,
          2
        )}`,
        avg: avgPriceFormatter(avg),
        bet: formatBN(eventLog.totalCost),
        toWin: formatBN(tickets),
        date: timeFormat("%-d %b %Y")(date),
        result: null,
        shares: tickets,
        binIndex,
        marketId: eventLog.marketId.toNumber(),
        totalCost: eventLog.totalCost.toString(),
        txHash: signatures[i],
        blockTime: tx!.blockTime!,
        value: "0",
      });
    }
  });

  const limit = pLimit(50);
  const currValues = preparsedList.map(async (prediction) => {
    return limit(async () =>
      calculateBinSellCost(
        provider,
        prediction.marketId,
        prediction.binIndex,
        prediction.shares
      )
    );
  });

  const withCurrValue = await Promise.all(currValues).then((values) => {
    return values.map((v, index) => {
      const value = formatBN(v);
      return {
        ...preparsedList[index],
        value,
      };
    });
  });

  return withCurrValue;
};

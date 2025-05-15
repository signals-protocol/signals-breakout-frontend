import type { LivePrediction, TokensBought } from "./interfaces";
import { addDays } from "date-fns";
import { avgPriceFormatter, dollarFormatter } from "utils/formatter";
import { timeFormat } from "d3";
import { createPriceBins, getBinRange } from "core/utils";
import PREDICTION_CONSTANTS from "../home/input/constants";
import { Program } from "@coral-xyz/anchor";
import type { RangeBetProgram } from "types/range_bet_program";
import type { VersionedTransactionResponse } from "@solana/web3.js";
import { decodeBuyTokensInstruction } from "core/decodeBuyTokensInstruction";
import { formatBN, parseBN } from "utils/format-bn";
import { calculateBinSellCost } from "core/calculateBinSellCost";
import pLimit from "p-limit";

export const parsePredictionLogs = async (
  signatures: string[],
  txs: VersionedTransactionResponse[],
  program: Program<RangeBetProgram>
): Promise<LivePrediction[]> => {
  const priceBins = createPriceBins(
    PREDICTION_CONSTANTS.priceBase,
    PREDICTION_CONSTANTS.binCount
  );

  const preparsedList: LivePrediction[] = [];
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

      const binIndices = decoded.binIndices;
      const range = getBinRange(binIndices, priceBins)!;
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
        bet: formatBN(eventLog.totalCost, 6),
        toWin: formatBN(tickets, 6),
        date: timeFormat("%-d %b %Y")(date),
        result: null,
        shares: tickets,
        binIndices,
        marketId: eventLog.marketId.toNumber(),
        totalCost: eventLog.totalCost.toString(),
        txHash: signatures[i],
        blockTime: tx!.blockTime!,
        value: "0",
      });
    }
  });

  const limit = pLimit(30);
  const currValues = preparsedList.map(async (prediction) => {
    return limit(async () =>
      calculateBinSellCost(
        program,
        prediction.marketId,
        prediction.binIndices,
        prediction.shares
      )
    );
  });

  const withCurrValue = await Promise.all(currValues).then((values) => {
    return values.map((v, index) => {
      const value = formatBN(v, 6);
      return {
        ...preparsedList[index],
        value,
      };
    });
  });

  return withCurrValue;
};

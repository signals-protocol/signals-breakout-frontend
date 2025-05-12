import { useEffect, useMemo, useState } from "react";
import { addDays, differenceInDays } from "date-fns";
import BN from "bn.js";
import type { HeatmapDatum } from "../heatmap/heatmap.type";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getHeatmapData } from "core/getHeatmapData";
import { calculateBinTicket } from "core/calculateBinTicket";
import { parseBN } from "utils/format-bn";
import { getUSDCBalance } from "core/token";

export const usePredictionInput = (
  dateBase: Date,
  priceBase: number,
  binCount: number,
  priceStep: number
) => {
  const [isHeatmap, setIsHeatmap] = useState(true);
  // Date
  const [selectedMarketId, setSelectedMarketId] = useState<number>(6);
  // Price Bin
  const [currentBinId, setCurrentBinId] = useState<number>(0);

  const priceBins = useMemo(
    () => createPriceBins(priceBase, binCount),
    [priceBase, binCount]
  );

  const [tickets, setTickets] = useState<BN>(new BN(0));
  const [amount, setAmount] = useState<string>("1");
  const [balance, setBalance] = useState<number>(0);
  const [heatmapData, setHeatmapData] = useState<HeatmapDatum[]>();
  const [allowance, setAllowance] = useState<BN>(new BN(0));
  const [isMapLoading, setIsMapLoading] = useState<boolean>(false);
  const [isTicketLoading, setIsTicketLoading] = useState<boolean>(false);

  const wallet = useWallet();
  const { connection } = useConnection();

  const refreshBalance = async () => {
    if (wallet.publicKey) {
      getUSDCBalance(connection, wallet.publicKey).then((balance) => {
        setBalance(balance);
      });
    } else {
      setAllowance(new BN(0));
      setBalance(0);
    }
  };

  const refreshMap = async () => {
    setIsMapLoading(true);
    refreshBalance();
    return getHeatmapData(
      connection,
      wallet,
      dateBase,
      priceBase,
      priceStep
    ).then((data) => {
      setHeatmapData(data.heatmapData);
      setIsMapLoading(false);
    });
  };

  useEffect(() => {
    if (currentBinId !== null && heatmapData) {
      setIsTicketLoading(true);
      calculateBinTicket(
        selectedMarketId,
        currentBinId,
        parseBN(amount || "0")
      ).then((res) => {
        setTickets(res);
        setIsTicketLoading(false);
      });
    }
  }, [selectedMarketId, currentBinId, amount, heatmapData]);

  useEffect(() => {
    refreshMap();
  }, []);

  useEffect(() => {
    refreshBalance();
  }, [wallet.publicKey]);

  const currBin: [number, number] = [priceBins[currentBinId], priceBins[currentBinId + 1]];

  const onBinClick = (marketId: number, binId: number) => {
    setCurrentBinId(binId);
    setSelectedMarketId(marketId);
    setIsHeatmap(false);
  };

  return {
    selectedDate: addDays(dateBase, selectedMarketId),
    setSelectedDate: (date: Date) => {
      setSelectedMarketId(differenceInDays(date, dateBase));
    },
    selectedMarketId,
    setSelectedMarketId,
    priceBins,
    binIndices: Array(binCount)
      .fill(0)
      .map((_, i) => i),
    currentBinId,
    setCurrentBinId,
    currBin,
    onBinClick,
    tickets,
    amount,
    setAmount,
    heatmapData,
    shouldApprove: allowance.lt(parseBN(amount || "0")),
    balance,
    isTicketLoading,
    isMapLoading,
    refreshMap,
    isHeatmap,
    setIsHeatmap,
  };
};

function createPriceBins(startPrice: number, length: number) {
  return Array.from({ length: length + 1 }, (_, i) => startPrice + i * 500);
}

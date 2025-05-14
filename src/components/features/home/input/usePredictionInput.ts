import BN from "bn.js";
import { useEffect, useMemo, useState } from "react";
import { addDays, differenceInDays } from "date-fns";
import type { HeatmapDatum } from "../heatmap/heatmap.type";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getHeatmapData } from "core/getHeatmapData";
import { calculateBinShares } from "core/calculateBinShares";
import { parseBN } from "utils/format-bn";
import { getUSDCBalance } from "core/token";
import { createPriceBins, getBinRange } from "core/utils";

export const usePredictionInput = (
  dateBase: Date,
  priceBase: number,
  binCount: number,
  priceStep: number
) => {
  const [isHeatmap, setIsHeatmap] = useState(true);
  // Date
  const [selectedMarketId, setSelectedMarketId] = useState<number>(6);
  const [currentBins, setCurrentBins] = useState<number[]>([0]);

  const priceBins = useMemo(
    () => createPriceBins(priceBase, binCount),
    [priceBase, binCount]
  );

  const [tickets, setTickets] = useState<BN>(new BN(0));
  const [amount, setAmount] = useState<string>("1");
  const [balance, setBalance] = useState<number>(0);
  const [heatmapData, setHeatmapData] = useState<HeatmapDatum[]>();
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
    if (currentBins.length > 0 && heatmapData) {
      setIsTicketLoading(true);
      const shares = calculateBinShares(
        selectedMarketId,
        currentBins,
        parseBN(amount || "0"),
        heatmapData
      );
      setTickets(shares);
      setIsTicketLoading(false);
    }
  }, [selectedMarketId, currentBins, amount, heatmapData]);

  useEffect(() => {
    refreshMap();
  }, []);

  useEffect(() => {
    refreshBalance();
  }, [wallet.publicKey]);

  const currRange: [number, number] = getBinRange(currentBins, priceBins);
  const onBinClick = (marketId: number, binId: number) => {
    setCurrentBins([binId]);
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
    currentBins,
    setCurrentBins,
    currRange,
    onBinClick,
    tickets,
    amount,
    setAmount,
    heatmapData,
    balance,
    isTicketLoading,
    isMapLoading,
    refreshMap,
    isHeatmap,
    setIsHeatmap,
  };
};

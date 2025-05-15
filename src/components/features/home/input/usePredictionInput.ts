import BN from "bn.js";
import { useEffect, useMemo, useState } from "react";
import { addDays, differenceInDays } from "date-fns";
import { getHeatmapData } from "core/getHeatmapData";
import { calculateBinShares } from "core/calculateBinShares";
import { parseBN } from "utils/format-bn";
import { createPriceBins, getBinRange } from "core/utils";
import { useProgram } from "core/useProgram";
import type { HeatmapDatum } from "../heatmap/heatmap.type";
import useBalance from "states/balance.state";

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
  const [cost, setCost] = useState<string>("1");
  const [heatmapData, setHeatmapData] = useState<HeatmapDatum[]>();
  const [isMapLoading, setIsMapLoading] = useState<boolean>(false);
  const [isTicketLoading, setIsTicketLoading] = useState<boolean>(false);

  const { wallet, program } = useProgram();
  const { balance, refreshBalance } = useBalance();

  const refreshMap = async () => {
    setIsMapLoading(true);
    refreshBalance();
    return getHeatmapData(program, dateBase, priceBase, priceStep).then(
      (data) => {
        setHeatmapData(data.heatmapData);
        setIsMapLoading(false);
      }
    );
  };

  useEffect(() => {
    if (currentBins.length > 0 && heatmapData) {
      setIsTicketLoading(true);
      const shares = calculateBinShares(
        selectedMarketId,
        currentBins,
        parseBN(cost || "0", 6),
        heatmapData
      );
      setTickets(shares);
      setIsTicketLoading(false);
    }
  }, [selectedMarketId, currentBins, cost, heatmapData]);

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
    cost,
    setCost,
    heatmapData,
    balance,
    isTicketLoading,
    isMapLoading,
    refreshMap,
    isHeatmap,
    setIsHeatmap,
  };
};

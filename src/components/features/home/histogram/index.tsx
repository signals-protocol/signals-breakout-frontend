import CHART_CONFIG from "../heatmap/chart.config";
import type { HeatmapDatum } from "../heatmap/heatmap.type";
import { HistogramRow } from "./HistogramRow";
import { useDragInput } from "./useDragInput";

interface HistogramProps {
  priceBins: number[];
  binIndices: number[];
  heatmapData: HeatmapDatum[];
  selectedMarketId: number;
  currentBins: number[];
  setCurrentBins: (bins: number[]) => void;
}

const Histogram = ({
  binIndices,
  priceBins,
  heatmapData,
  selectedMarketId,
  currentBins,
  setCurrentBins,
}: HistogramProps) => {
  if (!heatmapData) return null;
  const marketData = heatmapData[selectedMarketId];

  const {
    scrollContainerRef,
    selectedBinRef,
    reversedBinIndices,
    totalShares,
    maxShare,
    handlers,
  } = useDragInput({
    binIndices,
    currentBins,
    setCurrentBins,
    selectedMarketId,
    marketData,
  });

  return (
    <div
      className="w-full"
      style={{ height: CHART_CONFIG.height }}
      onMouseUp={handlers.handleMouseUp}
      onMouseLeave={handlers.handleMouseUp}
    >
      <div className="flex font-medium text-sm my-2">
        <div className="flex-1">PREDICTION</div>
        <div className="w-48 pl-4">SHARES</div>
      </div>

      <div
        ref={scrollContainerRef}
        className="space-y-px overflow-y-auto h-[calc(100%-2rem)]"
        style={{ maxHeight: "calc(100% - 2rem)" }}
      >
        {reversedBinIndices.map((binIndex) => {
          return (
            <HistogramRow
              key={binIndex}
              binIndex={binIndex}
              priceBins={priceBins}
              marketData={marketData}
              totalShares={totalShares}
              selected={currentBins.includes(binIndex)}
              selectedBinRef={selectedBinRef}
              maxShare={maxShare}
              onMouseDown={() => handlers.handleMouseDown(binIndex)}
              onMouseEnter={() => handlers.handleMouseEnter(binIndex)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Histogram;

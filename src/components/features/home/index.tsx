import HeatmapChart from "./heatmap/HeatmapChart";
import ToggleChartSwitch from "./ToggleChartSwitch";
import { DatePickerItem } from "./DatePickerItem";
import Histogram from "./histogram";
import PredictionInput from "./input";
import PREDICTION_CONSTANTS from "./input/constants";
import { usePredictionInput } from "./input/usePredictionInput";

export default function Home() {
  const {
    isHeatmap, setIsHeatmap,
    selectedDate, setSelectedDate,
    selectedMarketId,
    currentBins, setCurrentBins, currRange, binIndices,
    amount, setAmount,
    heatmapData,
    priceBins,
    onBinClick,
    tickets,
    balance,
    isTicketLoading,
    refreshMap,
  } = usePredictionInput(
    PREDICTION_CONSTANTS.dateBase,
    PREDICTION_CONSTANTS.priceBase,
    PREDICTION_CONSTANTS.binCount,
    PREDICTION_CONSTANTS.priceStep
  );
  return (
    <div className="flex flex-col gap-2 py-9">
      <div className="flex gap-2">
        <ToggleChartSwitch isHeatmap={isHeatmap} setIsHeatmap={setIsHeatmap} />
        <DatePickerItem
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      <div className="flex gap-12">
        <div className="flex flex-[2.5]">
          {heatmapData &&
            (isHeatmap ? (
              <HeatmapChart
                data={heatmapData}
                priceBins={priceBins}
                onBinClick={onBinClick}
              />
            ) : (
              <Histogram
                binIndices={binIndices}
                priceBins={priceBins}
                heatmapData={heatmapData}
                selectedMarketId={selectedMarketId}
                currentBins={currentBins}
                setCurrentBins={setCurrentBins}
                // onBinClick={onBinClick}
              />
            ))}
        </div>
        <div className="min-w-[340px]">
          <PredictionInput
            heatmapData={heatmapData}
            tickets={tickets}
            selectedMarketId={selectedMarketId}
            currentBins={currentBins}
            selectedDate={selectedDate}
            currRange={currRange}
            amount={amount}
            setAmount={setAmount}
            balance={balance}
            isTicketLoading={isTicketLoading}
            refreshMap={refreshMap}
          />
        </div>
      </div>
    </div>
  );
}

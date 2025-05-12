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
    currentBinId, currBin, binIndices,
    amount, setAmount,
    heatmapData,
    priceBins,
    onBinClick,
    tickets,
    balance,
    shouldApprove,
    isTicketLoading,
    refreshMap,
  } = usePredictionInput(
    PREDICTION_CONSTANTS.dateBase,
    PREDICTION_CONSTANTS.priceBase,
    61,
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
                currentBinId={currentBinId}
                onBinClick={onBinClick}
              />
            ))}
        </div>
        <div className="min-w-[340px]">
          <PredictionInput
            tickets={tickets}
            selectedMarketId={selectedMarketId}
            currentBinId={currentBinId}
            selectedDate={selectedDate}
            currBin={currBin}
            amount={amount}
            setAmount={setAmount}
            shouldApprove={shouldApprove}
            balance={balance}
            isTicketLoading={isTicketLoading}
            refreshMap={refreshMap}
          />
        </div>
      </div>
    </div>
  );
}

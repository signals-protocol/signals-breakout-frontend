import "react-datepicker/dist/react-datepicker.css";
import useAction from "./useAction";
import cn from "utils/cn";
import BN from "bn.js";
import { InputAmount } from "./InputAmount";
import { avgPriceFormatter, dollarFormatter } from "utils/formatter";
import { ToWin } from "./ToWin";
import { parseBN } from "utils/format-bn";
import type { HeatmapDatum } from "../heatmap/heatmap.type";
interface PredictionInputProps {
  shares: BN;
  selectedMarketId: number;
  currentBins: number[];
  selectedDate: Date;
  currRange: [number, number];
  cost: string;
  setCost: (amount: string) => void;
  balance: number;
  isTicketLoading: boolean;
  refreshMap: () => Promise<void>;
  heatmapData?: HeatmapDatum[];
}
export default function PredictionInput({
  selectedMarketId,
  currentBins,
  selectedDate,
  currRange,
  shares,
  cost,
  setCost,
  balance,
  isTicketLoading,
  refreshMap,
  heatmapData,
}: PredictionInputProps) {
  const ZERO = new BN(0);
  const avgPrice = shares.gt(ZERO)
    ? parseBN(cost || "0", 6)
        .mul(parseBN("1"))
        .div(shares)
    : ZERO;
  const action = useAction({
    currentBins,
    selectedMarketId,
    collateral: cost,
    shares: shares,
    refreshMap,
    marketInfo: heatmapData?.[selectedMarketId],
  });

  const avgPriceText = avgPriceFormatter(avgPrice);
  return (
    <div className="rounded-xl border border-neutral-200 p-5">
      <div>
        <p className="text-neutral-500 font-medium">Prediction</p>
        <div className="flex justify-between mb-5">
          {currRange ? (
            <div className="font-bold text-xl">
              <p className="underline">
                {dollarFormatter(currRange[0])} ~{" "}
                {dollarFormatter(currRange[1])}
              </p>
              <p>
                on{" "}
                <u>
                  {selectedDate.getDate()}{" "}
                  {selectedDate.toLocaleString("en-US", { month: "short" })}{" "}
                  {selectedDate.getFullYear()}
                </u>
              </p>
            </div>
          ) : (
            <p className="font-bold text-xl">Select your Prediction</p>
          )}
        </div>

        <hr className="border-neutral-200" />

        <div className="flex justify-between my-5">
          <p className="text-neutral-500 font-medium">avg price</p>
          <p className="text-neutral-900 text-xl font-bold">
            {isTicketLoading ? `...` : avgPriceText}
          </p>
        </div>

        <hr className="border-neutral-200" />

        <InputAmount amount={cost} setAmount={setCost} balance={balance} />

        <hr className="border-neutral-200" />

        <ToWin
          isTicketLoading={isTicketLoading}
          shares={shares}
          avgPriceText={avgPriceText}
        />
      </div>

      {/* 베팅 버튼! */}
      <button
        onClick={action.onClick}
        className={cn(
          action.state === "done" ? "btn-secondary" : "btn-primary",
          "w-full"
        )}
        disabled={action.state === "predict-loading"}
      >
        {action.msg}
      </button>
    </div>
  );
}

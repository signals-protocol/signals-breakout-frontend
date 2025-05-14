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
  tickets: BN;
  selectedMarketId: number;
  currentBins: number[];
  selectedDate: Date;
  currRange: [number, number];
  amount: string;
  setAmount: (amount: string) => void;
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
  tickets,
  amount,
  setAmount,
  balance,
  isTicketLoading,
  refreshMap,
  heatmapData,
}: PredictionInputProps) {
  const ZERO = new BN(0);
  const avgPrice = tickets.gt(ZERO)
    ? parseBN(amount || "0")
        .mul(parseBN("1"))
        .div(tickets)
    : ZERO;
  const action = useAction({
    currentBins,
    selectedMarketId,
    collateral: amount,
    shares: tickets,
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
                {dollarFormatter(currRange[0])} ~ {dollarFormatter(currRange[1])}
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

        <InputAmount amount={amount} setAmount={setAmount} balance={balance} />

        <hr className="border-neutral-200" />

        <ToWin
          isTicketLoading={isTicketLoading}
          tickets={tickets}
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

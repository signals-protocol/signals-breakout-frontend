import "react-datepicker/dist/react-datepicker.css";
import useAction from "./useAction";
import cn from "utils/cn";
import BN from "bn.js";
import { InputAmount } from "./InputAmount";
import { avgPriceFormatter, dollarFormatter } from "utils/formatter";
import { ToWin } from "./ToWin";
import { parseBN } from "utils/format-bn";

interface PredictionInputProps {
  tickets: BN;
  selectedMarketId: number;
  currentBinId: number;
  selectedDate: Date;
  currBin: [number, number];
  amount: string;
  setAmount: (amount: string) => void;
  balance: number;
  isTicketLoading: boolean;
  refreshMap: () => Promise<void>;
}
export default function PredictionInput({
  selectedMarketId,
  currentBinId,
  selectedDate,
  currBin,
  tickets,
  amount,
  setAmount,
  balance,
  isTicketLoading,
  refreshMap,
}: PredictionInputProps) {
  const ZERO = new BN(0);
  const avgPrice = tickets.gt(ZERO)
    ? parseBN(amount || "0")
        .mul(parseBN("1"))
        .div(tickets)
    : ZERO;
  const action = useAction({
    currentBinId,
    selectedMarketId,
    amount,
    refreshMap,
  });

  const avgPriceText = avgPriceFormatter(avgPrice);
  return (
    <div className="rounded-xl border border-neutral-200 p-5">
      <div>
        <p className="text-neutral-500 font-medium">Prediction</p>
        <div className="flex justify-between mb-5">
          {currBin ? (
            <div className="font-bold text-xl">
              <p className="underline">
                {dollarFormatter(currBin[0])} ~ {dollarFormatter(currBin[1])}
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

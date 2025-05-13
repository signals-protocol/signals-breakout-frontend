import { useState } from "react";
import { ShareModal } from "./ShareModal";
import { dollarFormatter } from "utils/formatter";
import type { LivePrediction } from "./interfaces";
import PREDICTION_CONSTANTS from "../home/input/constants";
import { formatBN } from "utils/format-bn";

interface LivePredictionRowProps {
  prediction: LivePrediction;
}

export function LivePredictionRow({ prediction }: LivePredictionRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const pnl = Number(prediction.value) - Number(prediction.bet);
  const pnlPercentage =
    Number(prediction.bet) !== 0 ? (pnl / Number(prediction.bet)) * 100 : 0;
  const isPnlPositive = pnl >= 0;

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-bold text-neutral-900">
          <u className="mr-1">{prediction.range}</u> on{" "}
          <u className="ml-1">{prediction.date}</u>
        </div>
        <div className="text-sm text-neutral-500">
          {(+formatBN(prediction.shares)).toFixed(2)} Shares
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {prediction.avg}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {dollarFormatter(prediction.bet)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <p className="mb-1">{dollarFormatter(prediction.value)}</p>

        <span
          className={`font-medium ${
            isPnlPositive ? "text-success" : "text-red-500"
          }`}
        >
          {isPnlPositive ? "+" : ""}
          {pnl.toFixed(2)} ({isPnlPositive ? "+" : ""}
          {pnlPercentage.toFixed(2)}%)
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {dollarFormatter(prediction.toWin)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex gap-2">
          <button className="btn-primary rounded h-8 py-0">Sell</button>
          <a
            href={`${PREDICTION_CONSTANTS.explorer}tx/${prediction.txHash}${
              PREDICTION_CONSTANTS.network === "devnet" ? "?cluster=devnet" : ""
            }`}
            target="_blank"
            rel="noopener noreferrer"
            className="border w-8 h-8 flex items-center justify-center rounded"
          >
            <img src={`/images/world.png`} alt="world" className="w-4 h-4" />
          </a>
          <div
            onClick={openModal}
            className="border w-8 h-8 flex items-center justify-center rounded"
          >
            <img
              src={`/images/share.png`}
              alt="share"
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        </div>
        {isModalOpen && (
          <ShareModal
            onClose={closeModal}
            predictionData={{
              date: prediction.date,
              predictedDaysAgo: "3 days ago",
              amount: dollarFormatter(+prediction.value - +prediction.bet),
              pnlPercentage,
            }}
          />
        )}
      </td>
    </tr>
  );
}

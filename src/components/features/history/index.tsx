import { useEffect, useState } from "react";
import HistoryHeader from "./HistoryHeader";
import { Tabs, type TabType } from "./Tabs";
import type { LivePrediction } from "./interfaces";
import { LivePredictionRow } from "./LivePredictionRow";
import { dollarFormatter } from "utils/formatter";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import CORE_PROGRAMS from "core/core.programs.config";
import pLimit from "p-limit";
import { parsePredictionLogs } from "./parser"; 

const PredictionHistory = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [items, setItems] = useState<LivePrediction[]>([]);

  useEffect(() => {
    if (!wallet.publicKey) return;

    getPredictionHistory(wallet.publicKey);
  }, [wallet.publicKey]);

  async function getPredictionHistory(publicKey: PublicKey) {
    const programId = new PublicKey(CORE_PROGRAMS.RANGE_BET);
    const programLogs = await connection.getSignaturesForAddress(programId, {
      limit: 500,
    });
    const userLogs = await connection.getSignaturesForAddress(publicKey, {
      limit: 100,
    });
    const intersection = programLogs.filter((log) =>
      userLogs.some((userLog) => userLog.signature === log.signature)
    );
    const limit = pLimit(30);
    const promises = intersection.map(async (log) =>
      limit(async () => {
        const tx = await connection.getTransaction(log.signature, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        });
        return tx!;
      })
    );
    const results = await Promise.all(promises).then((res) =>
      res.filter((r) => r!.meta !== null)
    );

    const parsed = await parsePredictionLogs(
      intersection.map((log) => log.signature),
      results,
      connection,
      wallet
    );
    setItems(parsed);
  }

  const [activeTab, setActiveTab] = useState<TabType>("Live");

  const totalPosition = items.reduce(
    (acc, item) => acc + Number(item.value),
    0
  );
  const totalBet = items.reduce((acc, item) => acc + Number(item.bet), 0);
  const totalPnl = totalPosition - totalBet;

  return (
    <div className="pb-40">
      <HistoryHeader />

      {/* 탭 네비게이션 */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 요약 정보 */}
      <div className="grid grid-cols-4 gap-5 my-[60px]">
        <div className="border border-neutral-200 p-4 rounded-lg">
          <p className="text-sm text-neutral-500">Position value</p>
          <p className="text-lg font-semibold">
            {dollarFormatter(totalPosition)}
          </p>
        </div>
        <div className="border border-neutral-200 p-4 rounded-lg">
          <p className="text-sm text-neutral-500">Profit and Loss</p>
          <p
            className={`text-lg font-semibold ${
              totalPnl > 0 ? "text-success" : "text-red-500"
            }`}
          >
            {dollarFormatter(totalPnl)}
          </p>
        </div>
        <div className="border border-neutral-200 p-4 rounded-lg">
          <p className="text-sm text-neutral-500">Volume traded</p>
          <p className="text-lg font-semibold">{dollarFormatter(totalBet)}</p>
        </div>
        <div className="border border-neutral-200 p-4 rounded-lg">
          <p className="text-sm text-neutral-500">
            # of Prediction{activeTab === "Ended" ? " (Win-Loss)" : ""}
          </p>
          <p className="text-lg font-semibold">{items.length}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="font-bold text-sm text-neutral-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Prediction
              </th>
              {activeTab === "Ended" && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Result
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                AVG
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                BET
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                VALUE
              </th>
              {activeTab === "Live" && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  TO WIN
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"></th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-neutral-200">
            {items.map((item, index) => (
              <LivePredictionRow key={index} prediction={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionHistory;

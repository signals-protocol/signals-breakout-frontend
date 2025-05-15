import { useEffect, useState } from "react";
import HistoryHeader from "./HistoryHeader";
import { Tabs, type TabType } from "./Tabs";
import type { LivePrediction } from "./interfaces";
import { LivePredictionRow } from "./LivePredictionRow";
import { dollarFormatter } from "utils/formatter";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import CORE_PROGRAMS from "core/core.programs.config";
import pLimit from "p-limit";
import { parsePredictionLogs } from "./parser";
import { useProgram } from "core/useProgram";
import { NavLink } from "react-router";
import ROUTES from "routes/route-names";

const PredictionHistory = () => {
  const wallet = useWallet();
  const { connection, program } = useProgram();

  const [items, setItems] = useState<LivePrediction[] | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<TabType>("Live");

  useEffect(() => {
    if (!wallet.publicKey) return;

    getPredictionHistory(wallet.publicKey);
  }, [wallet.publicKey]);

  async function getPredictionHistory(publicKey: PublicKey) {
    try {
      const programId = new PublicKey(CORE_PROGRAMS.RANGE_BET);
      const programLogs = await connection.getSignaturesForAddress(programId, {
        limit: 100,
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
        program
      );
      setItems(parsed);
    } catch (error) {
      console.error("Error fetching prediction history:", error);
      setItems([]);
    }
  }

  // 로딩 중일 때 표시할 스피너 컴포넌트
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  // 데이터가 없을 때 표시할 컴포넌트
  const EmptyState = () => (
    <div className="flex flex-col justify-center items-center py-20">
      <svg
        className="w-16 h-16 text-neutral-300 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        ></path>
      </svg>
      <p className="text-lg font-medium text-neutral-500">No betting history</p>
      <NavLink
        to={ROUTES.HOME}
        className="text-sm text-neutral-400 mt-2 underline"
      >
        Start a new bet on the main page
      </NavLink>
    </div>
  );

  // items가 undefined면 로딩 중
  if (items === undefined) {
    return (
      <div className="pb-40">
        <HistoryHeader />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <LoadingSpinner />
      </div>
    );
  }

  const totalPosition =
    items.length > 0
      ? items.reduce((acc, item) => acc + Number(item.value), 0)
      : 0;

  const totalBet =
    items.length > 0
      ? items.reduce((acc, item) => acc + Number(item.bet), 0)
      : 0;

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

      {items.length === 0 ? (
        <EmptyState />
      ) : (
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
      )}
    </div>
  );
};

export default PredictionHistory;

import type BN from "bn.js";
import type { HeatmapDatum } from "../heatmap/heatmap.type";
import cn from "utils/cn";
import { formatBN } from "utils/format-bn";
import { toShare } from "core/utils";

interface HistogramRowProps {
  priceBins: number[];
  binIndex: number;
  marketData: HeatmapDatum;
  totalShares: BN;
  selected: boolean;
  selectedBinRef: React.RefObject<HTMLDivElement | null>;
  maxShare: number;
  onMouseDown: () => void;
  onMouseEnter: () => void;
}

export function HistogramRow({
  binIndex,
  priceBins,
  marketData,
  totalShares,
  maxShare,
  selected,
  selectedBinRef,
  onMouseDown,
  onMouseEnter,
}: HistogramRowProps) {
  const min = priceBins[binIndex];
  const max = priceBins[binIndex + 1];
  const share = toShare(marketData.values[binIndex], totalShares);
  return (
    <div
      key={binIndex}
      ref={selected ? selectedBinRef : undefined}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      className={cn(
        "flex h-10 cursor-pointer",
        selected
          ? "bg-bitcoin/20"
          : "group hover:bg-primary-50 hover:bg-opacity-50"
      )}
    >
      <div className="flex-1 relative w-full">
        <div
          className={cn(
            "font-medium h-full transition-all duration-300 ease-in-out",
            selected
              ? "bg-bitcoin opacity-100"
              : "bg-primary-200 opacity-50 group-hover:bg-primary-200 group-hover:opacity-100"
          )}
          style={{
            width: `${maxShare > 0 ? (100 * share) / maxShare : 0}%`,
          }}
        />
        <div
          className={cn(
            "absolute inset-0 flex items-center pl-4 select-none",
            selected
              ? "text-black font-bold"
              : " text-neutral-400 group-hover:text-neutral-800 group-hover:font-bold"
          )}
        >
          ${min.toLocaleString()} ~ ${max.toLocaleString()}
        </div>
      </div>
      <div className="flex items-center w-48 pl-4 select-none">
        <p
          className={
            selected
              ? "text-black font-bold"
              : " text-neutral-400 group-hover:text-neutral-800 group-hover:font-bold"
          }
        >
          {share}% ({(+formatBN(marketData.values[binIndex])).toFixed(2)})
        </p>
      </div>
    </div>
  );
}

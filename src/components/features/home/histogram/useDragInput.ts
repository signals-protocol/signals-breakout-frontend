import BN from "bn.js";
import { toShare } from "core/utils";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";

import type { HeatmapDatum } from "../heatmap/heatmap.type";

interface UseDragInputProps {
  binIndices: number[];
  currentBins: number[];
  setCurrentBins: (bins: number[]) => void;
  selectedMarketId: number;
  marketData: HeatmapDatum;
}
export const useDragInput = ({
  binIndices,
  currentBins,
  setCurrentBins,
  selectedMarketId,
  marketData,
}: UseDragInputProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedBinRef = useRef<HTMLDivElement>(null);

  // 드래그 멀티 선택 상태
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragCurrent, setDragCurrent] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isInitialRender = useRef(true);
  const prevSelectedBinsRef = useRef<number[]>([]);

  const reversedBinIndices = useMemo(() => [...binIndices].reverse(), [binIndices]);
  const totalShares = useMemo(() => 
    marketData.values.reduce(
      (acc, curr) => acc.add(curr),
      new BN(0)
    ), [marketData.values]
  );
  const shares = useMemo(() => 
    reversedBinIndices.map((binIndex) =>
      toShare(marketData.values[binIndex], totalShares)
    ), [reversedBinIndices, marketData.values, totalShares]
  );
  const maxShare = useMemo(() => Math.max(...shares), [shares]);

  // 배열이 같은지 비교하는 함수
  const areArraysEqual = useCallback((arr1: number[], arr2: number[]) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  }, []);

  // 드래그 중 선택된 bin 계산 및 업데이트
  useEffect(() => {
    // 초기 렌더링 무시
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    // 드래그 중일 때만 선택 영역 업데이트
    if (isDragging && dragStart !== null && dragCurrent !== null) {
      const startIdx = reversedBinIndices.indexOf(dragStart);
      const endIdx = reversedBinIndices.indexOf(dragCurrent);
      if (startIdx !== -1 && endIdx !== -1) {
        const [from, to] =
          startIdx < endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
        
        const newSelectedBins = reversedBinIndices.slice(from, to + 1).sort();
        
        // 이전 선택과 새 선택이 다를 때만 업데이트
        if (!areArraysEqual(prevSelectedBinsRef.current, newSelectedBins)) {
          prevSelectedBinsRef.current = newSelectedBins;
          setCurrentBins(newSelectedBins.sort());
        }
      }
    }
  }, [dragCurrent, isDragging, dragStart, reversedBinIndices, setCurrentBins, areArraysEqual]);

  // 마우스 이벤트 핸들러
  const handleMouseDown = useCallback((binIndex: number) => {
    setIsDragging(true);
    setDragStart(binIndex);
    setDragCurrent(binIndex);
    const newSelectedBins = [binIndex];
    prevSelectedBinsRef.current = newSelectedBins;
    setCurrentBins(newSelectedBins);
  }, [setCurrentBins]);

  const handleMouseEnter = useCallback((binIndex: number) => {
    if (isDragging && dragStart !== null) {
      setDragCurrent(binIndex);
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
  }

  // 선택된 bin으로 스크롤
  useEffect(() => {
    if (
      currentBins.length > 0 &&
      scrollContainerRef.current &&
      selectedBinRef.current
    ) {
      const timeoutId = setTimeout(() => {
        if (selectedBinRef.current) {
          selectedBinRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [currentBins, selectedMarketId]);

  return {
    scrollContainerRef,
    selectedBinRef,
    reversedBinIndices,
    totalShares,
    maxShare,
    handlers: {
      handleMouseDown,
      handleMouseEnter,
      handleMouseUp,
    },
  };
};

interface ToggleChartSwitchProps {
  isHeatmap: boolean;
  setIsHeatmap: (isHeatmap: boolean) => void;
}

export default function ToggleChartSwitch({
  isHeatmap,
  setIsHeatmap,
}: ToggleChartSwitchProps) {
  console.log(isHeatmap);
  return (
    <div className="relative flex gap-1 w-[76px] p-1 h-10 bg-neutral-100 rounded-lg cursor-pointer">
      <div
        className={`
          absolute top-1 bottom-1 w-8 bg-white rounded-md pointer-events-none
          flex items-center justify-center z-5
          transition-transform duration-300
          ${isHeatmap ? "translate-x-0" : "translate-x-[calc(100%+4px)]"}
        `}
      />

      <div
        className="w-8 h-8 p-[6.5px] z-10 rounded-lg cursor-pointer"
        onClick={() => setIsHeatmap(true)}
      >
        <div className="m-auto grid grid-cols-3 gap-[2px] [&>div]:w-[5px] [&>div]:h-[5px] [&>div]:rounded-sm">
          {/* 윗줄(검정) */}
          <div className="w-2 h-2 bg-black rounded-sm" />
          <div className="w-2 h-2 bg-gray-400 rounded-sm" />
          <div className="w-2 h-2 bg-gray-400 rounded-sm" />
          {/* 중간줄(검정) */}
          <div className="w-2 h-2 bg-black rounded-sm" />
          <div className="w-2 h-2 bg-gray-400 rounded-sm" />
          <div className="w-2 h-2 bg-gray-400 rounded-sm" />
          {/* 아랫줄(회색) */}
          <div className="w-2 h-2 bg-gray-400 rounded-sm" />
          <div className="w-2 h-2 bg-gray-400 rounded-sm" />
          <div className="w-2 h-2 bg-gray-400 rounded-sm" />
        </div>
      </div>

      <div
        onClick={() => setIsHeatmap(false)}
        className="bg-transparent w-8 h-8 z-10 rounded-lg flex flex-col justify-center space-y-0.5 p-1.5 cursor-pointer"
      >
        <div className="rounded-full w-2.5 h-1 bg-black" />
        <div className="rounded-full w-5 h-1 bg-black" />
        <div className="rounded-full w-1 h-1 bg-gray-500" />
      </div>
    </div>
  );
}

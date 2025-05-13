import type BN from "bn.js";
import { formatBN } from "utils/format-bn";
import { dollarFormatter } from "utils/formatter";

export const ToWin = ({
  isTicketLoading,
  tickets,
  avgPriceText,
}: {
  isTicketLoading: boolean;
  tickets: BN;
  avgPriceText: string;
}) => {
  return (
    <div className="flex justify-between my-5">
      <div>
        <p className="text-neutral-500 font-medium">To win</p>
        <p className="text-neutral-500 text-sm">Avg {avgPriceText}</p>
      </div>
      <p className="text-positive font-bold text-xl">
        {isTicketLoading ? `...` : `${dollarFormatter(formatBN(tickets))}`}
      </p>
    </div>
  );
};

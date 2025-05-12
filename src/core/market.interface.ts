import type BN from "bn.js";

export interface Market {
  active: boolean;
  closed: boolean;
  tick_spacing: number;
  min_tick: BN;
  max_tick: BN;
  t_total: BN;
  collateral_balance: BN;
  winning_bin: number | null;
  open_ts: BN;
  close_ts: BN;
  bins: BN[];
}

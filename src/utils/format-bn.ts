import BN from "bn.js";
/**
 * 정수 (BN) → 소수점 문자열 (예: 1000000000 → "1.0")
 */
export function formatBN(amount: BN, decimals = 9): string {
  const base = new BN(10).pow(new BN(decimals));
  const whole = amount.div(base).toString();
  const fraction = amount.mod(base).toString().padStart(decimals, "0");
  return `${whole}.${fraction}`.replace(/\.?0+$/, "");
}

/**
 * 소수점 문자열 → 정수 (BN) (예: "1.23" → 1230000000)
 */
export function parseBN(amountStr: string, decimals = 9): BN {
  const [wholeStr, fracStr = ""] = amountStr.split(".");
  const whole = new BN(wholeStr);
  const frac = new BN((fracStr + "0".repeat(decimals)).slice(0, decimals));
  const base = new BN(10).pow(new BN(decimals));
  return whole.mul(base).add(frac);
}

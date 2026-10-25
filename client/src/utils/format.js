// 5650 → "LKR 5,650.00"
export const formatLKR = (n) =>
  `LKR ${Number(n).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
export function formatYen(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '¥0';
  }
  // Convert float dollars/smaller amounts (<100) to Japanese Yen scale (e.g. 16.99 -> 1699)
  const yenAmount = amount < 100 ? Math.round(amount * 100) : Math.round(amount);
  return `¥${yenAmount.toLocaleString('ja-JP')}`;
}

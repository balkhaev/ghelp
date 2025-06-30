/**
 * Возвращает CSS-класс бейджа силы билда.
 * Выделено в отдельный файл, чтобы не дублировать логику.
 */
export type PowerValue = string | number | null | undefined;

export function getPowerBadgeClass(powerVal: PowerValue): string {
  if (powerVal === null || powerVal === undefined) {
    return "bg-muted text-foreground";
  }

  if (typeof powerVal === "string") {
    // оставляем только цифры
    const digits = powerVal.replace(/\D/g, "");

    // 3 и 4 вместе – показываем градиент
    if (digits === "34" || digits === "43") {
      return "bg-gradient-to-r from-yellow-400 to-green-500 text-black";
    }

    // используем первую цифру для числа
    if (digits.length > 0) {
      powerVal = Number(digits[0]);
    }
  }

  const p = typeof powerVal === "number" ? powerVal : Number(powerVal);
  if (isNaN(p)) return "bg-muted text-foreground";
  if (p >= 5) return "bg-red-600 text-white";
  if (p === 4) return "bg-yellow-400 text-black";
  if (p === 3) return "bg-green-600 text-white";
  if (p === 2) return "bg-gray-500 text-white";
  return "bg-muted text-foreground";
}

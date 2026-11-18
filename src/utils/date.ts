/** Начало суток (00:00:00.000 по локальному времени) для переданной даты. */
export const startOfDay = (date: Date | number): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const pad = (n: number): string => String(n).padStart(2, '0');

/** timestamp -> "dd.mm.yyyy" */
export const formatDate = (timestamp: number): string => {
  const d = new Date(timestamp);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
};

const DATE_RE = /^(\d{2})\.(\d{2})\.(\d{4})$/;

/**
 * "dd.mm.yyyy" -> timestamp начала этих суток.
 * Возвращает null, если строка не в формате или дата невалидна (например 31.02.2025).
 */
export const parseDate = (value: string): number | null => {
  const match = DATE_RE.exec(value.trim());
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm) - 1;
  const year = Number(yyyy);
  const d = new Date(year, month, day);
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) {
    return null;
  }
  return d.getTime();
};

/** Маска ввода даты: оставляет только цифры и расставляет точки -> "dd.mm.yyyy" */
export const maskDate = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join('.');
};

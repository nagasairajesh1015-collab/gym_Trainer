export const toKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export function startOfWeek(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return addDays(d, -((d.getDay() + 6) % 7)); // Monday start
}
export function weekDates(date = new Date()) {
  const s = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(s, i));
}
export const fmt = (d, o) => d.toLocaleDateString('en-GB', o);

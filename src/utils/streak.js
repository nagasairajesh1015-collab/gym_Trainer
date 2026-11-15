import { toKey, addDays } from './dates.js';
// Consecutive completed training days ending today (or yesterday). Sundays are rest days and don't break a streak.
export function streak(completed, today = new Date()) {
  let d = completed[toKey(today)] ? today : addDays(today, -1);
  let n = 0;
  for (let guard = 0; guard < 4000; guard++) {
    if ((d.getDay() + 6) % 7 === 6) { d = addDays(d, -1); continue; }
    if (!completed[toKey(d)]) break;
    n++; d = addDays(d, -1);
  }
  return n;
}

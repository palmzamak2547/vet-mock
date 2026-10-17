// Numbers, times and dates the way a Thai reader expects them.

export const num = (n) => (Number.isFinite(n) ? n.toLocaleString('th-TH') : '–');

export const pct = (x, digits = 0) => (Number.isFinite(x) ? `${(x * 100).toFixed(digits)}%` : '–');

const two = (n) => String(n).padStart(2, '0');

/** A countdown face: "1:04:09" past an hour, "04:09" under it. */
export function clock(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h ? `${h}:${two(m)}:${two(sec)}` : `${two(m)}:${two(sec)}`;
}

/** "1 ชั่วโมง 12 นาที", "12 นาที", "40 วินาที". */
export function duration(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s} วินาที`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} นาที`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h} ชั่วโมง ${rest} นาที` : `${h} ชั่วโมง`;
}

/** "17 ต.ค. 2569": the Thai locale writes the Buddhist year itself. */
/** A 'YYYY-MM-DD' day in Thai, read as a calendar day so no time zone can move it. */
export function thaiDay(iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('th-TH', opts);
}

export const thaiDate = (ts) => new Date(ts).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });

export const thaiDateTime = (ts) => new Date(ts).toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

/** "พ.ศ. 2558–2568" from { from, to }. */
export function yearRange(years) {
  if (!years) return null;
  return years.from === years.to ? `พ.ศ. ${years.from}` : `พ.ศ. ${years.from}–${years.to}`;
}

/** Plate numbers as the wall prints them: "Pl. 07". */
export const plateNo = (n) => `Pl. ${two(n)}`;

export const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

/** A document's file name as a title: underscores read as spaces, no trailing dots. */
export const docTitle = (t) => String(t).replace(/_+/g, ' ').replace(/[\s.]*\.{2,}\s*$/, '').replace(/\s{2,}/g, ' ').trim();

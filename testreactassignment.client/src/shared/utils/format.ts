import type { Lang } from "../contexts/LanguageContext";

/* ─── generic helpers ─────────────────────────────── */

export function getFirst<T = unknown>(
  obj: object | undefined | null,
  keys: string[]
): T | undefined {
  if (!obj) return undefined;
  const rec = obj as Record<string, unknown>;
  for (const k of keys) {
    const v = rec[k];
    if (v !== undefined && v !== null) return v as T;
  }
  return undefined;
}

/* ─── date / time formatting ──────────────────────── */

export function formatDateTimeTH(d?: string | Date): string {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
}

export function formatDateTimeEN(d?: string | Date): string {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export function formatTimeRangeTH(start?: string | Date, end?: string | Date): string {
  if (!start) return "";
  const s = typeof start === "string" ? new Date(start) : start;
  const e = end ? (typeof end === "string" ? new Date(end) : end) : undefined;
  if (Number.isNaN(s.getTime())) return "";
  const datePart = s.toLocaleDateString("th-TH", { dateStyle: "medium" });
  const sTime = s.toLocaleTimeString("th-TH", { timeStyle: "short" });
  const eTime = e && !Number.isNaN(e.getTime()) ? e.toLocaleTimeString("th-TH", { timeStyle: "short" }) : "";
  return eTime ? `${datePart} • ${sTime} - ${eTime}` : `${datePart} • ${sTime}`;
}

export function formatTimeRangeEN(start?: string | Date, end?: string | Date): string {
  if (!start) return "";
  const s = typeof start === "string" ? new Date(start) : start;
  const e = end ? (typeof end === "string" ? new Date(end) : end) : undefined;
  if (Number.isNaN(s.getTime())) return "";
  const datePart = s.toLocaleDateString("en-US", { dateStyle: "medium" });
  const sTime = s.toLocaleTimeString("en-US", { timeStyle: "short" });
  const eTime = e && !Number.isNaN(e.getTime()) ? e.toLocaleTimeString("en-US", { timeStyle: "short" }) : "";
  return eTime ? `${datePart} • ${sTime} - ${eTime}` : `${datePart} • ${sTime}`;
}

/** Compact date+time for table cells (e.g. BookingHistory) */
export function formatLocal(iso: string, lang: Lang): string {
  const d = new Date(iso);
  return d.toLocaleString(lang === "th" ? "th-TH" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/* ─── currency ────────────────────────────────────── */

export function formatTHB(v: number | undefined, lang: Lang): string | undefined {
  if (v === undefined) return undefined;
  return v.toLocaleString(lang === "th" ? "th-TH" : "en-US", { style: "currency", currency: "THB" });
}

/* ─── hour / day helpers ──────────────────────────── */

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatHourRange(st: number, en: number): string {
  return `${pad2(st)}:00 - ${en === 24 ? "24:00" : pad2(en) + ":00"}`;
}

export function daysMaskText(mask: number, lang: Lang): string {
  if (mask === 0) return lang === "th" ? "ทุกวัน" : "Everyday";
  const map: { bit: number; th: string; en: string }[] = [
    { bit: 1, th: "จ.", en: "Mon" },
    { bit: 2, th: "อ.", en: "Tue" },
    { bit: 4, th: "พ.", en: "Wed" },
    { bit: 8, th: "พฤ.", en: "Thu" },
    { bit: 16, th: "ศ.", en: "Fri" },
    { bit: 32, th: "ส.", en: "Sat" },
    { bit: 64, th: "อา.", en: "Sun" }
  ];
  return map.filter(d => (mask & d.bit) !== 0).map(d => d[lang]).join(" ");
}

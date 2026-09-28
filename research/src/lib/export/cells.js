// Which table cells are numbers, shared by the Word and HTML writers (right-aligned, tabular figures).
// OWNER: report role.

/** Numbers a Word or HTML table right-aligns: digits with a sign, comparison, thousands commas, percent or an interval in brackets. */
export const NUMERIC_CELL = /^\s*[<>≤≥]?\s*[-−+]?(\d[\d,]*(\.\d+)?|∞)\s*%?\s*(\([^)]*\))?\s*$|^\s*[-−]?\d[\d,.]*%?\s+(to|ถึง)\s+[-−]?\d[\d,.]*%?\s*$|^\s*p\s*[=<>]\s*[\d.]+\s*$|^—$/;

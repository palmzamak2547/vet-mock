// The kit's line-focus interaction, reusable over the document being read.
export function selectReadingItem(items, index) {
  const current = Math.max(0, Math.min(index, items.length - 1));
  items.forEach((item, i) => {
    item.classList.toggle('vm-reading-selected', i === current);
    if (item.tagName === 'BUTTON') item.setAttribute('aria-pressed', String(i === current));
  });
  return items[current] || null;
}

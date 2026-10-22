// The article as plain HTML inside the prerendered page's <noscript>, for
// readers and crawlers that do not run JavaScript (owner decision D6, taken
// 2026-10-21: <noscript> renders nothing when scripts run, so the app's
// first paint and layout are untouched). Same text as the app: the note
// body, then the sources its checked points cite. Every piece of content is
// escaped; the markup comes only from here.

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// RichText's light markup (**bold**, `code`, ==mark==) read as plain text.
const plain = (s) => esc(String(s ?? '').replace(/\*\*|==|`/g, ''));

function body(item) {
  if (item == null) return '';
  if (typeof item === 'string') return `<p>${plain(item)}</p>`;
  if (item.bullets) {
    return `<ul>${item.bullets.map((b) => `<li>${plain(typeof b === 'string' ? b : `${b.label}: ${b.value}`)}</li>`).join('')}</ul>`;
  }
  if (item.sub) return `<p><b>${plain(item.sub)}</b></p>${(item.body || []).map(body).join('')}`;
  if (item.table) {
    const { headers = [], rows = [] } = item.table;
    return `<table><thead><tr>${headers.map((h) => `<th>${plain(h)}</th>`).join('')}</tr></thead>`
      + `<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${plain(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  if (item.callout) return `<p>${plain(item.callout)}</p>`;
  return '';
}

const httpUrl = (u) => (/^https?:\/\//i.test(String(u || '')) ? String(u) : '');

/** @returns {string} the <noscript> element for one article */
export function articleNoscript(k, { subjectName, sources = [], citation }) {
  const parts = [
    '<article lang="th" style="max-width:40em;margin:0 auto;padding:1.5rem;font-family:system-ui,sans-serif;line-height:1.7">',
    `<p><a href="/wiki">VetWiki</a> &rsaquo; ${esc(subjectName)}</p>`,
    `<h1>${plain(k.title)}</h1>`,
  ];
  if (k.lecturer && !/^tbd\b/i.test(k.lecturer)) parts.push(`<p>บรรยายโดย ${plain(k.lecturer)}</p>`);
  if (k.summary) parts.push(`<p>${plain(k.summary)}</p>`);
  parts.push('<p>เปิด JavaScript เพื่อดูแหล่งอ้างอิงของแต่ละจุดและฝึกโจทย์ เนื้อหาด้านล่างเป็นฉบับอ่านอย่างเดียว ใช้เพื่อการเรียนรู้ ไม่ใช่คำแนะนำทางคลินิก</p>');
  for (const s of k.sections || []) {
    parts.push(`<section><h2>${plain(s.heading)}</h2>${(s.body || []).map(body).join('')}</section>`);
  }
  if (sources.length) {
    parts.push(`<h2>แหล่งอ้างอิง ${sources.length} แหล่ง</h2><ol>${sources.map((src) => {
      const text = esc(citation(src));
      const url = httpUrl(src.url);
      return `<li>${url ? `<a href="${esc(url)}" rel="noopener">${text}</a>` : text}</li>`;
    }).join('')}</ol>`);
  }
  parts.push('</article>');
  return `<noscript>${parts.join('')}</noscript>`;
}

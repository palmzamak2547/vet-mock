// Project the original VCA sources into the existing library contract. Source
// files stay at their original URLs; alternate formats remain individually accessible.
export function vcaLibraryDocs(materials) {
  return materials.map((material) => {
    const primary = material.files[0];
    return {
      id: material.id, slug: material.id, title: material.title,
      description: material.categories.join(' / '),
      kind: material.kind, subject: 'vca', year: 5,
      semester: null, academic_year: null,
      topics: material.categories, sequence: 0,
      storage_provider: 'google-drive', external_url: primary.url,
      source_files: material.files, mime: primary.mime,
      byte_size: primary.bytes, page_count: primary.pages || null,
      sha256_16: primary.sha256?.slice(0, 16) || null,
      attribution: 'ชุดเอกสารและบันทึกข้อสอบเก่า VCA', status: 'public',
    };
  });
}

export function mergeLibrarySources(docs, sources) {
  const result = docs.slice();
  const ids = new Map(result.map((doc, index) => [doc.id, index]));
  const hashes = new Map(result.flatMap((doc, index) => doc.sha256_16 ? [[doc.sha256_16, index]] : []));
  for (const doc of sources) {
    const existing = ids.get(doc.id) ?? (doc.sha256_16 ? hashes.get(doc.sha256_16) : undefined);
    if (existing !== undefined) {
      if (doc.source_files?.length) {
        const files = new Map([...(result[existing].source_files || []), ...doc.source_files].map((file) => [file.id, file]));
        result[existing] = { ...result[existing], source_files: [...files.values()] };
      }
      continue;
    }
    ids.set(doc.id, result.length);
    if (doc.sha256_16) hashes.set(doc.sha256_16, result.length);
    result.push(doc);
  }
  return result;
}

export function googleDriveSourceUrl(raw) {
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    const allowed = (url.hostname === 'drive.google.com' && /^\/file\/d\/[\w-]+\/view$/.test(url.pathname))
      || (url.hostname === 'docs.google.com' && /^\/(?:document|spreadsheets|presentation)\/d\/[\w-]+\/(?:edit|view)$/.test(url.pathname));
    return allowed ? url.origin + url.pathname : null;
  } catch { return null; }
}

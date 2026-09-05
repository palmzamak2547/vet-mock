// Keep source identity separate from the verified copies used for reading.
export function vcaFileDoc(file, copy = file.backups?.find((item) => item.mime === 'application/pdf') || file.backups?.[0]) {
  return {
    id: copy?.slug || file.id, slug: copy?.slug || file.id, title: file.title,
    storage_provider: copy ? 'r2' : 'google-drive', external_url: file.url,
    mime: copy?.mime || file.mime, byte_size: copy?.bytes || file.bytes,
    page_count: copy?.pages || file.pages || null,
    sha256_16: (copy?.sha256 || file.sha256)?.slice(0, 16) || null,
    range_supported: !!copy, status: 'public', subject: 'vca',
  };
}

export function vcaLibraryDocs(materials) {
  return materials.map((material) => ({ ...material, files: material.files.filter((file) => !file.archiveOnly) }))
    .filter((material) => material.files.length > 0).map((material) => {
    const primary = material.files[0];
    return {
      ...vcaFileDoc(primary), id: material.id, title: material.title,
      description: material.categories.join(' / '),
      kind: material.kind, subject: 'vca', year: 5,
      semester: null, academic_year: null,
      topics: material.categories, sequence: 0,
      source_files: material.files,
      attribution: 'ชุดเอกสารและบันทึกข้อสอบเก่า VCA', status: 'public',
    };
  });
}

export function mergeLibrarySources(docs, sources) {
  // Object rows authorize each binary. The editorial source groups own its
  // card, including alternate formats; do not render each object a second time.
  const groupedSlugs = new Set(sources.flatMap((doc) => (doc.source_files || []).flatMap((file) => (file.backups || []).map((copy) => copy.slug))));
  const result = docs.filter((doc) => !groupedSlugs.has(doc.slug));
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

export function archivedSourceUrl(source) {
  const original = googleDriveSourceUrl(source?.url);
  if (!original || !/^[\w-]{10,100}$/.test(source?.id || '') || !original.includes(`/d/${source.id}/`)) return null;
  return `/api/library-file?source=${encodeURIComponent(source.id)}&open=1`;
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

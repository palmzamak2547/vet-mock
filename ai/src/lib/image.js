// A photo from a phone is 3 to 12 MB. The model needs far less to read a
// slide or a question: longest side 1600 px, JPEG q 0.86 lands near 250 to
// 600 kB, well under the route's 3.5 MB cap, and uploads fast on 4G.

const MAX_SIDE = 1600;

export async function prepareImage(file) {
  if (!file || !/^image\//.test(file.type)) throw new Error('ไฟล์นี้ไม่ใช่รูปภาพ');
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error('เปิดรูปนี้ไม่ได้'));
      i.src = url;
    });
    const k = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * k));
    const h = Math.max(1, Math.round(img.naturalHeight * k));
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    let dataUrl = c.toDataURL('image/jpeg', 0.86);
    // a request body over 4.5 MB never reaches the route: keep the base64 under ~3 MB
    for (const q of [0.74, 0.6]) if (dataUrl.length > 3_000_000) dataUrl = c.toDataURL('image/jpeg', q);
    if (dataUrl.length > 3_000_000) throw new Error('รูปนี้ใหญ่เกินไป ลองครอปหรือถ่ายใหม่');
    return { mediaType: 'image/jpeg', data: dataUrl.split(',')[1], preview: dataUrl, w, h };
  } finally {
    URL.revokeObjectURL(url);
  }
}

// In-browser DICOM anonymizer. Strips identifying tags by overwriting
// their bytes with ASCII spaces (0x20) — preserves DICOM structure
// (element length unchanged) and works for all string VRs in the safe-
// harbor set below. Binary VRs (UI, UN, OB, OW) aren't in this set.
//
// Reads the file via dicom-parser, finds each element's dataOffset
// and length, mutates a Uint8Array copy of the original bytes.
//
// Returns a new File ready to download or pass back into the viewer.
//
// NOT a full HIPAA "Safe Harbor" or ISO 25237 implementation — that
// would also need to handle private tags, image overlays with burnt-in
// text, structured report content, etc. Use this for educational
// case-prep only; double-check output before publishing.

import dicomParser from 'dicom-parser';

// DICOM tags to anonymize (hex keys = dicom-parser's "xGGGGEEEE" format)
// Source: DICOM PS3.15 Annex E Basic Application Level Confidentiality
// Profile (subset) + common vet identifiers.
const ANON_TAGS = [
  // Patient
  { tag: 'x00100010', label: 'PatientName' },
  { tag: 'x00100020', label: 'PatientID' },
  { tag: 'x00100030', label: 'PatientBirthDate' },
  { tag: 'x00100040', label: 'PatientSex' },
  { tag: 'x00101010', label: 'PatientAge' },
  { tag: 'x00101030', label: 'PatientWeight' },
  { tag: 'x00102000', label: 'MedicalAlerts' },
  { tag: 'x00102110', label: 'Allergies' },
  { tag: 'x00104000', label: 'PatientComments' },
  // Study / referring
  { tag: 'x00080050', label: 'AccessionNumber' },
  { tag: 'x00080090', label: 'ReferringPhysicianName' },
  { tag: 'x00081060', label: 'NameOfPhysiciansReadingStudy' },
  { tag: 'x00321032', label: 'RequestingPhysician' },
  { tag: 'x00321060', label: 'RequestedProcedureDescription' },
  // Institution
  { tag: 'x00080080', label: 'InstitutionName' },
  { tag: 'x00080081', label: 'InstitutionAddress' },
  { tag: 'x00081010', label: 'StationName' },
  { tag: 'x00081040', label: 'InstitutionalDepartmentName' },
  // Device / operator
  { tag: 'x00181000', label: 'DeviceSerialNumber' },
  { tag: 'x00081070', label: 'OperatorsName' },
  { tag: 'x00081050', label: 'PerformingPhysicianName' },
];

export async function anonymizeDicom(file) {
  const buf = await file.arrayBuffer();
  const u8 = new Uint8Array(buf);

  let dataSet;
  try {
    dataSet = dicomParser.parseDicom(u8);
  } catch (e) {
    throw new Error(`DICOM parse failed: ${e?.message || e}`);
  }

  const out = new Uint8Array(u8);  // copy so we don't mutate the original
  const stripped = [];
  const skipped = [];

  for (const { tag, label } of ANON_TAGS) {
    const el = dataSet.elements[tag];
    if (!el) { skipped.push(label); continue; }
    // Read original (to report what was stripped) — limit to 80 chars
    let orig = '';
    try { orig = dataSet.string(tag)?.slice(0, 80) || ''; } catch { /* binary VR */ }
    // Overwrite data bytes with ASCII spaces. Spaces are valid trailing
    // padding in DICOM string VRs, so the file remains conformant.
    for (let i = 0; i < el.length; i++) {
      out[el.dataOffset + i] = 0x20;
    }
    stripped.push({ label, original: orig || '(binary)' });
  }

  const baseName = file.name.replace(/\.dcm$/i, '').replace(/\.dicom$/i, '');
  const anonFile = new File([out], `${baseName}_anon.dcm`, { type: 'application/dicom' });

  return { file: anonFile, stripped, skipped };
}

// Convenience: trigger download of the anonymized file
export function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

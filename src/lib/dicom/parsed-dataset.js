// The DICOM dataset the image loader already parsed for a File, handed from
// the viewport to the tag inspector beside it so neither reads and parses the
// whole file again. Keyed weakly by the File, and the viewport forgets its
// entry when it closes, so the parsed bytes never outlive the image.

const byFile = new WeakMap();

export function rememberParsedDataSet(file, dataSet) {
  if (file && dataSet) byFile.set(file, dataSet);
}

export function parsedDataSetFor(file) {
  return (file && byFile.get(file)) || null;
}

// Only drop the entry this viewport stored: the same File open in the other
// compare pane may have replaced it with its own.
export function forgetParsedDataSet(file, dataSet) {
  if (file && byFile.get(file) === dataSet) byFile.delete(file);
}

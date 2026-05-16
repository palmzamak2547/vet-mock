// Compact dictionary of common DICOM tags (subset of DICOM PS3.6
// Data Dictionary). Used by TagInspector to render human-readable
// names alongside the (gggg,eeee) hex codes. Tags not in the
// dictionary fall back to "(unknown)" — that's expected for vendor
// private tags and unusual SOP classes.
//
// Keys are dicom-parser's `xGGGGEEEE` lowercase format.

export const TAG_DICT = {
  // ── File meta (group 0002) ──
  'x00020000': 'FileMetaInformationGroupLength',
  'x00020001': 'FileMetaInformationVersion',
  'x00020002': 'MediaStorageSOPClassUID',
  'x00020003': 'MediaStorageSOPInstanceUID',
  'x00020010': 'TransferSyntaxUID',
  'x00020012': 'ImplementationClassUID',
  'x00020013': 'ImplementationVersionName',

  // ── Identifying info (PII candidates) ──
  'x00080020': 'StudyDate',
  'x00080021': 'SeriesDate',
  'x00080022': 'AcquisitionDate',
  'x00080023': 'ContentDate',
  'x00080030': 'StudyTime',
  'x00080031': 'SeriesTime',
  'x00080050': 'AccessionNumber',
  'x00080060': 'Modality',
  'x00080070': 'Manufacturer',
  'x00080080': 'InstitutionName',
  'x00080081': 'InstitutionAddress',
  'x00080090': 'ReferringPhysicianName',
  'x00081010': 'StationName',
  'x00081030': 'StudyDescription',
  'x0008103e': 'SeriesDescription',
  'x00081040': 'InstitutionalDepartmentName',
  'x00081050': 'PerformingPhysicianName',
  'x00081060': 'NameOfPhysiciansReadingStudy',
  'x00081070': 'OperatorsName',
  'x00081090': 'ManufacturerModelName',

  // ── Patient ──
  'x00100010': 'PatientName',
  'x00100020': 'PatientID',
  'x00100021': 'IssuerOfPatientID',
  'x00100030': 'PatientBirthDate',
  'x00100032': 'PatientBirthTime',
  'x00100040': 'PatientSex',
  'x00101000': 'OtherPatientIDs',
  'x00101001': 'OtherPatientNames',
  'x00101010': 'PatientAge',
  'x00101020': 'PatientSize',
  'x00101030': 'PatientWeight',
  'x00101040': 'PatientAddress',
  'x00102000': 'MedicalAlerts',
  'x00102110': 'Allergies',
  'x00102160': 'EthnicGroup',
  'x00102180': 'Occupation',
  'x001021b0': 'AdditionalPatientHistory',
  'x001021d0': 'LastMenstrualDate',
  'x00104000': 'PatientComments',

  // ── Vet patient (group 0010 subset for veterinary) ──
  'x00102201': 'PatientSpeciesDescription',
  'x00102202': 'PatientSpeciesCodeSequence',
  'x00102203': 'PatientSexNeutered',
  'x00102292': 'PatientBreedDescription',
  'x00102293': 'PatientBreedCodeSequence',
  'x00102296': 'BreedRegistrationNumber',
  'x00102297': 'ResponsiblePerson',
  'x00102298': 'ResponsiblePersonRole',
  'x00102299': 'ResponsibleOrganization',

  // ── Study / Series ──
  'x0020000d': 'StudyInstanceUID',
  'x0020000e': 'SeriesInstanceUID',
  'x00200010': 'StudyID',
  'x00200011': 'SeriesNumber',
  'x00200013': 'InstanceNumber',
  'x00200020': 'PatientOrientation',
  'x00200052': 'FrameOfReferenceUID',

  // ── Equipment ──
  'x00181000': 'DeviceSerialNumber',
  'x00181020': 'SoftwareVersions',
  'x00181030': 'ProtocolName',
  'x00181400': 'AcquisitionDeviceProcessingDescription',

  // ── X-ray acquisition ──
  'x00180015': 'BodyPartExamined',
  'x00180050': 'SliceThickness',
  'x00180060': 'KVP',
  'x00181150': 'ExposureTime',
  'x00181151': 'XRayTubeCurrent',
  'x00181152': 'Exposure',
  'x00181153': 'ExposureInuAs',
  'x00181160': 'FilterType',
  'x00181164': 'ImagerPixelSpacing',
  'x00181190': 'FocalSpots',
  'x001811a0': 'BodyPartThickness',
  'x00185100': 'PatientPosition',
  'x00185101': 'ViewPosition',

  // ── Image pixel ──
  'x00280002': 'SamplesPerPixel',
  'x00280004': 'PhotometricInterpretation',
  'x00280008': 'NumberOfFrames',
  'x00280010': 'Rows',
  'x00280011': 'Columns',
  'x00280030': 'PixelSpacing',
  'x00280034': 'PixelAspectRatio',
  'x00280100': 'BitsAllocated',
  'x00280101': 'BitsStored',
  'x00280102': 'HighBit',
  'x00280103': 'PixelRepresentation',
  'x00280106': 'SmallestImagePixelValue',
  'x00280107': 'LargestImagePixelValue',
  'x00281050': 'WindowCenter',
  'x00281051': 'WindowWidth',
  'x00281052': 'RescaleIntercept',
  'x00281053': 'RescaleSlope',
  'x00281054': 'RescaleType',
  'x00281055': 'WindowCenterWidthExplanation',
  'x00281056': 'VOILUTFunction',
  'x00282110': 'LossyImageCompression',
  'x00282114': 'LossyImageCompressionMethod',

  // ── Detector ──
  'x00187004': 'DetectorType',
  'x00187005': 'DetectorConfiguration',
  'x00187006': 'DetectorDescription',
  'x00187008': 'DetectorMode',
  'x0018700a': 'DetectorID',
  'x00187050': 'FilterMaterial',
};

// VR list — common ones. Used to decide how to display tag values
// (string vs binary).
export const STRING_VRS = new Set(['AE', 'AS', 'CS', 'DA', 'DS', 'DT', 'IS', 'LO', 'LT', 'PN', 'SH', 'ST', 'TM', 'UI', 'UT']);

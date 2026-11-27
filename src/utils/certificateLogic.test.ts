import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSurveillanceDates,
  filterCertificateRecords,
  formatCertificateDate,
  generateRandomCertificateNumber,
  getOrdinalSuffix,
  isValidVerificationUrl,
  splitMultilineText,
  validateCertificateData,
} from './certificateLogic';
import {
  EMPTY_CERTIFICATE_DATA,
  SAMPLE_CERTIFICATE_DATA,
  SavedCertificateRecord,
} from '../types/certificate';

test('getOrdinalSuffix returns accurate English ordinals', () => {
  assert.equal(getOrdinalSuffix(1), 'st');
  assert.equal(getOrdinalSuffix(2), 'nd');
  assert.equal(getOrdinalSuffix(3), 'rd');
  assert.equal(getOrdinalSuffix(4), 'th');
  assert.equal(getOrdinalSuffix(11), 'th');
  assert.equal(getOrdinalSuffix(12), 'th');
  assert.equal(getOrdinalSuffix(13), 'th');
  assert.equal(getOrdinalSuffix(14), 'th');
  assert.equal(getOrdinalSuffix(15), 'th');
  assert.equal(getOrdinalSuffix(21), 'st');
  assert.equal(getOrdinalSuffix(22), 'nd');
  assert.equal(getOrdinalSuffix(23), 'rd');
  assert.equal(getOrdinalSuffix(31), 'st');
});

test('formatCertificateDate formats ISO dates matching QRO sample payload', () => {
  const cert = formatCertificateDate('2026-10-15');
  assert.deepEqual(cert, {
    day: '15',
    suffix: 'th',
    monthYear: 'October 2026',
    plain: '15th October 2026',
  });

  const surv1 = formatCertificateDate('2027-10-14');
  assert.equal(surv1?.plain, '14th October 2027');

  const first = formatCertificateDate('2026-01-01');
  assert.equal(first?.plain, '1st January 2026');

  assert.equal(formatCertificateDate(''), null);
});

test('calculateSurveillanceDates reproduces exact 1/2/3 year QRO dates', () => {
  const dates = calculateSurveillanceDates('2026-10-15');
  assert.deepEqual(dates, {
    first_surveillance_due: '2027-10-14',
    second_surveillance_due: '2028-10-14',
    certificate_expiry: '2029-10-14',
  });
});

test('validateCertificateData passes on SAMPLE_CERTIFICATE_DATA and rejects missing required fields', () => {
  const sampleErrors = validateCertificateData(SAMPLE_CERTIFICATE_DATA);
  assert.deepEqual(sampleErrors, {});

  const emptyErrors = validateCertificateData(EMPTY_CERTIFICATE_DATA);
  assert.ok(emptyErrors.client_name);
  assert.ok(emptyErrors.client_address);
  assert.ok(emptyErrors.scope_of_activities);
  assert.ok(emptyErrors.certificate_number);
  assert.ok(emptyErrors.date_of_certification);
  assert.equal(emptyErrors.cab_number, undefined); // cab_number is optional
});

test('validateCertificateData catches invalid date chronology and URLs', () => {
  const invalid = {
    ...SAMPLE_CERTIFICATE_DATA,
    first_surveillance_due: '2026-10-10',
    verification_url: 'not-a-domain',
  };
  const errors = validateCertificateData(invalid);
  assert.ok(errors.first_surveillance_due);
  assert.ok(errors.verification_url);
  assert.equal(isValidVerificationUrl('www.qrocert.org'), true);
  assert.equal(isValidVerificationUrl('https://www.qrocert.org/verify'), true);
  assert.equal(isValidVerificationUrl('invalid'), false);
});

test('splitMultilineText preserves exact non-empty lines', () => {
  const lines = splitMultilineText(SAMPLE_CERTIFICATE_DATA.client_address);
  assert.deepEqual(lines, [
    '6A/45, AVAS VIKAS, BUDDHI VIHAR PHASE-2,',
    'MORADABAD, UTTAR PRADESH – 244001, INDIA',
  ]);
});

test('filterCertificateRecords filters by search query and ISO standard', () => {
  const records: SavedCertificateRecord[] = [
    {
      id: '1',
      createdAt: '2026-10-15T00:00:00Z',
      updatedAt: '2026-10-15T00:00:00Z',
      data: SAMPLE_CERTIFICATE_DATA,
    },
    {
      id: '2',
      createdAt: '2026-10-16T00:00:00Z',
      updatedAt: '2026-10-16T00:00:00Z',
      data: {
        ...SAMPLE_CERTIFICATE_DATA,
        client_name: 'GREENFIELD LOGISTICS',
        iso_standard: 'ISO 14001:2015',
        certificate_number: '99887766Q',
      },
    },
  ];

  assert.equal(filterCertificateRecords(records, '', 'ALL').length, 2);
  assert.equal(
    filterCertificateRecords(records, 'shnahal', 'ALL').length,
    1
  );
  assert.equal(
    filterCertificateRecords(records, '', 'ISO 14001:2015').length,
    1
  );
  assert.equal(
    filterCertificateRecords(records, '99887766Q', 'ISO 9001:2015').length,
    0
  );
});

test('generateRandomCertificateNumber produces valid 13-char QRO-style IDs', () => {
  const generated = generateRandomCertificateNumber('2026-10-15', 'QRO');
  assert.match(generated, /^30502610\d{4}Q$/);
  const generatedCustom = generateRandomCertificateNumber('2027-04-09', 'TUV');
  assert.match(generatedCustom, /^30502704\d{4}T$/);
});

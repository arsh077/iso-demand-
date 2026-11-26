import {
  CERTIFICATE_FORM_FIELDS,
  CertificateFormData,
  SavedCertificateRecord,
  ValidationErrors,
} from '../types/certificate';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface FormattedCertificateDate {
  day: string;
  suffix: string;
  monthYear: string;
  plain: string;
}

export function getOrdinalSuffix(dayNumber: number): string {
  const mod100 = dayNumber % 100;
  if (mod100 >= 11 && mod100 <= 13) {
    return 'th';
  }
  switch (dayNumber % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function formatCertificateDate(
  isoDateStr: string
): FormattedCertificateDate | null {
  const trimmed = isoDateStr.trim();
  if (!trimmed) return null;

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!isoMatch) {
    return {
      day: '',
      suffix: '',
      monthYear: trimmed,
      plain: trimmed,
    };
  }

  const year = Number(isoMatch[1]);
  const monthIndex = Number(isoMatch[2]) - 1;
  const day = Number(isoMatch[3]);

  if (
    Number.isNaN(year) ||
    monthIndex < 0 ||
    monthIndex > 11 ||
    day < 1 ||
    day > 31
  ) {
    return {
      day: '',
      suffix: '',
      monthYear: trimmed,
      plain: trimmed,
    };
  }

  const suffix = getOrdinalSuffix(day);
  const monthName = MONTH_NAMES[monthIndex];
  const monthYear = `${monthName} ${year}`;

  return {
    day: String(day),
    suffix,
    monthYear,
    plain: `${day}${suffix} ${monthYear}`,
  };
}

function addYearsMinusOneDay(isoDateStr: string, yearsToAdd: number): string {
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDateStr.trim());
  if (!isoMatch) return '';

  const year = Number(isoMatch[1]);
  const monthIndex = Number(isoMatch[2]) - 1;
  const day = Number(isoMatch[3]);

  const target = new Date(Date.UTC(year + yearsToAdd, monthIndex, day));
  target.setUTCDate(target.getUTCDate() - 1);

  const outYear = target.getUTCFullYear();
  const outMonth = String(target.getUTCMonth() + 1).padStart(2, '0');
  const outDay = String(target.getUTCDate()).padStart(2, '0');

  return `${outYear}-${outMonth}-${outDay}`;
}

export function calculateSurveillanceDates(certDateStr: string): {
  first_surveillance_due: string;
  second_surveillance_due: string;
  certificate_expiry: string;
} | null {
  const trimmed = certDateStr.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return null;
  }

  return {
    first_surveillance_due: addYearsMinusOneDay(trimmed, 1),
    second_surveillance_due: addYearsMinusOneDay(trimmed, 2),
    certificate_expiry: addYearsMinusOneDay(trimmed, 3),
  };
}

export function isValidVerificationUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  // Accept domain-style URLs like "www.qrocert.org" as well as full http(s) URLs
  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    return parsed.hostname.includes('.') && parsed.hostname.length >= 4;
  } catch {
    return false;
  }
}

export function validateCertificateData(
  data: CertificateFormData
): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const field of CERTIFICATE_FORM_FIELDS) {
    const value = (data[field.name] ?? '').trim();
    if (field.required && !value) {
      errors[field.name] = `${field.label} is required.`;
    }
  }

  if (data.verification_url.trim() && !isValidVerificationUrl(data.verification_url)) {
    errors.verification_url =
      'Enter a valid verification domain or URL (e.g., www.qrocert.org).';
  }

  const certDate = data.date_of_certification.trim();
  const surv1 = data.first_surveillance_due.trim();
  const surv2 = data.second_surveillance_due.trim();
  const expiry = data.certificate_expiry.trim();

  if (certDate && surv1 && surv1 <= certDate) {
    errors.first_surveillance_due =
      '1st Surveillance Audit Due must be after Date of Certification.';
  }
  if (surv1 && surv2 && surv2 <= surv1) {
    errors.second_surveillance_due =
      '2nd Surveillance Audit Due must be after 1st Surveillance Audit Due.';
  }
  if (surv2 && expiry && expiry < surv2) {
    errors.certificate_expiry =
      'Certificate Expiry Date must be on or after 2nd Surveillance Audit Due.';
  }

  return errors;
}

export function splitMultilineText(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);
}

export function filterCertificateRecords(
  records: SavedCertificateRecord[],
  query: string,
  standardFilter: string
): SavedCertificateRecord[] {
  const normalizedQuery = query.trim().toLowerCase();
  return records.filter((record) => {
    const matchesStandard =
      standardFilter === 'ALL' || record.data.iso_standard === standardFilter;
    if (!matchesStandard) return false;
    if (!normalizedQuery) return true;

    const searchable = [
      record.data.client_name,
      record.data.certificate_number,
      record.data.iso_standard,
      record.data.scope_of_activities,
      record.data.certification_body_short,
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
}

export function createCertificateRecordId(certNumber: string): string {
  const sanitized = certNumber.trim().replace(/[^a-zA-Z0-9_-]/g, '');
  const randomSuffix = Math.random().toString(36).slice(2, 7);
  return `cert_${sanitized || 'iso'}_${Date.now()}_${randomSuffix}`;
}

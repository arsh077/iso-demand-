export type IsoStandardOption =
  | 'ISO 9001:2015'
  | 'ISO 14001:2015'
  | 'ISO 45001:2018'
  | 'ISO 22000:2018'
  | 'ISO 27001:2022';

export interface CertificateFormData {
  client_name: string;
  client_address: string;
  iso_standard: IsoStandardOption | string;
  management_system_title: string;
  scope_of_activities: string;
  certification_body_short: string;
  certification_body_full: string;
  issuing_llp_name: string;
  certificate_number: string;
  date_of_certification: string;
  first_surveillance_due: string;
  second_surveillance_due: string;
  certificate_expiry: string;
  cab_number: string;
  verification_url: string;
  issuing_office_address: string;
}

export type CertificateFieldKey = keyof CertificateFormData;

export type ValidationErrors = Partial<Record<CertificateFieldKey, string>>;

export interface SavedCertificateRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  data: CertificateFormData;
}

export interface CertificateFieldConfig {
  name: CertificateFieldKey;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'url';
  required: boolean;
  placeholder?: string;
  options?: IsoStandardOption[];
  group: 'client' | 'standard' | 'dates' | 'body';
}

export const ISO_STANDARD_OPTIONS: IsoStandardOption[] = [
  'ISO 9001:2015',
  'ISO 14001:2015',
  'ISO 45001:2018',
  'ISO 22000:2018',
  'ISO 27001:2022',
];

export const ISO_STANDARD_DEFAULT_TITLES: Record<IsoStandardOption, string> = {
  'ISO 9001:2015': 'Quality Management System',
  'ISO 14001:2015': 'Environmental Management System',
  'ISO 45001:2018': 'Occupational Health & Safety Management System',
  'ISO 22000:2018': 'Food Safety Management System',
  'ISO 27001:2022': 'Information Security Management System',
};

export const CERTIFICATE_FORM_FIELDS: CertificateFieldConfig[] = [
  {
    name: 'client_name',
    label: 'Client / Organization Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., SHNAHAL FOODS',
    group: 'client',
  },
  {
    name: 'client_address',
    label: 'Client Registered / Site Address',
    type: 'textarea',
    required: true,
    placeholder:
      'e.g., 6A/45, AVAS VIKAS, BUDDHI VIHAR PHASE-2, MORADABAD, UTTAR PRADESH – 244001, INDIA',
    group: 'client',
  },
  {
    name: 'iso_standard',
    label: 'ISO Standard',
    type: 'select',
    required: true,
    options: ISO_STANDARD_OPTIONS,
    group: 'standard',
  },
  {
    name: 'management_system_title',
    label: 'Management System Title',
    type: 'text',
    required: true,
    placeholder: 'e.g., Quality Management System',
    group: 'standard',
  },
  {
    name: 'scope_of_activities',
    label: 'Scope of Activities',
    type: 'textarea',
    required: true,
    placeholder:
      'e.g., MANUFACTURING OF VEGETABLE OILS AND FATS (EXCLUDING CORN OIL)',
    group: 'standard',
  },
  {
    name: 'certificate_number',
    label: 'Certificate Number',
    type: 'text',
    required: true,
    placeholder: 'e.g., 305026101578Q',
    group: 'dates',
  },
  {
    name: 'date_of_certification',
    label: 'Date of Certification',
    type: 'date',
    required: true,
    group: 'dates',
  },
  {
    name: 'first_surveillance_due',
    label: '1st Surveillance Audit Due',
    type: 'date',
    required: true,
    group: 'dates',
  },
  {
    name: 'second_surveillance_due',
    label: '2nd Surveillance Audit Due',
    type: 'date',
    required: true,
    group: 'dates',
  },
  {
    name: 'certificate_expiry',
    label: 'Certificate Expiry Date',
    type: 'date',
    required: true,
    group: 'dates',
  },
  {
    name: 'certification_body_short',
    label: 'Certification Body Short Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., QRO',
    group: 'body',
  },
  {
    name: 'certification_body_full',
    label: 'Certification Body Full Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., QUALITY RESEARCH ORGANIZATION',
    group: 'body',
  },
  {
    name: 'issuing_llp_name',
    label: 'Issuing Entity / LLP Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., QRO Certification LLP',
    group: 'body',
  },
  {
    name: 'cab_number',
    label: 'CAB Number',
    type: 'text',
    required: false,
    placeholder: 'e.g., CAB # 011905',
    group: 'body',
  },
  {
    name: 'verification_url',
    label: 'Verification Portal URL',
    type: 'url',
    required: true,
    placeholder: 'e.g., www.qrocert.org',
    group: 'body',
  },
  {
    name: 'issuing_office_address',
    label: 'Issuing Office Address & Contact',
    type: 'textarea',
    required: true,
    placeholder:
      '142, IInd Floor, Avtar Enclave, Near Paschim Vihar West Metro Station, Delhi-110063, (INDIA) | Website: www.qrocert.org, E-mail: info@qrocert.org',
    group: 'body',
  },
];

export const SAMPLE_CERTIFICATE_DATA: CertificateFormData = {
  client_name: 'SHNAHAL FOODS',
  client_address:
    '6A/45, AVAS VIKAS, BUDDHI VIHAR PHASE-2,\nMORADABAD, UTTAR PRADESH – 244001, INDIA',
  iso_standard: 'ISO 9001:2015',
  management_system_title: 'Quality Management System',
  scope_of_activities:
    'MANUFACTURING OF VEGETABLE OILS AND FATS (EXCLUDING CORN OIL)',
  certification_body_short: 'QRO',
  certification_body_full: 'QUALITY RESEARCH ORGANIZATION',
  issuing_llp_name: 'QRO Certification LLP',
  certificate_number: '305026101578Q',
  date_of_certification: '2026-10-15',
  first_surveillance_due: '2027-10-14',
  second_surveillance_due: '2028-10-14',
  certificate_expiry: '2029-10-14',
  cab_number: 'CAB # 011905',
  verification_url: 'www.qrocert.org',
  issuing_office_address:
    'India Office : QRO Certification LLP\n142, IInd Floor, Avtar Enclave, Near Paschim Vihar West Metro Station, Delhi-110063, (INDIA)\nWebsite : www.qrocert.org, E-mail : info@qrocert.org',
};

export const EMPTY_CERTIFICATE_DATA: CertificateFormData = {
  client_name: '',
  client_address: '',
  iso_standard: 'ISO 9001:2015',
  management_system_title: 'Quality Management System',
  scope_of_activities: '',
  certification_body_short: 'QRO',
  certification_body_full: 'QUALITY RESEARCH ORGANIZATION',
  issuing_llp_name: 'QRO Certification LLP',
  certificate_number: '',
  date_of_certification: '',
  first_surveillance_due: '',
  second_surveillance_due: '',
  certificate_expiry: '',
  cab_number: '',
  verification_url: 'www.qrocert.org',
  issuing_office_address:
    'India Office : QRO Certification LLP\n142, IInd Floor, Avtar Enclave, Near Paschim Vihar West Metro Station, Delhi-110063, (INDIA)\nWebsite : www.qrocert.org, E-mail : info@qrocert.org',
};

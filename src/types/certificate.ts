export type StandardCategory =
  | 'Management System'
  | 'Welding Quality'
  | 'Structural Fabrication';

export interface StandardCatalogItem {
  code: string;
  default_title: string;
  category: StandardCategory;
  sample_scope: string;
}

export const STANDARD_CATALOG: StandardCatalogItem[] = [
  {
    code: 'ISO 9001:2015',
    default_title: 'Quality Management System',
    category: 'Management System',
    sample_scope:
      'PROVISION OF CONSULTANCY, TRADING, AND MANUFACTURING SERVICES IN ACCORDANCE WITH QUALITY MANAGEMENT SYSTEM REQUIREMENTS',
  },
  {
    code: 'ISO 9001',
    default_title: 'Quality Management System',
    category: 'Management System',
    sample_scope:
      'PROVISION OF CONSULTANCY, TRADING, AND MANUFACTURING SERVICES IN ACCORDANCE WITH QUALITY MANAGEMENT SYSTEM REQUIREMENTS',
  },
  {
    code: 'ISO 14001:2015',
    default_title: 'Environmental Management System',
    category: 'Management System',
    sample_scope:
      'MANUFACTURING AND PROCESSING OPERATIONS WITH CONTROLLED ENVIRONMENTAL AND WASTE MANAGEMENT PRACTICES',
  },
  {
    code: 'ISO 14001',
    default_title: 'Environmental Management System',
    category: 'Management System',
    sample_scope:
      'MANUFACTURING AND PROCESSING OPERATIONS WITH CONTROLLED ENVIRONMENTAL AND WASTE MANAGEMENT PRACTICES',
  },
  {
    code: 'ISO 45001:2018',
    default_title: 'Occupational Health and Safety Management System',
    category: 'Management System',
    sample_scope:
      'OCCUPATIONAL HEALTH AND SAFETY MANAGEMENT FOR FABRICATION, CONSTRUCTION, AND INDUSTRIAL OPERATIONS',
  },
  {
    code: 'ISO 22000:2018',
    default_title: 'Food Safety Management System',
    category: 'Management System',
    sample_scope:
      'PROCESSING, PACKAGING, STORAGE, AND DISTRIBUTION OF FOOD PRODUCTS',
  },
  {
    code: 'ISO/IEC 27001:2022',
    default_title: 'Information Security Management System',
    category: 'Management System',
    sample_scope:
      'INFORMATION SECURITY MANAGEMENT FOR SOFTWARE DEVELOPMENT, IT OPERATIONS, AND DATA PROCESSING',
  },
  {
    code: 'ISO 27001:2022',
    default_title: 'Information Security Management System',
    category: 'Management System',
    sample_scope:
      'INFORMATION SECURITY MANAGEMENT FOR SOFTWARE DEVELOPMENT, IT OPERATIONS, AND DATA PROCESSING',
  },
  {
    code: 'ISO 13485',
    default_title: 'Medical Devices Quality Management System',
    category: 'Management System',
    sample_scope:
      'DESIGN, MANUFACTURE, AND SUPPLY OF MEDICAL DEVICES AND RELATED COMPONENTS',
  },
  {
    code: 'ISO 50001:2018',
    default_title: 'Energy Management System',
    category: 'Management System',
    sample_scope:
      'ENERGY MANAGEMENT AND EFFICIENCY IMPROVEMENT ACROSS INDUSTRIAL AND COMMERCIAL FACILITIES',
  },
  {
    code: 'ISO 3834-2',
    default_title:
      'Quality Requirements for Fusion Welding of Metallic Materials — Comprehensive Quality Requirements',
    category: 'Welding Quality',
    sample_scope:
      'FUSION WELDING OF STRUCTURAL STEEL AND METALLIC COMPONENTS REQUIRING COMPREHENSIVE WELDING QUALITY CONTROL',
  },
  {
    code: 'ISO 3834-3',
    default_title:
      'Quality Requirements for Fusion Welding of Metallic Materials — Standard Quality Requirements',
    category: 'Welding Quality',
    sample_scope:
      'FUSION WELDING OF METALLIC STRUCTURES AND FABRICATED COMPONENTS UNDER STANDARD QUALITY REQUIREMENTS',
  },
  {
    code: 'ISO 3834-4',
    default_title:
      'Quality Requirements for Fusion Welding of Metallic Materials — Elementary Quality Requirements',
    category: 'Welding Quality',
    sample_scope:
      'FUSION WELDING OF METALLIC ITEMS UNDER ELEMENTARY QUALITY REQUIREMENTS',
  },
  {
    code: 'EN 1090-1',
    default_title:
      'Execution of Steel Structures and Aluminium Structures — Conformity Assessment of Structural Components',
    category: 'Structural Fabrication',
    sample_scope:
      'FACTORY PRODUCTION CONTROL AND CONFORMITY ASSESSMENT OF FABRICATED STRUCTURAL STEEL AND ALUMINIUM COMPONENTS',
  },
  {
    code: 'EN 1090-2 (EXC2)',
    default_title:
      'Execution of Steel Structures and Aluminium Structures — Technical Requirements for Steel Structures (Execution Class EXC2)',
    category: 'Structural Fabrication',
    sample_scope:
      'FABRICATION AND ERECTION OF STRUCTURAL STEELWORK UP TO EXECUTION CLASS EXC2',
  },
  {
    code: 'EN 1090-2 (EXC3)',
    default_title:
      'Execution of Steel Structures and Aluminium Structures — Technical Requirements for Steel Structures (Execution Class EXC3)',
    category: 'Structural Fabrication',
    sample_scope:
      'FABRICATION AND ERECTION OF STRUCTURAL STEELWORK UP TO EXECUTION CLASS EXC3',
  },
  {
    code: 'EN 1090-3',
    default_title:
      'Execution of Steel Structures and Aluminium Structures — Technical Requirements for Aluminium Structures',
    category: 'Structural Fabrication',
    sample_scope:
      'FABRICATION AND ERECTION OF STRUCTURAL ALUMINIUM COMPONENTS AND ASSEMBLIES',
  },
];

export const STANDARD_CATEGORIES: StandardCategory[] = [
  'Management System',
  'Welding Quality',
  'Structural Fabrication',
];

export type IsoStandardOption = string;

export interface CertificateFormData {
  client_name: string;
  client_address: string;
  iso_standard: IsoStandardOption;
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

export const ISO_STANDARD_OPTIONS: IsoStandardOption[] = STANDARD_CATALOG.map(
  (item) => item.code
);

export const ISO_STANDARD_DEFAULT_TITLES: Record<string, string> =
  Object.fromEntries(
    STANDARD_CATALOG.map((item) => [item.code, item.default_title])
  );

export const ISO_STANDARD_SAMPLE_SCOPES: Record<string, string> =
  Object.fromEntries(
    STANDARD_CATALOG.map((item) => [item.code, item.sample_scope])
  );

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

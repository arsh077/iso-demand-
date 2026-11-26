import React from 'react';
import { CertificateFormData } from '../types/certificate';
import {
  formatCertificateDate,
  FormattedCertificateDate,
  splitMultilineText,
} from '../utils/certificateLogic';
import {
  CenterWatermark,
  EgacAccreditationMark,
  HeadSignatureSvg,
  IafMlaBadge,
  LeftBlueRibbon,
} from './CertificateArtwork';

interface CertificateSheetProps {
  data: CertificateFormData;
  id?: string;
}

const FormattedDateDisplay: React.FC<{
  value: string;
  fallback?: string;
}> = ({ value, fallback = '—' }) => {
  const formatted: FormattedCertificateDate | null = formatCertificateDate(value);
  if (!formatted) {
    return <span>{fallback}</span>;
  }
  if (!formatted.day) {
    return <span>{formatted.plain}</span>;
  }
  return (
    <span className="tabular-nums">
      {formatted.day}
      <sup className="text-[0.72em] font-semibold">{formatted.suffix}</sup>{' '}
      {formatted.monthYear}
    </span>
  );
};

export const CertificateSheet: React.FC<CertificateSheetProps> = ({
  data,
  id,
}) => {
  const clientName = data.client_name.trim() || 'CLIENT / ORGANIZATION NAME';
  const clientAddressLines = splitMultilineText(data.client_address);
  const scopeLines = splitMultilineText(data.scope_of_activities);
  const officeLines = splitMultilineText(data.issuing_office_address);
  const certBodyShort = data.certification_body_short.trim() || 'QRO';
  const certBodyFull =
    data.certification_body_full.trim() || 'QUALITY RESEARCH ORGANIZATION';
  const issuingLlp = data.issuing_llp_name.trim() || 'QRO Certification LLP';
  const isoStandard = data.iso_standard.trim() || 'ISO 9001:2015';
  const systemTitle =
    data.management_system_title.trim() || 'Quality Management System';
  const certNumber = data.certificate_number.trim() || 'PENDING';
  const verificationUrl = data.verification_url.trim() || 'www.qrocert.org';

  return (
    <article
      id={id}
      data-testid="certificate-sheet"
      className="certificate-a4-sheet relative w-[794px] h-[1123px] bg-white text-slate-950 overflow-hidden shadow-[0_20px_60px_-15px_rgba(15,23,42,0.22)] select-text"
      style={{ fontFeatureSettings: '"kern" 1, "liga" 1' }}
    >
      {/* Left curved royal-blue QRO-patterned ribbon */}
      <LeftBlueRibbon shortName={certBodyShort} />

      {/* Center subtle paper watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center pl-[72px] pt-[70px]">
        <CenterWatermark shortName={certBodyShort} />
      </div>

      {/* Main content container offset cleanly past left ribbon curve */}
      <div className="relative z-10 flex h-full flex-col justify-between pl-[110px] pr-[34px] pt-[24px] pb-[20px]">
        {/* Top Right Brand Logo */}
        <div className="flex justify-end pr-[4px]">
          <img
            src="/assets/aistudio/QRO_Quality_Research_Logo_e371f7cb.png"
            alt={`${certBodyShort} — ${certBodyFull}`}
            referrerPolicy="no-referrer"
            className="w-[248px] h-[116px] object-contain mix-blend-multiply brightness-105 contrast-105"
          />
        </div>

        {/* Center Certificate Hierarchy */}
        <div className="flex flex-col items-center text-center -mt-2">
          <h1 className="font-serif italic font-bold text-[43px] leading-[1.12] tracking-[-0.01em] text-slate-950">
            Certificate of Registration
          </h1>

          <p className="mt-[14px] font-serif text-[16.5px] leading-[1.3] text-slate-900">
            This is to certify that
          </p>

          <h2 className="mt-[10px] font-sans font-extrabold uppercase text-[32px] leading-[1.14] tracking-[0.015em] text-black max-w-[610px] break-words">
            {clientName}
          </h2>

          <div className="mt-[10px] font-serif font-bold uppercase text-[17.5px] leading-[1.38] text-slate-950 max-w-[610px]">
            {clientAddressLines.length > 0 ? (
              clientAddressLines.map((line, index) => (
                <div key={index}>{line}</div>
              ))
            ) : (
              <div className="text-slate-400">CLIENT REGISTERED ADDRESS</div>
            )}
          </div>

          <p className="mt-[16px] font-serif text-[17px] leading-[1.35] text-slate-900">
            has been independently assessed by {certBodyShort}
            <br />
            and is compliant with the requirement of:
          </p>

          <div className="mt-[14px] font-sans font-extrabold text-[44px] leading-[1.06] tracking-[-0.015em] text-black">
            {isoStandard}
          </div>

          <div className="mt-[4px] font-sans font-bold text-[22px] leading-[1.22] text-black">
            {systemTitle}
          </div>

          <p className="mt-[14px] font-serif text-[16.5px] leading-[1.35] text-slate-900">
            For the following scope of activities:
          </p>

          <div className="mt-[10px] font-serif font-bold uppercase text-[20px] leading-[1.32] text-black max-w-[600px] break-words">
            {scopeLines.length > 0 ? (
              scopeLines.map((line, index) => <div key={index}>{line}</div>)
            ) : (
              <div className="text-slate-400">SCOPE OF ACTIVITIES</div>
            )}
          </div>
        </div>

        {/* Dates & Certificate ID Block */}
        <div className="mt-[10px] flex flex-col items-center">
          <div className="grid w-full max-w-[620px] grid-cols-2 items-center text-[13.5px] leading-[1.68] text-slate-950 font-sans">
            <div className="border-r border-slate-500 pr-[18px] text-left">
              <div>
                <span className="font-medium">Date of Certification: </span>
                <span className="font-semibold">
                  <FormattedDateDisplay value={data.date_of_certification} />
                </span>
              </div>
              <div>
                <span className="font-medium">1</span>
                <sup className="text-[0.72em] font-medium">st</sup>
                <span className="font-medium"> Surveillance Audit Due: </span>
                <span className="font-semibold">
                  <FormattedDateDisplay value={data.first_surveillance_due} />
                </span>
              </div>
            </div>

            <div className="pl-[20px] text-left">
              <div>
                <span className="font-medium">2</span>
                <sup className="text-[0.72em] font-medium">nd</sup>
                <span className="font-medium"> Surveillance Audit Due: </span>
                <span className="font-semibold">
                  <FormattedDateDisplay value={data.second_surveillance_due} />
                </span>
              </div>
              <div>
                <span className="font-medium">Certificate Expiry: </span>
                <span className="font-semibold">
                  <FormattedDateDisplay value={data.certificate_expiry} />
                </span>
              </div>
            </div>
          </div>

          <div className="mt-[14px] font-serif font-bold text-[19px] tracking-[0.01em] text-black tabular-nums">
            Certificate Number: {certNumber}
          </div>
        </div>

        {/* Bottom Accreditation Marks + Signature Row */}
        <div className="mt-[8px]">
          <div className="grid grid-cols-[1.05fr_auto_0.85fr_auto_1fr_auto_1fr] items-center gap-x-[10px] px-[4px]">
            <div className="flex justify-center">
              <img
                src="/assets/aistudio/QRO_Quality_Research_Logo_e371f7cb.png"
                alt={`${certBodyShort} — ${certBodyFull}`}
                referrerPolicy="no-referrer"
                className="w-[152px] h-[72px] object-contain mix-blend-multiply brightness-105 contrast-105"
              />
            </div>

            <div className="h-[66px] w-px bg-slate-500" aria-hidden="true" />

            <div className="flex justify-center">
              <EgacAccreditationMark cabNumber={data.cab_number} />
            </div>

            <div className="h-[66px] w-px bg-slate-500" aria-hidden="true" />

            <div className="flex justify-center">
              <IafMlaBadge />
            </div>

            <div className="h-[66px] w-px bg-slate-500" aria-hidden="true" />

            <div className="flex flex-col items-center justify-end pb-1">
              <HeadSignatureSvg />
              <div className="w-[132px] border-t border-slate-800 pt-[3px] text-center font-serif text-[12.5px] font-medium text-slate-950">
                Head of Certification
              </div>
            </div>
          </div>

          {/* Compliance & Verification Notice */}
          <div className="mt-[10px] text-center font-sans text-[10.5px] leading-[1.46] text-slate-950">
            <p>
              Validity of this certificate is subject to annual surveillance
              audits to be done successfully on or before 365 days from date of
              the audit.
            </p>
            <p>
              (In case surveillance audit is not allowed to be conducted; this
              certificate shall be suspended / withdrawn).
            </p>
            <p className="mt-[1px]">
              The Validity of this certificate can be verified at{' '}
              <span className="font-bold">{verificationUrl}</span>
            </p>
            <p className="mt-[1px]">
              This certificate of registration remains the property of{' '}
              {issuingLlp}, and shall be returned immediately upon request.
            </p>
          </div>

          {/* Horizontal Divider & Office Footer */}
          <div className="mt-[8px] border-t border-slate-700 pt-[7px] text-center font-sans text-[11.5px] leading-[1.42] text-slate-950">
            {officeLines.length > 0 ? (
              officeLines.map((line, index) => (
                <div
                  key={index}
                  className={index === 0 ? 'font-bold' : 'font-normal'}
                >
                  {line}
                </div>
              ))
            ) : (
              <div className="text-slate-400">Issuing Office Address</div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

import React from 'react';
import { Calendar, CheckCircle2, FileText, RotateCcw, Save, Sparkles } from 'lucide-react';
import {
  CERTIFICATE_FORM_FIELDS,
  CertificateFieldConfig,
  CertificateFieldKey,
  CertificateFormData,
  ISO_STANDARD_DEFAULT_TITLES,
  ISO_STANDARD_SAMPLE_SCOPES,
  STANDARD_CATALOG,
  STANDARD_CATEGORIES,
  ValidationErrors,
} from '../types/certificate';

interface CertificateFormProps {
  data: CertificateFormData;
  errors: ValidationErrors;
  onChange: (field: CertificateFieldKey, value: string) => void;
  onIsoStandardChange: (
    standard: string,
    suggestedTitle?: string,
    suggestedScope?: string
  ) => void;
  onApplySampleScope: () => void;
  onAutoCalculateDates: () => void;
  onLoadSample: () => void;
  onClearForm: () => void;
  onSaveToRegistry: () => void;
  onPrintPdf: () => void;
  saveStatusMessage: string | null;
}

const GROUP_TITLES: Record<CertificateFieldConfig['group'], string> = {
  client: '01. Client Organization Details',
  standard: '02. ISO Standard & Scope of Activities',
  dates: '03. Certificate ID & Surveillance Dates',
  body: '04. Certification Body & Verification',
};

const GROUP_ORDER: CertificateFieldConfig['group'][] = [
  'client',
  'standard',
  'dates',
  'body',
];

export const CertificateForm: React.FC<CertificateFormProps> = ({
  data,
  errors,
  onChange,
  onIsoStandardChange,
  onApplySampleScope,
  onAutoCalculateDates,
  onLoadSample,
  onClearForm,
  onSaveToRegistry,
  onPrintPdf,
  saveStatusMessage,
}) => {
  const handleSelectStandard = (value: string) => {
    const defaultTitle = ISO_STANDARD_DEFAULT_TITLES[value];
    const sampleScope = ISO_STANDARD_SAMPLE_SCOPES[value];
    onIsoStandardChange(value, defaultTitle, sampleScope);
  };

  const renderField = (field: CertificateFieldConfig) => {
    const id = `field-${field.name}`;
    const value = data[field.name] ?? '';
    const error = errors[field.name];
    const baseInputClass = `w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
      error
        ? 'border-red-500 focus:border-red-600'
        : 'border-slate-200 hover:border-slate-300 focus:border-blue-600'
    }`;

    return (
      <div key={field.name} className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor={id}
            className="block text-xs font-semibold text-slate-700 whitespace-nowrap"
          >
            {field.label}
            {field.required ? (
              <span className="ml-0.5 text-red-600" aria-hidden="true">
                *
              </span>
            ) : (
              <span className="ml-1.5 text-[11px] font-normal text-slate-400">
                Optional
              </span>
            )}
          </label>
          {field.name === 'scope_of_activities' &&
          ISO_STANDARD_SAMPLE_SCOPES[data.iso_standard] ? (
            <button
              type="button"
              onClick={onApplySampleScope}
              className="text-xs font-medium text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Use sample scope
            </button>
          ) : null}
        </div>

        {field.type === 'select' && field.name === 'iso_standard' ? (
          <select
            id={id}
            name={field.name}
            value={value}
            onChange={(e) => handleSelectStandard(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={baseInputClass}
          >
            {STANDARD_CATEGORIES.map((category) => (
              <optgroup key={category} label={category}>
                {STANDARD_CATALOG.filter((item) => item.category === category).map(
                  (item) => (
                    <option key={item.code} value={item.code}>
                      {item.code}
                    </option>
                  )
                )}
              </optgroup>
            ))}
          </select>
        ) : field.type === 'select' && field.options ? (
          <select
            id={id}
            name={field.name}
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={baseInputClass}
          >
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            id={id}
            name={field.name}
            rows={field.name === 'issuing_office_address' ? 3 : 2}
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onChange(field.name, e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`${baseInputClass} resize-y leading-relaxed`}
          />
        ) : (
          <input
            id={id}
            name={field.name}
            type={field.type === 'url' ? 'text' : field.type}
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onChange(field.name, e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`${baseInputClass} ${
              field.type === 'date' || field.name === 'certificate_number'
                ? 'tabular-nums font-mono text-[13px]'
                : ''
            }`}
          />
        )}

        {error ? (
          <p id={`${id}-error`} className="text-xs font-medium text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    );
  };

  const errorCount = Object.keys(errors).length;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onPrintPdf();
      }}
      noValidate
      className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden"
    >
      {/* Form Header & Quick Utilities */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 bg-slate-50/70">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            ISO Certificate Generation Form
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Live updates populate the A4 certificate preview character-for-character.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
            Load Sample
          </button>
          <button
            type="button"
            onClick={onClearForm}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            Clear
          </button>
        </div>
      </div>

      {/* Validation summary banner when invalid submission attempted */}
      {errorCount > 0 ? (
        <div
          role="alert"
          className="border-b border-red-200 bg-red-50 px-5 py-2.5 text-xs font-medium text-red-700"
        >
          Please resolve {errorCount} required{' '}
          {errorCount === 1 ? 'field' : 'fields'} highlighted below before
          exporting or saving.
        </div>
      ) : null}

      {saveStatusMessage ? (
        <div
          role="status"
          className="flex items-center gap-2 border-b border-emerald-200 bg-emerald-50 px-5 py-2.5 text-xs font-medium text-emerald-800"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          <span>{saveStatusMessage}</span>
        </div>
      ) : null}

      {/* Scrollable Fields */}
      <div className="divide-y divide-slate-100 px-5 py-2">
        {GROUP_ORDER.map((groupKey) => {
          const fields = CERTIFICATE_FORM_FIELDS.filter(
            (f) => f.group === groupKey
          );
          const isDatesGroup = groupKey === 'dates';

          return (
            <section key={groupKey} className="py-4 space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold tracking-tight text-slate-800">
                  {GROUP_TITLES[groupKey]}
                </h3>
                {isDatesGroup ? (
                  <button
                    type="button"
                    onClick={onAutoCalculateDates}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
                    title="Calculate 1st/2nd surveillance and 3-year expiry dates from Date of Certification"
                  >
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    Auto-fill audit dates
                  </button>
                ) : null}
              </div>
              <div
                className={
                  isDatesGroup
                    ? 'grid grid-cols-1 sm:grid-cols-2 gap-3.5'
                    : 'space-y-3.5'
                }
              >
                {fields.map((field) => {
                  if (isDatesGroup && field.name === 'certificate_number') {
                    return (
                      <div key={field.name} className="sm:col-span-2">
                        {renderField(field)}
                      </div>
                    );
                  }
                  return renderField(field);
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Sticky Form Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3.5">
        <button
          type="button"
          onClick={onSaveToRegistry}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Save className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
          Save to Registry
        </button>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          Generate & Print PDF
        </button>
      </div>
    </form>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { Printer, ZoomIn, ZoomOut } from 'lucide-react';
import {
  CertificateFieldKey,
  CertificateFormData,
  EMPTY_CERTIFICATE_DATA,
  ISO_STANDARD_DEFAULT_TITLES,
  ISO_STANDARD_SAMPLE_SCOPES,
  IsoStandardOption,
  SAMPLE_CERTIFICATE_DATA,
  SavedCertificateRecord,
  ValidationErrors,
} from './types/certificate';
import {
  calculateSurveillanceDates,
  createCertificateRecordId,
  validateCertificateData,
} from './utils/certificateLogic';
import { CertificateForm } from './components/CertificateForm';
import { CertificateSheet } from './components/CertificateSheet';
import { SavedRegistryView } from './components/SavedRegistryView';
import { ReferenceComparisonView } from './components/ReferenceComparisonView';

type ActiveView = 'generator' | 'registry' | 'reference';
type ZoomMode = 'fit' | '75' | '100';

const STORAGE_KEY = 'iso_certificate_studio_registry_v1';

function loadInitialRegistry(): SavedCertificateRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fall back to default seeded record when storage is unavailable
  }

  return [
    {
      id: 'seed_shnahal_305026101578Q',
      createdAt: '2026-10-15T09:00:00.000Z',
      updatedAt: '2026-10-15T09:00:00.000Z',
      data: SAMPLE_CERTIFICATE_DATA,
    },
  ];
}

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('generator');
  const [formData, setFormData] = useState<CertificateFormData>(
    SAMPLE_CERTIFICATE_DATA
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [registry, setRegistry] = useState<SavedCertificateRecord[]>(
    loadInitialRegistry
  );
  const [activeRecordId, setActiveRecordId] = useState<string | null>(
    'seed_shnahal_305026101578Q'
  );
  const [saveStatusMessage, setSaveStatusMessage] = useState<string | null>(
    null
  );
  const [zoomMode, setZoomMode] = useState<ZoomMode>('fit');
  const [fitScale, setFitScale] = useState<number>(0.76);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  // Persist registry changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [registry]);

  // Responsive fit scale calculation for the 794px A4 certificate sheet
  useEffect(() => {
    const updateFitScale = () => {
      const el = previewContainerRef.current;
      if (!el) return;
      const availableWidth = Math.max(300, el.clientWidth - 48);
      const nextScale = Math.min(0.95, Math.max(0.38, availableWidth / 794));
      setFitScale(Number(nextScale.toFixed(3)));
    };

    updateFitScale();
    const observer = new ResizeObserver(updateFitScale);
    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }
    window.addEventListener('resize', updateFitScale);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateFitScale);
    };
  }, [activeView]);

  const effectiveScale =
    zoomMode === '100' ? 1 : zoomMode === '75' ? 0.75 : fitScale;

  const handleFieldChange = (field: CertificateFieldKey, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveStatusMessage(null);
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleIsoStandardChange = (
    standard: string,
    suggestedTitle?: string,
    suggestedScope?: string
  ) => {
    setFormData((prev) => {
      const currentTitle = prev.management_system_title.trim();
      const knownDefaultTitles = Object.values(ISO_STANDARD_DEFAULT_TITLES);
      const isDefaultOrEmptyTitle =
        !currentTitle ||
        knownDefaultTitles.includes(currentTitle) ||
        currentTitle ===
          ISO_STANDARD_DEFAULT_TITLES[prev.iso_standard as IsoStandardOption];

      const currentScope = prev.scope_of_activities.trim();
      const knownSampleScopes = Object.values(ISO_STANDARD_SAMPLE_SCOPES);
      const isDefaultOrEmptyScope =
        !currentScope || knownSampleScopes.includes(currentScope);

      return {
        ...prev,
        iso_standard: standard,
        management_system_title:
          isDefaultOrEmptyTitle && suggestedTitle
            ? suggestedTitle
            : prev.management_system_title,
        scope_of_activities:
          isDefaultOrEmptyScope && suggestedScope
            ? suggestedScope
            : prev.scope_of_activities,
      };
    });
    setSaveStatusMessage(null);
  };

  const handleApplySampleScope = () => {
    const sampleScope = ISO_STANDARD_SAMPLE_SCOPES[formData.iso_standard];
    if (!sampleScope) return;
    setFormData((prev) => ({
      ...prev,
      scope_of_activities: sampleScope,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.scope_of_activities;
      return next;
    });
    setSaveStatusMessage(
      `Applied sample scope for ${formData.iso_standard}.`
    );
  };

  const handleAutoCalculateDates = () => {
    const computed = calculateSurveillanceDates(formData.date_of_certification);
    if (!computed) {
      setErrors((prev) => ({
        ...prev,
        date_of_certification:
          'Enter a valid Date of Certification first to auto-fill audit dates.',
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      ...computed,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.date_of_certification;
      delete next.first_surveillance_due;
      delete next.second_surveillance_due;
      delete next.certificate_expiry;
      return next;
    });
    setSaveStatusMessage(
      'Surveillance and 3-year expiry dates calculated from Date of Certification.'
    );
  };

  const handleLoadSample = () => {
    setFormData(SAMPLE_CERTIFICATE_DATA);
    setErrors({});
    setSaveStatusMessage('Sample payload (SHNAHAL FOODS) loaded.');
  };

  const handleClearForm = () => {
    setFormData(EMPTY_CERTIFICATE_DATA);
    setActiveRecordId(null);
    setErrors({});
    setSaveStatusMessage(null);
  };

  const handleSaveToRegistry = () => {
    const validation = validateCertificateData(formData);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setSaveStatusMessage(null);
      return;
    }

    const now = new Date().toISOString();
    const existingIndex = activeRecordId
      ? registry.findIndex((r) => r.id === activeRecordId)
      : -1;

    if (existingIndex >= 0) {
      const updated = [...registry];
      updated[existingIndex] = {
        ...updated[existingIndex],
        updatedAt: now,
        data: { ...formData },
      };
      setRegistry(updated);
      setSaveStatusMessage(
        `Updated "${formData.client_name}" (${formData.certificate_number}) in registry.`
      );
    } else {
      const newId = createCertificateRecordId(formData.certificate_number);
      const newRecord: SavedCertificateRecord = {
        id: newId,
        createdAt: now,
        updatedAt: now,
        data: { ...formData },
      };
      setRegistry((prev) => [newRecord, ...prev]);
      setActiveRecordId(newId);
      setSaveStatusMessage(
        `Saved "${formData.client_name}" (${formData.certificate_number}) to registry.`
      );
    }
  };

  const handlePrintPdf = () => {
    const validation = validateCertificateData(formData);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setActiveView('generator');
      return;
    }
    if (activeView !== 'generator') {
      setActiveView('generator');
      setTimeout(() => window.print(), 120);
      return;
    }
    window.print();
  };

  const handleLoadRecord = (record: SavedCertificateRecord) => {
    setFormData({ ...record.data });
    setActiveRecordId(record.id);
    setErrors({});
    setSaveStatusMessage(
      `Loaded "${record.data.client_name}" into certificate editor.`
    );
    setActiveView('generator');
  };

  const handleDuplicateRecord = (record: SavedCertificateRecord) => {
    const now = new Date().toISOString();
    const copyId = createCertificateRecordId(record.data.certificate_number);
    const duplicated: SavedCertificateRecord = {
      id: copyId,
      createdAt: now,
      updatedAt: now,
      data: {
        ...record.data,
        certificate_number: `${record.data.certificate_number}-COPY`,
      },
    };
    setRegistry((prev) => [duplicated, ...prev]);
  };

  const handleDeleteRecord = (id: string) => {
    setRegistry((prev) => prev.filter((item) => item.id !== id));
    if (activeRecordId === id) {
      setActiveRecordId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: [Brand title, one line] — [nav links] — [1 primary action] */}
      <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-[1480px] flex-wrap items-center justify-between gap-x-4 gap-y-2 md:flex-nowrap md:gap-8 px-4 sm:px-6 py-2.5 md:py-3.5">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => setActiveView('generator')}
            className="flex items-center gap-2 text-sm sm:text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <img
              src="/favicon.svg"
              alt=""
              className="h-6 w-6 rounded-md"
              aria-hidden="true"
            />
            <span>ISO Certificate Studio</span>
          </button>

          {/* Zone 2: Clean single-line navigation links */}
          <nav
            aria-label="Workspace views"
            className="order-3 flex w-full items-center justify-between border-t border-slate-100 pt-1.5 md:order-none md:w-auto md:justify-center md:border-0 md:pt-0 gap-4 sm:gap-7 text-xs sm:text-sm font-medium"
          >
            <button
              type="button"
              onClick={() => setActiveView('generator')}
              className={`border-b-2 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'generator'
                  ? 'border-blue-600 text-slate-950 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-950'
              }`}
            >
              Generator
            </button>
            <button
              type="button"
              onClick={() => setActiveView('registry')}
              className={`border-b-2 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                activeView === 'registry'
                  ? 'border-blue-600 text-slate-950 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-950'
              }`}
            >
              Saved Registry ({registry.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveView('reference')}
              className={`border-b-2 py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'reference'
                  ? 'border-blue-600 text-slate-950 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-950'
              }`}
            >
              Reference ISO
            </button>
          </nav>

          {/* Zone 3: 1 primary CTA */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-slate-900 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 mx-auto w-full max-w-[1480px] px-4 sm:px-6 py-6 print:p-0 print:max-w-none">
        {activeView === 'generator' ? (
          <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-6 items-start print:block">
            {/* Left Column: Certificate Input Form */}
            <div className="no-print">
              <CertificateForm
                data={formData}
                errors={errors}
                onChange={handleFieldChange}
                onIsoStandardChange={handleIsoStandardChange}
                onApplySampleScope={handleApplySampleScope}
                onAutoCalculateDates={handleAutoCalculateDates}
                onLoadSample={handleLoadSample}
                onClearForm={handleClearForm}
                onSaveToRegistry={handleSaveToRegistry}
                onPrintPdf={handlePrintPdf}
                saveStatusMessage={saveStatusMessage}
              />
            </div>

            {/* Right Column: Live Print-Ready A4 Preview Stage */}
            <section
              aria-label="Live Certificate Preview"
              className="print-stage flex flex-col rounded-xl border border-slate-200 bg-slate-100/90 overflow-hidden print:border-0 print:rounded-none print:bg-white"
            >
              {/* Preview Toolbar */}
              <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">
                    A4 Portrait Preview
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">210 × 297 mm</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-slate-700 tabular-nums">
                    {formData.certificate_number || 'UNASSIGNED'}
                  </span>
                </div>

                <div
                  className="flex items-center gap-1 rounded-lg bg-slate-100 p-1"
                  role="group"
                  aria-label="Preview zoom controls"
                >
                  <button
                    type="button"
                    onClick={() => setZoomMode('fit')}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      zoomMode === 'fit'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Fit ({Math.round(fitScale * 100)}%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomMode('75')}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      zoomMode === '75'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ZoomOut className="h-3 w-3" aria-hidden="true" />
                    75%
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomMode('100')}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      zoomMode === '100'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ZoomIn className="h-3 w-3" aria-hidden="true" />
                    100%
                  </button>
                </div>
              </div>

              {/* Scaled A4 Sheet Stage */}
              <div
                ref={previewContainerRef}
                className="flex justify-center overflow-auto p-6 print:p-0 print:overflow-visible"
              >
                <div
                  className="print-scale-wrapper origin-top transition-transform duration-150"
                  style={{
                    width: `${794 * effectiveScale}px`,
                    height: `${1123 * effectiveScale}px`,
                  }}
                >
                  <div
                    className="origin-top-left print:transform-none!"
                    style={{
                      transform: `scale(${effectiveScale})`,
                      width: '794px',
                      height: '1123px',
                    }}
                  >
                    <CertificateSheet
                      id="printable-iso-certificate"
                      data={formData}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : activeView === 'registry' ? (
          <SavedRegistryView
            records={registry}
            activeRecordId={activeRecordId}
            onLoadRecord={handleLoadRecord}
            onDuplicateRecord={handleDuplicateRecord}
            onDeleteRecord={handleDeleteRecord}
            onCreateNew={() => {
              handleClearForm();
              setActiveView('generator');
            }}
          />
        ) : (
          <ReferenceComparisonView
            currentData={formData}
            onReturnToEditor={() => setActiveView('generator')}
          />
        )}
      </main>
    </div>
  );
}

import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { CertificateFormData, CERTIFICATE_FORM_FIELDS } from '../types/certificate';
import { CertificateSheet } from './CertificateSheet';

interface ReferenceComparisonViewProps {
  currentData: CertificateFormData;
  onReturnToEditor: () => void;
}

export const ReferenceComparisonView: React.FC<ReferenceComparisonViewProps> = ({
  currentData,
  onReturnToEditor,
}) => {
  return (
    <div className="mx-auto max-w-[1380px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Reference ISO PDF & Visual Alignment
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Compare your attached QRO certificate template directly against the
            live generated A4 layout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/assets/aistudio/QRO_Certificate_HD_e4827f23.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Open Source PDF
          </a>
          <button
            type="button"
            onClick={onReturnToEditor}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Back to Generator
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Original Attached Reference (QRO_Certificate_HD_e4827f23.pdf)
            </span>
            <span className="text-xs text-slate-500">A4 Portrait Source</span>
          </div>
          <div className="bg-slate-100 p-4 flex justify-center">
            <iframe
              src="/assets/aistudio/QRO_Certificate_HD_e4827f23.pdf#toolbar=0&view=FitH"
              title="Original QRO ISO Certificate Reference PDF"
              className="w-full h-[760px] rounded-lg border border-slate-200 bg-white"
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Live Generated Certificate Layout
            </span>
            <span className="text-xs text-slate-500">Print-Ready Vector</span>
          </div>
          <div className="bg-slate-100 p-4 flex justify-center overflow-hidden">
            <div className="origin-top scale-[0.65] sm:scale-[0.68] -mb-[380px]">
              <CertificateSheet data={currentData} />
            </div>
          </div>
        </div>
      </div>

      {/* Strict Field Mapping Reference Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
          <h2 className="text-xs font-bold text-slate-900">
            Active Field Mapping ({CERTIFICATE_FORM_FIELDS.length} Schema Fields)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-5 py-2.5 font-semibold">Schema Key</th>
                <th className="px-5 py-2.5 font-semibold">Label</th>
                <th className="px-5 py-2.5 font-semibold">Current Rendered Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CERTIFICATE_FORM_FIELDS.map((field) => (
                <tr key={field.name} className="hover:bg-slate-50/70">
                  <td className="px-5 py-2.5 font-mono text-slate-700 whitespace-nowrap">
                    {field.name}
                  </td>
                  <td className="px-5 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                    {field.label}
                  </td>
                  <td className="px-5 py-2.5 text-slate-700 whitespace-pre-line">
                    {currentData[field.name] || (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

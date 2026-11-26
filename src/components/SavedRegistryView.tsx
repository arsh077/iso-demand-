import React, { useState } from 'react';
import { Copy, FilePlus2, Search, Trash2, Upload } from 'lucide-react';
import {
  ISO_STANDARD_OPTIONS,
  SavedCertificateRecord,
} from '../types/certificate';
import {
  filterCertificateRecords,
  formatCertificateDate,
} from '../utils/certificateLogic';

interface SavedRegistryViewProps {
  records: SavedCertificateRecord[];
  activeRecordId: string | null;
  onLoadRecord: (record: SavedCertificateRecord) => void;
  onDuplicateRecord: (record: SavedCertificateRecord) => void;
  onDeleteRecord: (id: string) => void;
  onCreateNew: () => void;
}

export const SavedRegistryView: React.FC<SavedRegistryViewProps> = ({
  records,
  activeRecordId,
  onLoadRecord,
  onDuplicateRecord,
  onDeleteRecord,
  onCreateNew,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [standardFilter, setStandardFilter] = useState<string>('ALL');

  const filtered = filterCertificateRecords(
    records,
    searchQuery,
    standardFilter
  );

  return (
    <div className="mx-auto max-w-[1280px] space-y-6">
      {/* Header & Search Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Issued Certificate Registry
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {records.length}{' '}
            {records.length === 1 ? 'certificate' : 'certificates'} stored
            locally for instant editing, duplication, and print export.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <FilePlus2 className="h-4 w-4" aria-hidden="true" />
          New Certificate
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search client, certificate no., or scope..."
            aria-label="Search saved certificates"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        <div
          className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1"
          role="group"
          aria-label="Filter by ISO standard"
        >
          <button
            type="button"
            onClick={() => setStandardFilter('ALL')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              standardFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Standards
          </button>
          {ISO_STANDARD_OPTIONS.map((std) => (
            <button
              key={std}
              type="button"
              onClick={() => setStandardFilter(std)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                standardFilter === std
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {std}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State or Populated Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
          <p className="text-sm font-semibold text-slate-900">
            {records.length === 0
              ? 'No certificates saved yet'
              : 'No certificates match your current filter'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {records.length === 0
              ? 'Fill out the ISO Certificate Form and save a certificate to manage it here.'
              : 'Clear your search query or select All Standards to view saved entries.'}
          </p>
          {records.length === 0 ? (
            <button
              type="button"
              onClick={onCreateNew}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
            >
              Create First Certificate
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStandardFilter('ALL');
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                <th className="px-4 py-3">Certificate No.</th>
                <th className="px-4 py-3">Client / Organization</th>
                <th className="px-4 py-3">ISO Standard</th>
                <th className="px-4 py-3">Issued</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((record) => {
                const issued = formatCertificateDate(
                  record.data.date_of_certification
                );
                const expiry = formatCertificateDate(
                  record.data.certificate_expiry
                );
                const isActive = activeRecordId === record.id;

                return (
                  <tr
                    key={record.id}
                    className={`transition-colors hover:bg-slate-50/80 ${
                      isActive ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      {record.data.certificate_number}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">
                        {record.data.client_name}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500 line-clamp-1 max-w-md">
                        {record.data.scope_of_activities}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">
                      <span className="font-semibold text-slate-900">
                        {record.data.iso_standard}
                      </span>
                      <span className="mx-1.5 text-slate-300" aria-hidden="true">
                        ·
                      </span>
                      <span>{record.data.certification_body_short}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 tabular-nums whitespace-nowrap">
                      {issued?.plain ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 tabular-nums whitespace-nowrap">
                      {expiry?.plain ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onLoadRecord(record)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                          Load
                        </button>
                        <button
                          type="button"
                          onClick={() => onDuplicateRecord(record)}
                          aria-label={`Duplicate ${record.data.client_name}`}
                          title="Duplicate certificate"
                          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                        >
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRecord(record.id)}
                          aria-label={`Delete ${record.data.client_name}`}
                          title="Delete certificate"
                          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

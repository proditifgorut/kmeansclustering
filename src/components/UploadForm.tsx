import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, BarChart, Settings, Loader, AlertTriangle } from 'lucide-react';
import { Point } from '../types';
import { ColumnSelector } from './ColumnSelector';

interface UploadFormProps {
  onDataLoaded: (data: Point[], allHeaders: string[], file: File) => void;
  onColumnsSelected: (selected: string[]) => void;
  onKChange: (k: number) => void;
  k: number;
  onProcess: () => void;
  isLoading: boolean;
  file: File | null;
  allNumericHeaders: string[];
  selectedColumns: string[];
}

export const UploadForm: React.FC<UploadFormProps> = ({ 
  onDataLoaded, onColumnsSelected, onKChange, k, onProcess, isLoading, file, allNumericHeaders, selectedColumns 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setParseError(null);
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          const numericHeaders = (results.meta.fields || []).filter(field =>
            results.data.length > 0 && results.data.every((row: any) => typeof row[field] === 'number' || row[field] === null)
          );

          if (numericHeaders.length < 2) {
            setParseError('CSV harus berisi setidaknya 2 kolom numerik.');
            return;
          }
          onDataLoaded(results.data as Point[], numericHeaders, selectedFile);
        },
        error: (err) => {
          setParseError(`Gagal mem-parsing file: ${err.message}`);
        }
      });
    }
  };
  
  const canProcess = selectedColumns.length >= 2 && selectedColumns.length <= 3 && !isLoading;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
          <Settings size={22} className="text-brand-purple" />
          Konfigurasi
        </h2>
        <p className="text-sm text-slate-400">Unggah data dan atur parameter.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            1. Unggah Dataset (.csv)
          </label>
          <div
            className="flex cursor-pointer justify-center rounded-lg border-2 border-dashed border-dark-border px-6 py-10 hover:border-brand-purple"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              {file ? (
                <>
                  <FileText className="mx-auto h-12 w-12 text-green-400" />
                  <p className="mt-2 font-semibold text-green-400">{file.name}</p>
                  <p className="text-xs text-slate-400">Klik untuk mengunggah file lain</p>
                </>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-slate-500" />
                  <p className="mt-2 text-sm text-slate-400">
                    <span className="font-semibold text-brand-purple">Klik untuk mengunggah</span> atau seret & lepas
                  </p>
                  <p className="text-xs text-slate-500">Hanya file CSV</p>
                </>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            accept=".csv"
            onChange={handleFileChange}
          />
          {parseError && <p className="mt-2 text-sm text-red-400 flex items-center gap-2"><AlertTriangle size={16}/> {parseError}</p>}
        </div>

        {allNumericHeaders.length > 0 && (
          <ColumnSelector
            allHeaders={allNumericHeaders}
            selectedHeaders={selectedColumns}
            onSelectionChange={onColumnsSelected}
          />
        )}

        <div>
          <label htmlFor="cluster-count" className="mb-1 block text-sm font-medium text-slate-300">
            3. Jumlah Klaster (K)
          </label>
          <input
            type="number"
            id="cluster-count"
            className="input-field"
            value={k}
            onChange={(e) => onKChange(Math.max(2, parseInt(e.target.value) || 2))}
            min="2"
            max="20"
          />
        </div>
      </div>

      <button onClick={onProcess} disabled={!canProcess} className="btn btn-primary w-full">
        {isLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            <BarChart className="mr-2 h-4 w-4" />
            Proses K-Means
          </>
        )}
      </button>
    </div>
  );
};

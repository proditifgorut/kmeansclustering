import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, Play, Loader, BrainCircuit, SlidersHorizontal, AlertTriangle } from 'lucide-react';
import { Point } from '../types';
import { Slider } from './ui/Slider';
import { ColumnSelector } from './ColumnSelector';

interface PsoUploadFormProps {
  file: File | null;
  onDataLoaded: (data: Point[], headers: string[], file: File) => void;
  allNumericHeaders: string[];
  selectedColumns: string[];
  onColumnsSelected: (selected: string[]) => void;
  k: number; onKChange: (v: number) => void;
  swarmSize: number; onSwarmSizeChange: (v: number) => void;
  psoIterations: number; onPsoIterationsChange: (v: number) => void;
  inertiaWeight: number; onInertiaWeightChange: (v: number) => void;
  c1: number; onC1Change: (v: number) => void;
  c2: number; onC2Change: (v: number) => void;
  onProcess: () => void;
  isLoading: boolean;
}

export const PsoUploadForm: React.FC<PsoUploadFormProps> = (props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setParseError(null);
      Papa.parse(selectedFile, {
        header: true, skipEmptyLines: true, dynamicTyping: true,
        complete: (results) => {
          const numericHeaders = (results.meta.fields || []).filter(field =>
            results.data.length > 0 && results.data.every((row: any) => typeof row[field] === 'number' || row[field] === null)
          );
          if (numericHeaders.length < 2) {
            setParseError('CSV harus berisi setidaknya 2 kolom numerik.');
            return;
          }
          props.onDataLoaded(results.data as Point[], numericHeaders, selectedFile);
        },
        error: (err) => {
          setParseError(`Gagal mem-parsing file: ${err.message}`);
        }
      });
    }
  };
  
  const canProcess = props.selectedColumns.length >= 2 && props.selectedColumns.length <= 3 && !props.isLoading && props.file;

  return (
    <div className="card p-6">
      <div className="space-y-6">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
            <BrainCircuit size={22} className="text-brand-purple" />
            Konfigurasi Optimasi PSO
          </h2>
          <p className="text-sm text-slate-400">Unggah data dan atur parameter untuk algoritma PSO-KMeans.</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">1. Unggah Dataset (.csv)</label>
          <div
            className="flex cursor-pointer justify-center rounded-lg border-2 border-dashed border-dark-border px-6 py-10 hover:border-brand-purple"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              {props.file ? (
                <><FileText className="mx-auto h-12 w-12 text-green-400" /><p className="mt-2 font-semibold text-green-400">{props.file.name}</p><p className="text-xs text-slate-400">Klik untuk mengganti file</p></>
              ) : (
                <><Upload className="mx-auto h-12 w-12 text-slate-500" /><p className="mt-2 text-sm text-slate-400"><span className="font-semibold text-brand-purple">Klik untuk mengunggah</span></p><p className="text-xs text-slate-500">Hanya file CSV</p></>
              )}
            </div>
          </div>
          <input ref={fileInputRef} type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
          {parseError && <p className="mt-2 text-sm text-red-400 flex items-center gap-2"><AlertTriangle size={16}/> {parseError}</p>}
        </div>
        
        {props.allNumericHeaders.length > 0 && (
          <ColumnSelector
            allHeaders={props.allNumericHeaders}
            selectedHeaders={props.selectedColumns}
            onSelectionChange={props.onColumnsSelected}
          />
        )}

        <div className="space-y-4 rounded-lg border border-dark-border p-4">
          <h3 className="flex items-center gap-2 text-md font-semibold text-white"><SlidersHorizontal size={18} /> 3. Atur Parameter</h3>
          <Slider label="Jumlah Klaster (K)" value={props.k} onChange={props.onKChange} min={2} max={20} step={1} />
          <Slider label="Ukuran Swarm" value={props.swarmSize} onChange={props.onSwarmSizeChange} min={10} max={100} step={5} />
          <Slider label="Iterasi PSO" value={props.psoIterations} onChange={props.onPsoIterationsChange} min={10} max={200} step={5} />
          <Slider label="Bobot Inersia (w)" value={props.inertiaWeight} onChange={props.onInertiaWeightChange} min={0.1} max={1.2} step={0.05} />
          <Slider label="Koef. Kognitif (c1)" value={props.c1} onChange={props.onC1Change} min={0.1} max={3} step={0.1} />
          <Slider label="Koef. Sosial (c2)" value={props.c2} onChange={props.onC2Change} min={0.1} max={3} step={0.1} />
        </div>

        <button onClick={props.onProcess} disabled={!canProcess} className="btn btn-primary w-full">
          {props.isLoading ? (
            <><Loader className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
          ) : (
            <><Play className="mr-2 h-4 w-4" /> Proses Optimasi</>
          )}
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import Papa from 'papaparse';
import { KMeansResult, Point } from '../types';
import { Download, BarChart2, Hash, Sigma } from 'lucide-react';

interface ResultsDisplayProps {
  data: Point[];
  headers: string[];
  result: KMeansResult;
  file: File | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, headers, result, file }) => {
  const { assignments, centroids, inertia } = result;

  const clusterCounts = centroids.map((_, i) => assignments.filter(a => a === i).length);

  const handleExport = () => {
    const exportData = data.map((row, i) => ({
      ...row,
      Klaster: assignments[i] + 1,
    }));
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const originalFilename = file?.name.replace('.csv', '') || 'dataset';
    link.setAttribute('download', `${originalFilename}_terklaster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
            <BarChart2 size={22} className="text-brand-purple" />
            Hasil Analisis
          </h3>
          <button onClick={handleExport} className="btn btn-secondary">
            <Download className="mr-2 h-4 w-4" />
            Ekspor Hasil
          </button>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-slate-800/50 p-4">
            <h4 className="flex items-center gap-2 text-sm font-medium text-slate-400"><Sigma size={16} /> Total Inersia</h4>
            <p className="mt-1 text-2xl font-semibold text-white">{inertia?.toFixed(2) ?? 'N/A'}</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <h4 className="flex items-center gap-2 text-sm font-medium text-slate-400"><Hash size={16} /> Total Titik Data</h4>
            <p className="mt-1 text-2xl font-semibold text-white">{data.length}</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <h4 className="flex items-center gap-2 text-sm font-medium text-slate-400"><BarChart2 size={16} /> Klaster Ditemukan</h4>
            <p className="mt-1 text-2xl font-semibold text-white">{centroids.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="card overflow-hidden">
          <h3 className="p-4 font-semibold text-white">Posisi Centroid</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-slate-400">Klaster</th>
                  {headers.slice(0, 3).map(h => <th key={h} className="px-4 py-2 text-left font-medium text-slate-400">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {centroids.map((centroid, i) => (
                  <tr key={i} className="border-t border-dark-border">
                    <td className="px-4 py-2 font-bold text-brand-purple">Klaster {i + 1} ({clusterCounts[i]} item)</td>
                    {centroid.slice(0, 3).map((val, j) => <td key={j} className="px-4 py-2">{val.toFixed(3)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card overflow-hidden">
          <h3 className="p-4 font-semibold text-white">Data Terklaster (Contoh)</h3>
          <div className="max-h-96 overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-slate-800">
                <tr>
                  {headers.slice(0, 2).map(h => <th key={h} className="px-4 py-2 text-left font-medium text-slate-400">{h}</th>)}
                  <th className="px-4 py-2 text-left font-medium text-slate-400">Klaster</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 100).map((row, i) => (
                  <tr key={i} className="border-t border-dark-border">
                    {headers.slice(0, 2).map(h => <td key={h} className="px-4 py-2">{row[h]?.toFixed(2) ?? 'N/A'}</td>)}
                    <td className="px-4 py-2 font-semibold text-brand-purple">{assignments[i] + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

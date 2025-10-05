import React from 'react';
import { Point } from '../types';

interface DataTableProps {
  data: Point[];
  headers: string[];
}

export const DataTable: React.FC<DataTableProps> = ({ data, headers }) => {
  const displayHeaders = headers.length > 0 ? headers : Object.keys(data[0] || {});
  
  return (
    <div className="card overflow-hidden">
      <div className="p-4">
        <h3 className="font-semibold text-white">Pratinjau Dataset</h3>
        <p className="text-sm text-slate-400">Menampilkan 10 baris pertama. {headers.length > 0 ? "Kolom yang dipilih untuk visualisasi." : "Semua kolom terdeteksi."}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-dark-border">
          <thead className="bg-slate-800">
            <tr>
              {displayHeaders.map((header) => (
                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border bg-dark-card">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-700/50">
                {displayHeaders.map((header) => (
                  <td key={header} className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                    {typeof row[header] === 'number' ? (row[header] as number).toFixed(2) : row[header] ?? 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

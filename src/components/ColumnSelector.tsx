import React from 'react';
import { List } from 'lucide-react';

interface ColumnSelectorProps {
  allHeaders: string[];
  selectedHeaders: string[];
  onSelectionChange: (selected: string[]) => void;
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({ allHeaders, selectedHeaders, onSelectionChange }) => {
  const handleCheckboxChange = (header: string) => {
    const currentIndex = selectedHeaders.indexOf(header);
    const newSelected = [...selectedHeaders];

    if (currentIndex === -1) {
      newSelected.push(header);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    onSelectionChange(newSelected);
  };

  const error = selectedHeaders.length > 3;

  return (
    <div className="space-y-3 rounded-lg border border-dark-border p-4">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <List size={16} />
          2. Pilih Kolom untuk Visualisasi
        </h3>
        <p className="text-xs text-slate-400">Pilih 2 (untuk 2D) atau 3 (untuk 3D) kolom numerik.</p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {allHeaders.map(header => (
          <label key={header} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-brand-purple focus:ring-brand-purple"
              checked={selectedHeaders.includes(header)}
              onChange={() => handleCheckboxChange(header)}
            />
            <span className="text-sm text-slate-300 truncate" title={header}>{header}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-400">Anda hanya dapat memilih maksimal 3 kolom.</p>}
    </div>
  );
};

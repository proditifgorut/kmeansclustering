import React from 'react';
import { Play, SlidersHorizontal, Loader } from 'lucide-react';

interface SimulationControlsProps {
  k: number;
  onKChange: (k: number) => void;
  numPoints: number;
  onNumPointsChange: (n: number) => void;
  clusterSpread: number;
  onClusterSpreadChange: (s: number) => void;
  onRun: () => void;
  isLoading: boolean;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  k, onKChange, numPoints, onNumPointsChange, clusterSpread, onClusterSpreadChange, onRun, isLoading
}) => {
  return (
    <div className="card p-6">
      <div className="space-y-6">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
            <SlidersHorizontal size={22} className="text-brand-purple" />
            Parameter Simulasi
          </h2>
          <p className="text-sm text-slate-400">Atur parameter untuk menghasilkan data acak dan jalankan simulasi.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sim-k" className="mb-1 block text-sm font-medium text-slate-300">
              Jumlah Klaster (K)
            </label>
            <input
              type="number"
              id="sim-k"
              className="input-field"
              value={k}
              onChange={(e) => onKChange(Math.max(2, parseInt(e.target.value) || 2))}
              min="2"
              max="10"
            />
          </div>
          <div>
            <label htmlFor="sim-points" className="mb-1 block text-sm font-medium text-slate-300">
              Jumlah Titik Data
            </label>
            <input
              type="number"
              id="sim-points"
              className="input-field"
              value={numPoints}
              onChange={(e) => onNumPointsChange(Math.max(10, parseInt(e.target.value) || 10))}
              min="10"
              max="500"
              step="10"
            />
          </div>
        </div>
        <div>
            <label htmlFor="sim-spread" className="mb-1 block text-sm font-medium text-slate-300">
              Sebaran Klaster
            </label>
             <input
              id="sim-spread"
              type="range"
              min="1"
              max="20"
              value={clusterSpread}
              onChange={(e) => onClusterSpreadChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-purple"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>Rapat</span>
              <span>Menyebar</span>
            </div>
        </div>

        <button onClick={onRun} disabled={isLoading} className="btn btn-primary w-full">
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Menjalankan...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Hasilkan Data & Jalankan Simulasi
            </>
          )}
        </button>
      </div>
    </div>
  );
};

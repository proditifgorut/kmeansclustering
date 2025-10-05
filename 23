import React from 'react';
import { ArrowLeft, ArrowRight, FastForward, Rewind } from 'lucide-react';
import { KMeansIteration } from '../types';

interface StepControlProps {
  currentStep: number;
  history: KMeansIteration[];
  onStepChange: (newStep: number) => void;
}

export const StepControl: React.FC<StepControlProps> = ({ currentStep, history, onStepChange }) => {
  const totalSteps = history.length;
  const currentIterationData = history[currentStep];

  const getStepLabel = (step: KMeansIteration) => {
    if (step.stepName === 'Initialization') return 'Inisialisasi';
    const stepType = step.stepName === 'Assignment' ? 'Tetapkan Poin' : 'Perbarui Centroid';
    return `Iterasi ${step.iteration}: ${stepType}`;
  };

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Langkah-langkah Algoritma</h3>
        <span className="text-sm font-mono px-2 py-1 bg-slate-700 rounded-md">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>
      
      <div className="text-center py-2 bg-slate-800/50 rounded-lg">
        <p className="font-semibold text-brand-purple">{getStepLabel(currentIterationData)}</p>
      </div>

      <div className="space-y-3">
        <label htmlFor="step-slider" className="text-sm text-slate-400">Progres Langkah</label>
        <input
          id="step-slider"
          type="range"
          min="0"
          max={totalSteps - 1}
          value={currentStep}
          onChange={(e) => onStepChange(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-purple"
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => onStepChange(0)}
          disabled={currentStep === 0}
          className="btn btn-secondary"
          title="Ke Awal"
        >
          <Rewind size={16} />
        </button>
        <button
          onClick={() => onStepChange(currentStep - 1)}
          disabled={currentStep === 0}
          className="btn btn-secondary"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={() => onStepChange(currentStep + 1)}
          disabled={currentStep === totalSteps - 1}
          className="btn btn-secondary"
        >
          <ArrowRight size={16} />
        </button>
        <button
          onClick={() => onStepChange(totalSteps - 1)}
          disabled={currentStep === totalSteps - 1}
          className="btn btn-secondary"
          title="Ke Langkah Akhir"
        >
          <FastForward size={16} />
        </button>
      </div>
    </div>
  );
};

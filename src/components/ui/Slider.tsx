import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  help?: string;
}

export const Slider: React.FC<SliderProps> = ({ label, value, onChange, min, max, step, help }) => (
  <div>
    <label className="mb-1 flex justify-between text-sm font-medium text-slate-300">
      <span>{label}</span>
      <span className="font-mono text-brand-purple">{value}</span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-purple"
    />
    {help && <p className="text-xs text-slate-500 mt-1">{help}</p>}
  </div>
);

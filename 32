import React from 'react';
import Plot from 'react-plotly.js';

interface FitnessChartProps {
  history: number[];
}

export const FitnessChart: React.FC<FitnessChartProps> = ({ history }) => {
  const trace = {
    x: history.map((_, i) => i + 1),
    y: history,
    mode: 'lines+markers',
    type: 'scatter',
    line: {
      color: '#6d28d9',
      width: 2,
    },
    marker: {
      size: 4,
    }
  };

  const layout = {
    title: 'Konvergensi Fitness PSO (WCSS)',
    xaxis: { title: 'Iterasi PSO', gridcolor: "#334155" },
    yaxis: { title: 'Nilai Fitness (Semakin Rendah Semakin Baik)', gridcolor: "#334155" },
    autosize: true,
    paper_bgcolor: '#1e293b',
    plot_bgcolor: '#1e293b',
    font: { color: '#cbd5e1' },
    margin: { l: 80, r: 40, b: 50, t: 50 },
  };

  return (
    <div className="card p-4">
      <Plot
        data={[trace]}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '300px' }}
        config={{ responsive: true }}
      />
    </div>
  );
};

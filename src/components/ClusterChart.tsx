import React from 'react';
import Plot from 'react-plotly.js';
import { KMeansIteration, Point } from '../types';

interface ClusterChartProps {
  data: Point[];
  headers: string[];
  iteration: KMeansIteration;
}

const PLOTLY_COLORS = [
  '#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', 
  '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52'
];

export const ClusterChart: React.FC<ClusterChartProps> = ({ data, headers, iteration }) => {
  const { assignments, centroids, stepName, iteration: iterNum } = iteration;
  const is3D = headers.length >= 3;

  const traces: any[] = [];

  // Data points traces
  for (let i = 0; i < centroids.length; i++) {
    const clusterPoints = data.filter((_, index) => assignments[index] === i);
    traces.push({
      x: clusterPoints.map(p => p[headers[0]]),
      y: clusterPoints.map(p => p[headers[1]]),
      ...(is3D && { z: clusterPoints.map(p => p[headers[2]]) }),
      mode: 'markers',
      type: is3D ? 'scatter3d' : 'scatter',
      name: `Klaster ${i + 1}`,
      marker: { 
        color: PLOTLY_COLORS[i % PLOTLY_COLORS.length],
        size: 6,
        opacity: 0.8,
      },
    });
  }

  // Centroids trace
  traces.push({
    x: centroids.map(c => c[0]),
    y: centroids.map(c => c[1]),
    ...(is3D && { z: centroids.map(c => c[2]) }),
    mode: 'markers',
    type: is3D ? 'scatter3d' : 'scatter',
    name: 'Centroid',
    marker: {
      color: 'white',
      size: 12,
      symbol: 'diamond',
      line: {
        color: 'black',
        width: 2,
      },
    },
  });

  const getTitle = () => {
    if (stepName === 'Initialization') return 'Langkah 1: Inisialisasi Acak';
    if (stepName === 'Assignment') return `Iterasi ${iterNum} - Langkah 2: Penetapan Poin`;
    if (stepName === 'Update' && iterNum > 0) return `Hasil Akhir Klastering (Iterasi K-Means: ${iterNum})`;
    return 'Hasil Klastering Akhir (Dioptimalkan oleh PSO)';
  };

  const layout = {
    title: getTitle(),
    autosize: true,
    paper_bgcolor: '#1e293b',
    plot_bgcolor: '#1e293b',
    font: {
      color: '#cbd5e1'
    },
    legend: {
      orientation: 'h',
      y: -0.2,
      x: 0.5,
      xanchor: 'center',
    },
    scene: is3D ? {
      xaxis: { title: headers[0], backgroundcolor: "#0f172a", gridcolor: "#334155", zerolinecolor: "#334155" },
      yaxis: { title: headers[1], backgroundcolor: "#0f172a", gridcolor: "#334155", zerolinecolor: "#334155" },
      zaxis: { title: headers[2], backgroundcolor: "#0f172a", gridcolor: "#334155", zerolinecolor: "#334155" },
    } : {
      xaxis: { title: headers[0], gridcolor: "#334155" },
      yaxis: { title: headers[1], gridcolor: "#334155" },
    },
    margin: { l: 40, r: 40, b: 40, t: 80 },
    transition: {
      duration: 500,
      easing: 'cubic-in-out'
    },
  };

  return (
    <div className="card p-4">
      <Plot
        data={traces}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '500px' }}
        config={{ responsive: true }}
      />
    </div>
  );
};

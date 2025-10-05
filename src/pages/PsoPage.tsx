import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KMeansResult, Point } from '../types';
import { runPso, runKMeansWithInitialCentroids } from '../lib/pso-kmeans';
import { PsoUploadForm } from '../components/PsoUploadForm';
import { FitnessChart } from '../components/FitnessChart';
import { ClusterChart } from '../components/ClusterChart';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { Loader, AlertTriangle } from 'lucide-react';
import { KMeansIteration } from '../types';
import { DataTable } from '../components/DataTable';
import { PsoTheory } from '../components/PsoTheory';

function PsoPage() {
  // Data state
  const [data, setData] = useState<Point[]>([]);
  const [allNumericHeaders, setAllNumericHeaders] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  // K-Means param
  const [k, setK] = useState<number>(3);

  // PSO params
  const [swarmSize, setSwarmSize] = useState<number>(20);
  const [psoIterations, setPsoIterations] = useState<number>(50);
  const [inertiaWeight, setInertiaWeight] = useState<number>(0.7);
  const [c1, setC1] = useState<number>(1.5);
  const [c2, setC2] = useState<number>(1.5);

  // Results state
  const [finalResult, setFinalResult] = useState<KMeansResult | null>(null);
  const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDataLoaded = (d: Point[], h: string[], f: File) => {
    setData(d);
    setAllNumericHeaders(h);
    setFile(f);
    setSelectedColumns(h.slice(0, Math.min(h.length, 3)));
    setError(null);
    setFinalResult(null);
  };

  const handleProcess = () => {
    if (data.length === 0 || selectedColumns.length < 2) {
      setError('Silakan unggah dataset yang valid dan pilih kolom terlebih dahulu.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFinalResult(null);
    setFitnessHistory([]);

    setTimeout(() => {
      try {
        const numericData = data.map(row => selectedColumns.map(header => row[header] as number));
        
        // Run PSO
        const { bestCentroids, fitnessHistory: psoFitnessHistory } = runPso(numericData, k, {
          swarmSize, maxIterations: psoIterations, w: inertiaWeight, c1, c2,
        });
        setFitnessHistory(psoFitnessHistory);
        
        // Run K-Means with optimized centroids
        const finalClusteringResult = runKMeansWithInitialCentroids(numericData, k, bestCentroids);
        setFinalResult(finalClusteringResult);

      } catch (e: any) {
        setError(e.message || 'Terjadi kesalahan saat pemrosesan.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  };

  const mockIteration: KMeansIteration | null = finalResult ? {
    centroids: finalResult.centroids,
    assignments: finalResult.assignments,
    stepName: 'Hasil Optimasi PSO',
    iteration: finalResult.iterations || 0,
  } : null;

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <PsoUploadForm
            file={file}
            onDataLoaded={handleDataLoaded}
            allNumericHeaders={allNumericHeaders}
            selectedColumns={selectedColumns}
            onColumnsSelected={setSelectedColumns}
            k={k} onKChange={setK}
            swarmSize={swarmSize} onSwarmSizeChange={setSwarmSize}
            psoIterations={psoIterations} onPsoIterationsChange={setPsoIterations}
            inertiaWeight={inertiaWeight} onInertiaWeightChange={setInertiaWeight}
            c1={c1} onC1Change={setC1}
            c2={c2} onC2Change={setC2}
            onProcess={handleProcess}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-4 flex items-center gap-3 rounded-lg bg-red-900/50 p-4 text-red-300"
              >
                <AlertTriangle size={20} /> <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex min-h-[500px] w-full flex-col items-center justify-center gap-4 rounded-xl bg-dark-card"
            >
              <Loader className="animate-spin text-brand-purple" size={48} />
              <p className="text-lg">Menjalankan Optimasi PSO-KMeans...</p>
            </motion.div>
          )}

          <AnimatePresence>
            {!isLoading && finalResult && mockIteration && (
              <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <FitnessChart history={fitnessHistory} />
                <ClusterChart data={data} headers={selectedColumns} iteration={mockIteration} />
                <ResultsDisplay data={data} headers={selectedColumns} result={finalResult} file={file} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {!isLoading && !finalResult && data.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataTable data={data.slice(0, 10)} headers={allNumericHeaders} />
            </motion.div>
          )}
        </div>
      </div>
      <PsoTheory />
    </>
  );
}

export default PsoPage;

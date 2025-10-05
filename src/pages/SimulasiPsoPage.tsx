import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KMeansIteration, Point, KMeansResult } from '../types';
import { runKMeansWithInitialCentroids } from '../lib/pso-kmeans';
import { generateClusteredData } from '../lib/data-generator';
import { PsoControls } from '../components/PsoControls';
import { ClusterChart } from '../components/ClusterChart';
import { FitnessChart } from '../components/FitnessChart';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { Loader } from 'lucide-react';
import { runPso } from '../lib/pso-kmeans';
import { PsoTheory } from '../components/PsoTheory';

function SimulasiPsoPage() {
  const [data, setData] = useState<Point[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  
  // Data generation params
  const [k, setK] = useState<number>(4);
  const [numPoints, setNumPoints] = useState<number>(200);
  const [clusterSpread, setClusterSpread] = useState<number>(5);

  // PSO params
  const [swarmSize, setSwarmSize] = useState<number>(20);
  const [psoIterations, setPsoIterations] = useState<number>(50);
  const [inertiaWeight, setInertiaWeight] = useState<number>(0.7);
  const [c1, setC1] = useState<number>(1.5);
  const [c2, setC2] = useState<number>(1.5);

  // Results
  const [finalResult, setFinalResult] = useState<KMeansResult | null>(null);
  const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const handleRun = () => {
    setIsLoading(true);
    setFinalResult(null);
    setFitnessHistory([]);

    setTimeout(() => {
      // 1. Generate new data
      const { points, headers: newHeaders } = generateClusteredData(numPoints, k, clusterSpread);
      setData(points);
      setHeaders(newHeaders);
      const numericData = points.map(row => newHeaders.map(header => row[header] as number));

      // 2. Run PSO to find best initial centroids
      const { bestCentroids, fitnessHistory: psoFitnessHistory } = runPso(numericData, k, {
        swarmSize,
        maxIterations: psoIterations,
        w: inertiaWeight,
        c1,
        c2,
      });
      setFitnessHistory(psoFitnessHistory);
      
      // 3. Run K-Means with the optimized centroids
      const finalClusteringResult = runKMeansWithInitialCentroids(numericData, k, bestCentroids);
      setFinalResult(finalClusteringResult);

      setIsLoading(false);
    }, 200);
  };
  
  useEffect(() => {
    handleRun();
  }, []);

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
          <PsoControls
            k={k} onKChange={setK}
            numPoints={numPoints} onNumPointsChange={setNumPoints}
            clusterSpread={clusterSpread} onClusterSpreadChange={setClusterSpread}
            swarmSize={swarmSize} onSwarmSizeChange={setSwarmSize}
            psoIterations={psoIterations} onPsoIterationsChange={setPsoIterations}
            inertiaWeight={inertiaWeight} onInertiaWeightChange={setInertiaWeight}
            c1={c1} onC1Change={setC1}
            c2={c2} onC2Change={setC2}
            onRun={handleRun}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-8 space-y-8">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex min-h-[500px] w-full flex-col items-center justify-center gap-4 rounded-xl bg-dark-card"
            >
              <Loader className="animate-spin text-brand-purple" size={48} />
              <p className="text-lg">Menjalankan Simulasi Optimasi PSO...</p>
            </motion.div>
          )}
          <AnimatePresence>
            {!isLoading && finalResult && mockIteration && (
              <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <FitnessChart history={fitnessHistory} />
                <ClusterChart data={data} headers={headers} iteration={mockIteration} />
                <ResultsDisplay data={data} headers={headers} result={finalResult} file={null} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <PsoTheory />
    </>
  );
}

export default SimulasiPsoPage;

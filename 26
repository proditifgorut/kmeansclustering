import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KMeansIteration, Point } from '../types';
import { runKMeansStepByStep } from '../lib/kmeans-step';
import { generateClusteredData } from '../lib/data-generator';
import { SimulationControls } from '../components/SimulationControls';
import { ClusterChart } from '../components/ClusterChart';
import { StepControl } from '../components/StepControl';
import { Loader } from 'lucide-react';

function SimulationPage() {
  const [data, setData] = useState<Point[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [k, setK] = useState<number>(3);
  const [numPoints, setNumPoints] = useState<number>(150);
  const [clusterSpread, setClusterSpread] = useState<number>(5);

  const [history, setHistory] = useState<KMeansIteration[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const handleRunSimulation = () => {
    setIsLoading(true);
    setHistory([]);
    setCurrentStep(0);

    // Use a timeout to allow the loader to render before heavy computation
    setTimeout(() => {
      const { points, headers: newHeaders } = generateClusteredData(numPoints, k, clusterSpread);
      setData(points);
      setHeaders(newHeaders);

      const numericData = points.map(row => newHeaders.map(header => row[header] as number));
      const kmeansHistory = runKMeansStepByStep(numericData, k);
      setHistory(kmeansHistory);
      setIsLoading(false);
    }, 200);
  };
  
  // Run simulation on initial load
  useEffect(() => {
    handleRunSimulation();
  }, []);

  const isProcessed = history.length > 0;
  const currentIteration = isProcessed ? history[currentStep] : null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="lg:col-span-4 space-y-6">
        <SimulationControls
          k={k}
          onKChange={setK}
          numPoints={numPoints}
          onNumPointsChange={setNumPoints}
          clusterSpread={clusterSpread}
          onClusterSpreadChange={setClusterSpread}
          onRun={handleRunSimulation}
          isLoading={isLoading}
        />
        <AnimatePresence>
          {isProcessed && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <StepControl 
                currentStep={currentStep}
                history={history}
                onStepChange={setCurrentStep}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="lg:col-span-8">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[500px] w-full flex-col items-center justify-center gap-4 rounded-xl bg-dark-card"
          >
            <Loader className="animate-spin text-brand-purple" size={48} />
            <p className="text-lg">Menghasilkan data dan mengklaster...</p>
          </motion.div>
        )}
        <AnimatePresence>
          {!isLoading && currentIteration && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={currentStep}
            >
              <ClusterChart data={data} headers={headers} iteration={currentIteration} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SimulationPage;

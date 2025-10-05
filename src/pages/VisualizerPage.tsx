import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadForm } from '../components/UploadForm';
import { DataTable } from '../components/DataTable';
import { ClusterChart } from '../components/ClusterChart';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { Theory } from '../components/Theory';
import { KMeansIteration, Point } from '../types';
import { runKMeansStepByStep, getFinalResultFromHistory } from '../lib/kmeans-step';
import { Loader, AlertTriangle } from 'lucide-react';
import { StepControl } from '../components/StepControl';

function VisualizerPage() {
  const [data, setData] = useState<Point[]>([]);
  const [allNumericHeaders, setAllNumericHeaders] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [k, setK] = useState<number>(3);
  const [history, setHistory] = useState<KMeansIteration[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDataLoaded = (d: Point[], h: string[], f: File) => {
    setData(d);
    setAllNumericHeaders(h);
    setFile(f);
    // Auto-select first 2 or 3 columns
    setSelectedColumns(h.slice(0, Math.min(h.length, 3)));
    setError(null);
    setHistory([]);
    setCurrentStep(0);
  };

  const handleProcess = async () => {
    if (data.length === 0 || k < 2 || selectedColumns.length < 2) {
      setError('Silakan unggah dataset, pilih 2-3 kolom, dan atur K ke 2 atau lebih.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setHistory([]);
    setCurrentStep(0);

    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const numericData = data.map(row => selectedColumns.map(header => row[header] as number));
      const kmeansHistory = runKMeansStepByStep(numericData, k);
      setHistory(kmeansHistory);
    } catch (e) {
      console.error(e);
      setError('Terjadi kesalahan saat klastering. Silakan periksa format data dan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const isProcessed = history.length > 0;
  const isFinalStep = isProcessed && currentStep === history.length - 1;
  const currentIteration = isProcessed ? history[currentStep] : null;
  const finalResult = isProcessed ? getFinalResultFromHistory(history, data.map(row => selectedColumns.map(header => row[header] as number))) : null;

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <div className="card p-6">
            <UploadForm
              onDataLoaded={handleDataLoaded}
              onColumnsSelected={setSelectedColumns}
              onKChange={setK}
              k={k}
              onProcess={handleProcess}
              isLoading={isLoading}
              file={file}
              allNumericHeaders={allNumericHeaders}
              selectedColumns={selectedColumns}
            />
          </div>
          
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
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 flex items-center gap-3 rounded-lg bg-red-900/50 p-4 text-red-300"
              >
                <AlertTriangle size={20} />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-96 w-full flex-col items-center justify-center gap-4 rounded-xl bg-dark-card"
            >
              <Loader className="animate-spin text-brand-purple" size={48} />
              <p className="text-lg">Sedang mengklaster data...</p>
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
                <motion.div>
                  <ClusterChart data={data} headers={selectedColumns} iteration={currentIteration} />
                </motion.div>
                
                {isFinalStep && finalResult && (
                   <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                   >
                      <ResultsDisplay data={data} headers={selectedColumns} result={finalResult} file={file} />
                   </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoading && !isProcessed && data.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataTable data={data.slice(0, 10)} headers={allNumericHeaders} />
            </motion.div>
          )}
        </div>
      </div>

      <Theory />
    </>
  );
}

export default VisualizerPage;

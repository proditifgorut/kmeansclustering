import { KMeansIteration, KMeansResult } from '../types';

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}

export function runKMeansStepByStep(data: number[][], k: number, maxIterations: number = 20): KMeansIteration[] {
  if (data.length === 0 || k < 1) {
    throw new Error('Data atau nilai k tidak valid untuk K-Means.');
  }
  if (data.length < k) {
    throw new Error('Jumlah klaster (k) tidak boleh lebih banyak dari jumlah titik data.');
  }

  const history: KMeansIteration[] = [];
  let iterationCount = 0;

  // 1. Initialization: Select first K points as initial centroids for deterministic behavior
  let centroids = data.slice(0, k).map(p => [...p]);
  let assignments = new Array(data.length).fill(-1);
  
  history.push({
    centroids: JSON.parse(JSON.stringify(centroids)),
    assignments,
    stepName: 'Initialization',
    iteration: iterationCount,
  });

  for (let i = 0; i < maxIterations; i++) {
    iterationCount = i + 1;
    let assignmentsChanged = false;

    // 2. Assignment Step
    const newAssignments = data.map((point, pointIndex) => {
      let minDistance = Infinity;
      let closestCentroidIndex = -1;
      centroids.forEach((centroid, centroidIndex) => {
        const distance = euclideanDistance(point, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroidIndex = centroidIndex;
        }
      });
      if (assignments[pointIndex] !== closestCentroidIndex) {
        assignmentsChanged = true;
      }
      return closestCentroidIndex;
    });
    assignments = newAssignments;

    history.push({
      centroids: JSON.parse(JSON.stringify(centroids)),
      assignments: [...assignments],
      stepName: 'Assignment',
      iteration: iterationCount,
    });

    // 3. Update Step
    const newCentroids: number[][] = Array.from({ length: k }, () => new Array(data[0].length).fill(0));
    const counts = new Array(k).fill(0);

    data.forEach((point, pointIndex) => {
      const clusterIndex = assignments[pointIndex];
      if (clusterIndex !== -1) {
        counts[clusterIndex]++;
        point.forEach((value, dimIndex) => {
          newCentroids[clusterIndex][dimIndex] += value;
        });
      }
    });
    
    let centroidsChanged = false;
    newCentroids.forEach((centroid, centroidIndex) => {
      const oldCentroid = centroids[centroidIndex];
      if (counts[centroidIndex] > 0) {
        const newCentroid = centroid.map(sum => sum / counts[centroidIndex]);
        if (JSON.stringify(oldCentroid) !== JSON.stringify(newCentroid)) {
          centroidsChanged = true;
        }
        centroids[centroidIndex] = newCentroid;
      } else {
        // Re-initialize centroid if cluster becomes empty
        centroids[centroidIndex] = data[Math.floor(Math.random() * data.length)];
        centroidsChanged = true;
      }
    });

    history.push({
      centroids: JSON.parse(JSON.stringify(centroids)),
      assignments: [...assignments],
      stepName: 'Update',
      iteration: iterationCount,
    });

    // 4. Check for convergence
    if (!assignmentsChanged || !centroidsChanged) {
      break;
    }
  }

  return history;
}

export function getFinalResultFromHistory(history: KMeansIteration[], data: number[][]): KMeansResult {
    if (history.length === 0) {
        throw new Error("History is empty");
    }
    const finalState = history[history.length - 1];
    
    let inertia = 0;
    data.forEach((point, index) => {
        const centroid = finalState.centroids[finalState.assignments[index]];
        if (centroid) {
            inertia += euclideanDistance(point, centroid) ** 2;
        }
    });

    return {
        assignments: finalState.assignments,
        centroids: finalState.centroids,
        inertia,
    };
}

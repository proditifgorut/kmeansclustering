import { KMeansResult } from '../types';

// --- Helper Functions ---
function euclideanDistanceSq(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0);
}

function getRandomCentroids(data: number[][], k: number): number[][] {
  const shuffled = data.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, k);
}

// --- Core PSO-KMeans Logic ---

interface PsoOptions {
  swarmSize: number;
  maxIterations: number;
  w: number; // inertia weight
  c1: number; // cognitive coefficient
  c2: number; // social coefficient
}

interface Particle {
  position: number[][]; // centroids
  velocity: number[][];
  pbestPosition: number[][];
  pbestFitness: number;
}

// Calculates fitness (WCSS - Within-Cluster Sum of Squares) for a given set of centroids
function calculateFitness(data: number[][], centroids: number[][]): number {
  let wcss = 0;
  for (const point of data) {
    let minDistance = Infinity;
    for (const centroid of centroids) {
      const distance = euclideanDistanceSq(point, centroid);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }
    wcss += minDistance;
  }
  return wcss;
}

export function runPso(data: number[][], k: number, options: PsoOptions) {
  const { swarmSize, maxIterations, w, c1, c2 } = options;
  const dimensions = data[0].length;
  const fitnessHistory: number[] = [];

  // 1. Initialize Swarm
  let swarm: Particle[] = [];
  for (let i = 0; i < swarmSize; i++) {
    const position = getRandomCentroids(data, k);
    swarm.push({
      position,
      velocity: Array.from({ length: k }, () => Array(dimensions).fill(0)),
      pbestPosition: position,
      pbestFitness: calculateFitness(data, position),
    });
  }

  let gbestPosition = swarm.reduce((prev, curr) => curr.pbestFitness < prev.pbestFitness ? curr : prev).pbestPosition;
  let gbestFitness = calculateFitness(data, gbestPosition);

  // 2. Main PSO Loop
  for (let iter = 0; iter < maxIterations; iter++) {
    for (const particle of swarm) {
      // Update velocity and position for each centroid in the particle
      const newVelocity: number[][] = [];
      const newPosition: number[][] = [];

      for (let i = 0; i < k; i++) {
        const r1 = Math.random();
        const r2 = Math.random();
        
        const vel = particle.velocity[i].map((v, dim) => 
          w * v +
          c1 * r1 * (particle.pbestPosition[i][dim] - particle.position[i][dim]) +
          c2 * r2 * (gbestPosition[i][dim] - particle.position[i][dim])
        );
        newVelocity.push(vel);

        const pos = particle.position[i].map((p, dim) => p + vel[dim]);
        newPosition.push(pos);
      }
      
      particle.velocity = newVelocity;
      particle.position = newPosition;

      // Evaluate fitness
      const currentFitness = calculateFitness(data, particle.position);
      if (currentFitness < particle.pbestFitness) {
        particle.pbestFitness = currentFitness;
        particle.pbestPosition = particle.position;
      }
      if (currentFitness < gbestFitness) {
        gbestFitness = currentFitness;
        gbestPosition = particle.position;
      }
    }
    fitnessHistory.push(gbestFitness);
  }

  return { bestCentroids: gbestPosition, fitnessHistory };
}


export function runKMeansWithInitialCentroids(data: number[][], k: number, initialCentroids: number[][], maxIterations = 100): KMeansResult {
  let centroids = JSON.parse(JSON.stringify(initialCentroids));
  let assignments = new Array(data.length).fill(0);
  let iterations = 0;

  for (let i = 0; i < maxIterations; i++) {
    iterations = i + 1;
    let assignmentsChanged = false;

    // Assignment step
    data.forEach((point, pointIndex) => {
      let minDistance = Infinity;
      let closestCentroidIndex = -1;
      centroids.forEach((centroid, centroidIndex) => {
        const distance = euclideanDistanceSq(point, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroidIndex = centroidIndex;
        }
      });
      if (assignments[pointIndex] !== closestCentroidIndex) {
        assignmentsChanged = true;
      }
      assignments[pointIndex] = closestCentroidIndex;
    });

    // Update step
    const newCentroids: number[][] = Array.from({ length: k }, () => new Array(data[0].length).fill(0));
    const counts = new Array(k).fill(0);
    data.forEach((point, pointIndex) => {
      const clusterIndex = assignments[pointIndex];
      counts[clusterIndex]++;
      point.forEach((val, dim) => newCentroids[clusterIndex][dim] += val);
    });

    let centroidsChanged = false;
    newCentroids.forEach((centroid, i) => {
        if(counts[i] > 0) {
            const newCentroid = centroid.map(sum => sum / counts[i]);
            if(JSON.stringify(centroids[i]) !== JSON.stringify(newCentroid)) {
                centroidsChanged = true;
            }
            centroids[i] = newCentroid;
        }
    });

    if (!assignmentsChanged || !centroidsChanged) {
      break;
    }
  }

  const inertia = calculateFitness(data, centroids);
  return { assignments, centroids, inertia, iterations };
}

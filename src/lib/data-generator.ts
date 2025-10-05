import { Point } from '../types';

// Simple gaussian random number generator (Box-Muller transform)
function gaussianRandom(mean = 0, stdev = 1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

export function generateClusteredData(numPoints: number, numClusters: number, clusterSpread: number): { points: Point[], headers: string[] } {
    const points: Point[] = [];
    const headers = ['x', 'y'];
    const clusterCenters: {x: number, y: number}[] = [];

    // Create random cluster centers within a 100x100 space
    for (let i = 0; i < numClusters; i++) {
        clusterCenters.push({
            x: Math.random() * 100,
            y: Math.random() * 100
        });
    }

    // Generate points around each cluster center
    for (let i = 0; i < numPoints; i++) {
        const clusterIndex = i % numClusters;
        const center = clusterCenters[clusterIndex];
        points.push({
            x: gaussianRandom(center.x, clusterSpread),
            y: gaussianRandom(center.y, clusterSpread)
        });
    }

    return { points, headers };
}

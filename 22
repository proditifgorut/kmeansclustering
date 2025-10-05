export interface Point {
  [key: string]: number | null;
}

export interface KMeansResult {
  assignments: number[];
  centroids: number[][];
  inertia: number;
  iterations?: number;
}

export interface KMeansIteration {
  centroids: number[][];
  assignments: number[];
  stepName: 'Initialization' | 'Assignment' | 'Update' | string;
  iteration: number;
}

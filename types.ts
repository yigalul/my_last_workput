export enum WorkoutType {
  CHEST = 'Chest',
  BACK = 'Back',
  SHOULDERS = 'Shoulders',
}

export interface WorkoutConfig {
  id: WorkoutType;
  label: string;          // e.g., "Chest Day" or "Push"
  primaryMuscle: string;  // e.g., "Chest"
  secondaryMuscle: string;// e.g., "Triceps"
  primaryCount: number;   // e.g., 4
  secondaryCount: number; // e.g., 3
}

export interface Workout {
  id: string;
  type: WorkoutType;
  durationMinutes: number;
  date: string; // ISO string
  notes: string;
  intensity: 'Low' | 'Medium' | 'High';
}

export interface AIAdvice {
  message: string;
  timestamp: number;
}
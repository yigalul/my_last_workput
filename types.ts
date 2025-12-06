export type WorkoutType = string;

// Helper constants for default types (to keep some backwards compatibility in code refs)
export const WorkoutTypes = {
  CHEST: 'Chest',
  BACK: 'Back',
  SHOULDERS: 'Shoulders',
};

export interface MuscleGroupConfig {
  muscle: string;
  exerciseCount: number;
}

export interface WorkoutConfig {
  id: WorkoutType;
  label: string;
  muscleGroups: MuscleGroupConfig[];
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
import React from 'react';
import { Dumbbell, Activity, Sun } from 'lucide-react';
import { WorkoutType } from '../types';

interface WorkoutIconProps {
  type: WorkoutType;
  className?: string;
}

export const WorkoutIcon: React.FC<WorkoutIconProps> = ({ type, className = "" }) => {
  switch (type) {
    case WorkoutType.CHEST:
      return <Dumbbell className={className} />;
    case WorkoutType.BACK:
      return <Activity className={className} />;
    case WorkoutType.SHOULDERS:
      return <Sun className={className} />;
    default:
      return <Activity className={className} />;
  }
};
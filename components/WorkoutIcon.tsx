import React from 'react';
import { Activity, Shield, Anchor, Trophy } from 'lucide-react';
import { WorkoutType, WorkoutTypes } from '../types';

interface WorkoutIconProps {
  type: WorkoutType;
  className?: string;
}

export const WorkoutIcon: React.FC<WorkoutIconProps> = ({ type, className = "" }) => {
  switch (type) {
    case WorkoutTypes.CHEST:
      return <Shield className={className} />;
    case WorkoutTypes.BACK:
      return <Anchor className={className} />;
    case WorkoutTypes.SHOULDERS:
      return <Trophy className={className} />;
    default:
      return <Activity className={className} />;
  }
};
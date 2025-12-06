import React from 'react';
import { Activity, Shield, Anchor, Trophy } from 'lucide-react';
import { WorkoutType } from '../types';

interface WorkoutIconProps {
  type: WorkoutType;
  className?: string;
}

export const WorkoutIcon: React.FC<WorkoutIconProps> = ({ type, className = "" }) => {
  switch (type) {
    case WorkoutType.CHEST:
      return <Shield className={className} />;
    case WorkoutType.BACK:
      return <Anchor className={className} />;
    case WorkoutType.SHOULDERS:
      return <Trophy className={className} />;
    default:
      return <Activity className={className} />;
  }
};
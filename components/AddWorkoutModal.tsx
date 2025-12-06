
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { WorkoutType, Workout, WorkoutConfig } from '../types';

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: Omit<Workout, 'id'>) => void;
  workoutConfigs: Record<WorkoutType, WorkoutConfig>;
}

export const AddWorkoutModal: React.FC<AddWorkoutModalProps> = ({ isOpen, onClose, onSave, workoutConfigs }) => {
  const [type, setType] = useState<WorkoutType>(WorkoutType.CHEST);
  const [duration, setDuration] = useState<string>('30');
  const [intensity, setIntensity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type,
      durationMinutes: parseInt(duration) || 0,
      date: new Date().toISOString(),
      intensity,
      notes,
    });
    // Reset form
    setNotes('');
    setDuration('30');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Log Workout</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(WorkoutType).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 px-1 rounded-xl text-sm font-medium transition-all ${
                    type === t 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {workoutConfigs[t]?.label || t}
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Intensity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Duration (min)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Intensity</label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as any)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel?"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 rounded-2xl mt-4 hover:shadow-lg hover:shadow-blue-900/30 transition-all active:scale-[0.98]"
          >
            Save Workout
          </button>
        </form>
      </div>
    </div>
  );
};

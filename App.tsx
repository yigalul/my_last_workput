import React, { useState, useEffect } from 'react';
import { Widget } from './components/Widget';
import { AddWorkoutModal } from './components/AddWorkoutModal';
import { EditConfigModal } from './components/EditConfigModal';
import { Workout, WorkoutType, WorkoutConfig } from './types';
import { History, LayoutGrid, Dumbbell, Trash2 } from 'lucide-react';
import { App as CapacitorApp } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'fitwidget_workouts';
const CONFIG_STORAGE_KEY = 'fitwidget_configs';

// Mock initial data if storage is empty
const MOCK_WORKOUTS: Workout[] = [
  {
    id: '1',
    type: WorkoutType.CHEST,
    durationMinutes: 45,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
    intensity: 'High',
    notes: 'Heavy bench press session.'
  }
];

const DEFAULT_CONFIGS: Record<WorkoutType, WorkoutConfig> = {
  [WorkoutType.CHEST]: {
    id: WorkoutType.CHEST,
    label: 'Chest',
    primaryMuscle: 'Chest',
    secondaryMuscle: 'Triceps',
    primaryCount: 4,
    secondaryCount: 3
  },
  [WorkoutType.BACK]: {
    id: WorkoutType.BACK,
    label: 'Back',
    primaryMuscle: 'Back',
    secondaryMuscle: 'Biceps',
    primaryCount: 4,
    secondaryCount: 3
  },
  [WorkoutType.SHOULDERS]: {
    id: WorkoutType.SHOULDERS,
    label: 'Shoulders',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: 'Legs',
    primaryCount: 4,
    secondaryCount: 3
  }
};

export default function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [configs, setConfigs] = useState<Record<WorkoutType, WorkoutConfig>>(DEFAULT_CONFIGS);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'widget' | 'history'>('widget');

  // Handle Deep Links
  useEffect(() => {
    CapacitorApp.addListener('appUrlOpen', data => {
      const url = data.url;
      if (url.includes('fitwidget://log/')) {
        const typeStr = url.split('fitwidget://log/')[1];
        // For now, we just open the modal. Ideally, we could pre-select the type.
        // But the modal doesn't support pre-selection prop yet, so we just open it.
        // If we wanted to be fancier, we'd pass this type to the modal.
        setIsModalOpen(true);
      } else if (url.includes('fitwidget://add') || url.includes('fitwidget://open')) {
        setIsModalOpen(true);
      }
    });
  }, []);

  // Update Widget Data in Shared Preferences
  useEffect(() => {
    const updateWidgetData = async () => {
      if (workouts.length > 0) {
        const last = workouts[0];
        const name = configs[last.type]?.label || last.type;
        const date = new Date(last.date).toLocaleDateString();
        const text = `Last: ${name} (${date})`;

        await Preferences.set({
          key: 'widget_last_workout',
          value: text,
        });
      } else {
        await Preferences.set({
          key: 'widget_last_workout',
          value: 'No recent workouts',
        });
      }
    };
    updateWidgetData();
  }, [workouts, configs]);

  // Load Workouts
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setWorkouts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse workouts", e);
        setWorkouts(MOCK_WORKOUTS);
      }
    } else {
      setWorkouts(MOCK_WORKOUTS);
    }
  }, []);

  // Load Configs
  useEffect(() => {
    const savedConfigs = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (savedConfigs) {
      try {
        setConfigs(JSON.parse(savedConfigs));
      } catch (e) {
        setConfigs(DEFAULT_CONFIGS);
      }
    }
  }, []);

  // Save Workouts
  useEffect(() => {
    if (workouts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
    }
  }, [workouts]);

  // Save Configs
  useEffect(() => {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configs));
  }, [configs]);

  const handleAddWorkout = (newWorkoutData: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      ...newWorkoutData,
      id: crypto.randomUUID(),
    };
    // Add to top of list
    setWorkouts([newWorkout, ...workouts]);
  };

  const lastWorkout = workouts.length > 0 ? workouts[0] : null;

  const handleDeleteWorkout = (id: string) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      setWorkouts(prev => prev.filter(w => w.id !== id));
    }
  };

  const handleDeleteAllWorkouts = () => {
    if (confirm('Are you sure you want to delete all workout history? This cannot be undone.')) {
      setWorkouts([]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-6">

        {/* App Header */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-900/40">
              <Dumbbell size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                My Last Workout
              </h1>
              <span className="text-xs text-gray-500 font-medium tracking-wide">YOUR ACTIVITY TRACKER</span>
            </div>
          </div>

          <div className="flex bg-gray-900 rounded-full p-1 border border-gray-800">
            <button
              onClick={() => setActiveTab('widget')}
              className={`p-2 rounded-full transition-all ${activeTab === 'widget' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`p-2 rounded-full transition-all ${activeTab === 'history' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <History size={18} />
            </button>
          </div>
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'widget' ? (
            <Widget
              lastWorkout={lastWorkout}
              workoutConfigs={configs}
              onOpenLog={() => setIsModalOpen(true)}
              onOpenSettings={() => setIsConfigOpen(true)}
            />
          ) : (
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-[2.5rem] p-6 h-[400px] overflow-y-auto relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">History</h2>
                {workouts.length > 0 && (
                  <button
                    onClick={handleDeleteAllWorkouts}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={12} />
                    Clear All
                  </button>
                )}
              </div>

              {workouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <div className="bg-gray-800/50 p-4 rounded-full mb-3">
                    <History size={24} className="opacity-50" />
                  </div>
                  <p>No workout history found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {workouts.map((w) => (
                    <div key={w.id} className="bg-gray-800/50 p-4 rounded-2xl flex items-center justify-between border border-gray-800 group relative overflow-hidden transition-all hover:border-gray-700">
                      <div>
                        <div className="font-medium text-white flex items-center gap-2">
                          {configs[w.type]?.label || w.type}
                        </div>
                        <div className="text-xs text-gray-400">{new Date(w.date).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-blue-400 font-bold">{w.durationMinutes}m</div>
                          <div className="text-[10px] text-gray-500 uppercase">{w.intensity}</div>
                        </div>
                        <button
                          onClick={() => handleDeleteWorkout(w.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-2 -mr-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs">
          Powered by Gemini • Stay Consistent
        </p>

      </div>

      <AddWorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddWorkout}
        workoutConfigs={configs}
      />

      <EditConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        configs={configs}
        onSave={setConfigs}
      />
    </div>
  );
}

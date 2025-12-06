
import React, { useState, useEffect } from 'react';
import { Widget } from './components/Widget';
import { AddWorkoutModal } from './components/AddWorkoutModal';
import { EditConfigModal } from './components/EditConfigModal';
import { Workout, WorkoutType, WorkoutConfig } from './types';
import { History, LayoutGrid, Dumbbell } from 'lucide-react';

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

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'widget' ? (
            <Widget 
              lastWorkout={lastWorkout} 
              workoutConfigs={configs}
              onOpenLog={() => setIsModalOpen(true)} 
              onOpenSettings={() => setIsConfigOpen(true)}
            />
          ) : (
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-[2.5rem] p-6 h-[400px] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4 text-white">History</h2>
              {workouts.length === 0 ? (
                <div className="text-center text-gray-500 py-10">No history yet.</div>
              ) : (
                <div className="space-y-3">
                  {workouts.map((w) => (
                    <div key={w.id} className="bg-gray-800/50 p-4 rounded-2xl flex items-center justify-between border border-gray-800">
                      <div>
                        <div className="font-medium text-white">{configs[w.type]?.label || w.type}</div>
                        <div className="text-xs text-gray-400">{new Date(w.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-400 font-bold">{w.durationMinutes}m</div>
                        <div className="text-[10px] text-gray-500 uppercase">{w.intensity}</div>
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

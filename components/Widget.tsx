import React, { useState } from 'react';
import { Plus, Clock, TrendingUp, Sparkles, RefreshCw, Zap, Settings, ChevronRight } from 'lucide-react';
import { Workout, WorkoutType, WorkoutConfig, WorkoutTypes } from '../types';
import { WorkoutIcon } from './WorkoutIcon';
import { generateWorkoutAdvice, generateWorkoutPlan } from '../services/geminiService';

interface WidgetProps {
  lastWorkout: Workout | null;
  workoutConfigs: Record<WorkoutType, WorkoutConfig>;
  onOpenLog: () => void;
  onOpenSettings: () => void;
}

export const Widget: React.FC<WidgetProps> = ({ lastWorkout, workoutConfigs, onOpenLog, onOpenSettings }) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  // Plan Generator State
  const [selectedPlanType, setSelectedPlanType] = useState<WorkoutType>(WorkoutTypes.CHEST);
  const [planLoading, setPlanLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);

  const handleGetAdvice = async () => {
    if (!lastWorkout) return;
    setAiLoading(true);
    try {
      const result = await generateWorkoutAdvice(lastWorkout);
      setAdvice(result);
    } catch (error) {
      setAdvice("Could not generate insight at this moment.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setPlanLoading(true);
    setGeneratedPlan(null);
    try {
      // Pass the dynamic configuration for the selected type
      const config = workoutConfigs[selectedPlanType];
      const result = await generateWorkoutPlan(config);
      setGeneratedPlan(result);
    } catch (error) {
      setGeneratedPlan("Error generating plan.");
    } finally {
      setPlanLoading(false);
    }
  };

  const getTypeColor = (type?: WorkoutType) => {
    switch (type) {
      case WorkoutTypes.CHEST:
        return 'from-blue-600 to-indigo-600';
      case WorkoutTypes.BACK:
        return 'from-emerald-600 to-teal-600';
      case WorkoutTypes.SHOULDERS:
        return 'from-orange-500 to-red-600';
      default:
        return 'from-gray-700 to-gray-600';
    }
  };

  const lastWorkoutLabel = lastWorkout ? (workoutConfigs[lastWorkout.type]?.label || lastWorkout.type) : '';

  // Render when no workout exists
  if (!lastWorkout) {
    return (
      <div className="w-full max-w-sm mx-auto bg-gray-900 rounded-[2rem] p-6 shadow-2xl border border-gray-800/50 flex flex-col items-center justify-center min-h-[200px] text-center relative">

        {/* Settings button accessible even in empty state */}
        <button
          onClick={onOpenSettings}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <Settings size={18} />
        </button>

        <div className="bg-gray-800 p-4 rounded-full mb-4">
          <TrendingUp className="text-gray-400" size={32} />
        </div>
        <h3 className="text-gray-200 font-semibold mb-1">No Workouts Yet</h3>
        <p className="text-gray-500 text-sm mb-6">Log your first activity to get started.</p>
        <button
          onClick={onOpenLog}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Log Workout
        </button>
      </div>
    );
  }

  const dateStr = new Date(lastWorkout.date).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">

      {/* --- Main Widget Card --- */}
      <div className="bg-gray-900 rounded-[2.5rem] p-6 shadow-2xl border border-gray-800 overflow-hidden relative">

        {/* Background decorative blob */}
        <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${getTypeColor(lastWorkout.type)} opacity-20 blur-[60px] rounded-full pointer-events-none`} />

        {/* Header: Last Workout Label & Add Button */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Last Workout</span>
            <h2 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
              {lastWorkoutLabel}
            </h2>
          </div>
          <button
            onClick={onOpenLog}
            className="bg-gray-800 hover:bg-gray-700 p-3 rounded-2xl text-white transition-colors border border-gray-700"
            aria-label="Add Workout"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Main Stats Card */}
        <div className={`bg-gradient-to-br ${getTypeColor(lastWorkout.type)} rounded-3xl p-5 mb-5 text-white shadow-lg relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <WorkoutIcon type={lastWorkout.type} className="w-32 h-32 transform translate-x-8 -translate-y-8" />
          </div>

          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
              <WorkoutIcon type={lastWorkout.type} className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-white/80">{dateStr}</div>
              <div className="text-xs text-white/60">{lastWorkout.intensity} Intensity</div>
            </div>
          </div>

          <div className="flex items-end gap-1 relative z-10">
            <span className="text-4xl font-bold tracking-tight">{lastWorkout.durationMinutes}</span>
            <span className="text-lg font-medium mb-1.5 opacity-80">min</span>
          </div>
        </div>

        {/* Gemini AI Insight Section */}
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-800 backdrop-blur-sm">
          {!advice ? (
            <div
              onClick={handleGetAdvice}
              className="flex items-center justify-between cursor-pointer group/ai"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-400">
                  {aiLoading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover/ai:text-white transition-colors">
                  {aiLoading ? "Analyzing..." : "Get AI Coach Insight"}
                </span>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start gap-3" dir="rtl">
                <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-400 shrink-0 mt-0.5 ml-3">
                  <Sparkles size={16} />
                </div>
                <div className="space-y-1 w-full text-right">
                  <p className="text-sm text-gray-200 leading-relaxed italic">"{advice}"</p>
                  <button
                    onClick={() => setAdvice(null)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 mt-2 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Plan Generator Section --- */}
      <div className="bg-gray-900 rounded-[2rem] p-5 shadow-2xl border border-gray-800 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="text-yellow-500" size={18} />
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wide">Plan Next Session</h3>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* Selector Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {Object.keys(workoutConfigs).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedPlanType(t as WorkoutType)}
              className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold transition-all border truncate ${selectedPlanType === t
                ? 'bg-gray-100 text-gray-900 border-white'
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
                }`}
            >
              {workoutConfigs[t as WorkoutType]?.label || t}
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGeneratePlan}
          disabled={planLoading}
          className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 mb-2 disabled:opacity-50"
        >
          {planLoading ? (
            <RefreshCw className="animate-spin" size={18} />
          ) : (
            <Sparkles size={18} className="text-yellow-400" />
          )}
          {planLoading ? "Creating Plan..." : `Generate ${workoutConfigs[selectedPlanType]?.label || selectedPlanType} Plan`}
        </button>

        {/* Plan Result */}
        {generatedPlan && (
          <div className="mt-4 bg-black/40 rounded-xl p-4 border border-gray-800/50 animate-in fade-in slide-in-from-top-2" dir="rtl">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 text-right">AI Suggested Routine</h4>
            <div className="text-sm text-gray-200 whitespace-pre-line leading-relaxed font-medium text-right">
              {generatedPlan}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

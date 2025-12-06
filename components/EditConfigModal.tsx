
import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import { WorkoutType, WorkoutConfig } from '../types';

interface EditConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  configs: Record<WorkoutType, WorkoutConfig>;
  onSave: (configs: Record<WorkoutType, WorkoutConfig>) => void;
}

export const EditConfigModal: React.FC<EditConfigModalProps> = ({ isOpen, onClose, configs, onSave }) => {
  const [localConfigs, setLocalConfigs] = useState<Record<WorkoutType, WorkoutConfig>>(configs);
  const [activeTab, setActiveTab] = useState<WorkoutType>(WorkoutType.CHEST);

  useEffect(() => {
    setLocalConfigs(configs);
  }, [configs, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof WorkoutConfig, value: string | number) => {
    setLocalConfigs(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(localConfigs);
    onClose();
  };

  const currentConfig = localConfigs[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Workout Settings</h2>

        {/* Tabs */}
        <div className="flex bg-gray-800 p-1 rounded-xl mb-6">
          {Object.values(WorkoutType).map(type => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === type 
                  ? 'bg-gray-700 text-white shadow-sm' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {localConfigs[type].label || type}
            </button>
          ))}
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Button Label</label>
            <input
              type="text"
              value={currentConfig.label}
              onChange={(e) => handleChange('label', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Push Day"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Big Muscle</label>
              <input
                type="text"
                value={currentConfig.primaryMuscle}
                onChange={(e) => handleChange('primaryMuscle', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Exercise Count</label>
              <input
                type="number"
                min="1"
                max="10"
                value={currentConfig.primaryCount}
                onChange={(e) => handleChange('primaryCount', parseInt(e.target.value) || 0)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Small Muscle</label>
              <input
                type="text"
                value={currentConfig.secondaryMuscle}
                onChange={(e) => handleChange('secondaryMuscle', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Exercise Count</label>
              <input
                type="number"
                min="1"
                max="10"
                value={currentConfig.secondaryCount}
                onChange={(e) => handleChange('secondaryCount', parseInt(e.target.value) || 0)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-gray-400 hover:text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

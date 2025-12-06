import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { WorkoutType, WorkoutConfig } from '../types';

interface EditConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  configs: Record<string, WorkoutConfig>;
  onSave: (configs: Record<string, WorkoutConfig>) => void;
}

export const EditConfigModal: React.FC<EditConfigModalProps> = ({ isOpen, onClose, configs, onSave }) => {
  const [localConfigs, setLocalConfigs] = useState<Record<string, WorkoutConfig>>(configs);
  const [activeTab, setActiveTab] = useState<string>('');
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  useEffect(() => {
    setLocalConfigs(configs);
    const keys = Object.keys(configs);
    if (keys.length > 0) {
      setActiveTab(keys[0]);
    }
  }, [configs, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof WorkoutConfig, value: any) => {
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

  const handleAddType = () => {
    if (!newTypeName.trim()) return;
    const id = newTypeName.trim(); // Simplified ID generation
    const newConfig: WorkoutConfig = {
      id: id,
      label: newTypeName.trim(),
      muscleGroups: [{ muscle: 'Main Group', exerciseCount: 4 }]
    };
    setLocalConfigs(prev => ({
      ...prev,
      [id]: newConfig
    }));
    setActiveTab(id);
    setIsAddingMode(false);
    setNewTypeName('');
  };

  const handleDeleteType = () => {
    if (Object.keys(localConfigs).length <= 1) {
      alert("You must have at least one workout type.");
      return;
    }
    if (confirm(`Delete ${localConfigs[activeTab]?.label}?`)) {
      const newConfigs = { ...localConfigs };
      delete newConfigs[activeTab];
      setLocalConfigs(newConfigs);
      setActiveTab(Object.keys(newConfigs)[0]);
    }
  };

  const currentConfig = localConfigs[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Workout Settings</h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(localConfigs).map(type => (
            <button
              key={type}
              onClick={() => { setActiveTab(type); setIsAddingMode(false); }}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === type && !isAddingMode
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
            >
              {localConfigs[type].label || type}
            </button>
          ))}
          <button
            onClick={() => setIsAddingMode(true)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${isAddingMode ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
          >
            <Plus size={14} /> Add
          </button>
        </div>

        {isAddingMode ? (
          <div className="bg-gray-800/50 p-4 rounded-xl space-y-4 mb-6 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-white font-medium">Add New Workout Type</h3>
            <input
              type="text"
              value={newTypeName}
              onChange={e => setNewTypeName(e.target.value)}
              placeholder="E.g. Leg Day"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleAddType}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 rounded-xl"
            >
              Create
            </button>
          </div>
        ) : currentConfig ? (
          <div className="space-y-5 animate-in fade-in">

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Button Label</label>
              <input
                type="text"
                value={currentConfig.label}
                onChange={(e) => handleChange('label', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Muscle Groups</label>
                <button
                  onClick={() => {
                    const newGroups = [...(currentConfig.muscleGroups || [])];
                    newGroups.push({ muscle: 'New Group', exerciseCount: 3 });
                    handleChange('muscleGroups', newGroups);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Plus size={12} /> Add Group
                </button>
              </div>

              <div className="space-y-3">
                {(currentConfig.muscleGroups || []).map((group, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-gray-800 p-2 rounded-xl">
                    <input
                      type="text"
                      value={group.muscle}
                      onChange={(e) => {
                        const newGroups = [...currentConfig.muscleGroups];
                        newGroups[idx].muscle = e.target.value;
                        handleChange('muscleGroups', newGroups);
                      }}
                      className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={group.exerciseCount}
                      onChange={(e) => {
                        const newGroups = [...currentConfig.muscleGroups];
                        newGroups[idx].exerciseCount = parseInt(e.target.value) || 0;
                        handleChange('muscleGroups', newGroups);
                      }}
                      className="w-16 bg-gray-700 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                    />
                    <button
                      onClick={() => {
                        const newGroups = currentConfig.muscleGroups.filter((_, i) => i !== idx);
                        handleChange('muscleGroups', newGroups);
                      }}
                      className="text-gray-500 hover:text-red-400 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleDeleteType}
              className="w-full py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-all flex items-center justify-center gap-2 text-sm mt-4"
            >
              <Trash2 size={16} /> Delete Type
            </button>
          </div>
        ) : null}

        <div className="mt-8 flex gap-3 border-t border-gray-800 pt-6">
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

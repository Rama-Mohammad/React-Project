// components/session/live/Checklist.tsx
import React, { useState } from 'react';
import type { ChecklistItem } from '../../../types/session';

interface ChecklistProps {
  items: ChecklistItem[];
  onToggleItem: (itemId: string) => void;
  onAddItem: (text: string) => void;
  isEditable: boolean;
}

const Checklist: React.FC<ChecklistProps> = ({ items, onToggleItem, onAddItem, isEditable }) => {
  const [newItemText, setNewItemText] = useState('');

  const handleAdd = () => {
    if (newItemText.trim()) {
      onAddItem(newItemText.trim());
      setNewItemText('');
    }
  };

  const completedCount = items.filter(i => i.completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-2">Session Agenda</h3>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 rounded-full h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {completedCount} of {items.length} completed
        </p>
      </div>

      <div className="space-y-2 mb-4">
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No agenda items yet</p>
        ) : (
          items.map((item) => (
            <label
              key={item.id}
              className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggleItem(item.id)}
                className="mt-0.5"
              />
              <span className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {item.text}
              </span>
            </label>
          ))
        )}
      </div>

      {isEditable && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add new item..."
            className="flex-1 text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdd}
            className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default Checklist;
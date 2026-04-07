import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { AddSkillModalProps, ProfileSkill } from '../../types/profile';

const AddSkillModal: React.FC<AddSkillModalProps> = ({
  isOpen, onClose, onAdd, onUpdate, editSkill, isEditMode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 'Intermediate' as ProfileSkill['level'],
    sessions: 0,
    description: '',
  });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    if (editSkill && isEditMode) {
      setFormData({
        name: editSkill.name || '',
        category: editSkill.category || '',
        level: (editSkill.level || 'Intermediate') as ProfileSkill['level'],
        sessions: editSkill.sessions || 0,
        description: editSkill.description || '',
      });
    }
  }, [editSkill, isEditMode]);

  useEffect(() => {
    if (!isEditMode && isOpen) {
      setFormData({ name: '', category: '', level: 'Intermediate', sessions: 0, description: '' });
    }
  }, [isEditMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && editSkill) {
      onUpdate && onUpdate({ ...formData, id: editSkill.id });
    } else {
      onAdd(formData);
    }
    onClose();
    setFormData({ name: '', category: '', level: 'Intermediate', sessions: 0, description: '' });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-md w-full mx-auto shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Skill" : "Add New Skill"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="e.g., React, Python, Guitar" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="e.g., Programming, Design, Music" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
            <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value as ProfileSkill['level'] })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white">
              <option value="Expert">Expert</option>
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Beginner">Beginner</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none" placeholder="Brief description of your experience..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sessions Completed</label>
            <input type="number" value={formData.sessions} onChange={(e) => setFormData({ ...formData, sessions: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="0" min="0" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">{isEditMode ? "Update Skill" : "Add Skill"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;
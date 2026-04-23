import React, { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import ThemedSelect from "../common/ThemedSelect";
import type { AddSkillModalProps, ProfileSkill } from "../../types/profile";

const levelOptions: ProfileSkill["level"][] = [
  "Expert",
  "Advanced",
  "Intermediate",
  "Beginner",
];

const initialFormData = {
  name: "",
  category: "",
  level: "Intermediate" as ProfileSkill["level"],
  sessions: 0,
  description: "",
};

const AddSkillModal: React.FC<AddSkillModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  editSkill,
  isEditMode,
}) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (editSkill && isEditMode) {
      setFormData({
        name: editSkill.name || "",
        category: editSkill.category || "",
        level: (editSkill.level || "Intermediate") as ProfileSkill["level"],
        sessions: editSkill.sessions || 0,
        description: editSkill.description || "",
      });
      return;
    }

    if (isOpen) {
      setFormData(initialFormData);
    }
  }, [editSkill, isEditMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isEditMode && editSkill) {
      onUpdate?.({ ...formData, id: editSkill.id });
    } else {
      onAdd(formData);
    }

    onClose();
    setFormData(initialFormData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close add skill modal"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEditMode ? "Edit Skill" : "Add New Skill"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">Skill Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              className="mt-1 h-11.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              placeholder="e.g., React, Python, Guitar"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(event) => setFormData({ ...formData, category: event.target.value })}
              className="mt-1 h-11.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              placeholder="e.g., Programming, Design, Music"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Proficiency Level</label>
            <ThemedSelect
              value={formData.level}
              onChange={(value) => setFormData({ ...formData, level: value })}
              options={levelOptions.map((option) => ({ value: option, label: option }))}
              ariaLabel="Skill level"
              icon={<Sparkles size={14} />}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Description (optional)</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              className="mt-1 w-full resize-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              placeholder="Brief description of your experience..."
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[linear-gradient(135deg,#2563eb_0%,#4f46e5_55%,#7c3aed_100%)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
            >
              {isEditMode ? "Update Skill" : "Add Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;


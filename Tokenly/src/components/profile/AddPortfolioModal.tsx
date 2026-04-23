import React, { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import ThemedSelect from "../common/ThemedSelect";
import type { AddPortfolioModalProps, PortfolioForm } from "../../types/profile";

const initialForm: PortfolioForm = {
  type: "Project",
  title: "",
  date: "",
  description: "",
  tags: "",
};

const portfolioTypeOptions: Array<PortfolioForm["type"]> = [
  "Project",
  "Article",
  "Contribution",
];

const AddPortfolioModal: React.FC<AddPortfolioModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  editItem = null,
  isEditMode = false,
}) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (isEditMode && editItem) {
      setForm({
        type: editItem.type,
        title: editItem.title,
        date: editItem.date,
        description: editItem.description,
        tags: editItem.tags.join(", "),
      });
      return;
    }
    setForm(initialForm);
  }, [editItem, isEditMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const tags = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload = {
      type: form.type,
      title: form.title.trim(),
      date: form.date.trim(),
      description: form.description.trim(),
      tags,
    };

    if (isEditMode && editItem && onUpdate) {
      onUpdate({ ...payload, id: editItem.id });
    } else {
      onAdd(payload);
    }

    setForm(initialForm);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} aria-label="Close add portfolio modal" />

      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">{isEditMode ? "Edit Portfolio Item" : "Add Portfolio Item"}</h3>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Item Type
              <ThemedSelect
                value={form.type}
                onChange={(value) => setForm((prev) => ({ ...prev, type: value }))}
                options={portfolioTypeOptions.map((option) => ({ value: option, label: option }))}
                ariaLabel="Portfolio item type"
                icon={<Sparkles size={14} />}
                className="mt-1"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Date
              <input
                type="text"
                required
                placeholder="e.g. Mar 2026"
                className="mt-1 h-11.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                value={form.date}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Title
            <input
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              required
              rows={4}
              className="mt-1 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Tags (comma separated)
            <input
              type="text"
              placeholder="React, Node.js, PostgreSQL"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              value={form.tags}
              onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
            />
          </label>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
            >
              {isEditMode ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPortfolioModal;



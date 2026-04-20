import React, { useState } from "react";
import type { ChecklistProps } from "../../../types/session";

const Checklist: React.FC<ChecklistProps> = ({ items, onToggleItem, onAddItem, onEditItem, isEditable }) => {
  const [newItemText, setNewItemText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleAdd = () => {
    if (!newItemText.trim()) return;
    onAddItem(newItemText.trim());
    setNewItemText("");
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) return;
    onEditItem(id, editText.trim());
    setEditingId(null);
    setEditText("");
  };

  const completedCount = items.filter((item) => item.completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="rounded-xl border border-indigo-200/70 bg-indigo-50/35 p-4">
      <div className="mb-4">
        <h3 className="mb-2 font-semibold text-slate-900">Session Agenda</h3>
        <div className="h-2 w-full rounded-full bg-indigo-100">
          <div
            className="h-2 rounded-full bg-[linear-gradient(90deg,#6366f1,#8b5cf6)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {completedCount} of {items.length} completed
        </p>
      </div>

      <div className="mb-4 space-y-2">
        {items.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-400">No agenda items yet</p>
        ) : (
          items.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-start gap-2 rounded-lg p-2 transition-colors hover:bg-indigo-50"
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggleItem(item.id)}
                className="mt-0.5 accent-indigo-600"
              />
              <div className="flex w-full items-center justify-between gap-2">
                {editingId === item.id ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 rounded border px-2 py-1 text-sm"
                  />
                ) : (
                  <span className={`text-sm ${item.completed ? "text-slate-400 line-through" : "text-slate-700"}`}>
                    {item.text}
                  </span>
                )}

                {isEditable && (
                  <div className="flex gap-2">
                    {editingId === item.id ? (
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="text-xs text-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditText(item.text);
                        }}
                        className="text-xs text-indigo-600"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                )}
              </div>
            </label>
          ))
        )}
      </div>

      {isEditable ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={(e) => (e.key === "Enter" ? handleAdd() : null)}
            placeholder="Add new item..."
            className="flex-1 rounded-lg border border-indigo-200 bg-indigo-50/50 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <button
            onClick={handleAdd}
            className="rounded-lg bg-indigo-100 px-3 py-1 text-sm text-indigo-700 transition-colors hover:bg-indigo-200"
          >
            Add
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Checklist;


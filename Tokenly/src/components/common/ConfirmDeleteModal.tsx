import { Trash2 } from "lucide-react";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  title?: string;
  message?: string;
  details?: string;
  itemName?: string;
  confirmLabel?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

export default function ConfirmDeleteModal({
  isOpen,
  title = "Delete this item?",
  message = "This action cannot be undone.",
  details,
  itemName,
  confirmLabel = "Delete",
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-rose-100 bg-white p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-rose-100 p-2.5 text-rose-700">
            <Trash2 size={16} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-0.5 text-sm text-slate-500">{message}</p>
          </div>
        </div>

        {itemName || details ? (
          <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50/60 p-3">
            {itemName ? <p className="text-sm font-medium text-slate-800">{itemName}</p> : null}
            {details ? <p className="mt-1 text-xs text-slate-500">{details}</p> : null}
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                await onConfirm();
                onCancel();
              } catch (err) {
                console.error("Delete failed:", err);
              }
            }}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white transition ${loading
                ? "cursor-not-allowed bg-rose-300"
                : "bg-[linear-gradient(135deg,#e11d48_0%,#f43f5e_100%)] hover:brightness-105"
              }`}
          >
            {!loading ? <Trash2 size={14} /> : null}
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}


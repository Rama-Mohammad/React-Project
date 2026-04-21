import React, { useState } from "react";
import type { FileManagerProps } from "../../../types/session";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFile, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";

const FileManager: React.FC<FileManagerProps> = ({ onFileUpload, files, onDownload, onDelete }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isUploading) return;

    setIsUploading(true);
    try {
      await onFileUpload(file);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="rounded-xl border border-indigo-200/70 bg-indigo-50/35 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Files</h3>
        <label className="cursor-pointer">
          <input type="file" onChange={handleFileSelect} className="hidden" disabled={isUploading} />
          <span className={`rounded-lg px-3 py-1 text-sm text-white transition
  ${isUploading ? "bg-indigo-300" : "bg-[linear-gradient(90deg,#6366f1,#8b5cf6)] hover:opacity-95"}
`}>            <FontAwesomeIcon icon={faUpload} className="mr-2" />
            {isUploading ? "Uploading..." : "Upload"}
          </span>
        </label>
      </div>

      {files.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-400">No files shared yet</div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-indigo-50"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <FontAwesomeIcon icon={faFile} className="text-slate-500" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-500">
  {formatFileSize(Number(file.size) || 0)}
</p>
                </div>
              </div>
              <button
                onClick={() => onDownload(file.id)}
                className="text-slate-400 transition-colors hover:text-indigo-600"
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
              <button
                onClick={() => onDelete(file.id)}
                className="text-slate-400 transition-colors hover:text-rose-600"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileManager;


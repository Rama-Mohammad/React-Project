// components/session/live/FileManager.tsx
import React, { useState } from 'react';
import type { FileManagerProps } from '../../../types/session';

const FileManager: React.FC<FileManagerProps> = ({ onFileUpload, files, onDownload }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      await onFileUpload(file);
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">Files</h3>
        <label className="cursor-pointer">
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors">
            {isUploading ? 'Uploading...' : '+ Upload'}
          </span>
        </label>
      </div>

      {files.length === 0 ? (
        <div className="text-center text-gray-400 text-sm py-8">
          No files shared yet
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-lg">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {file.uploadedBy}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDownload(file.id)}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                ⬇️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileManager;



import React from 'react';
import { useState } from 'react';
import type { UploadedFile } from '../types';
import { useCountdown } from '../hooks/useCountdown';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';


interface FileDisplayProps {
  fileData: UploadedFile;
  onFileExpired: () => void;
}

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const FileDisplay: React.FC<FileDisplayProps> = ({ fileData, onFileExpired }) => {
  const [copied, setCopied] = useState(false);
  const remainingTime = useCountdown(fileData.expiryTimestamp, onFileExpired);

  const minutes = remainingTime !== null ? Math.floor(remainingTime / 60) : 0;
  const seconds = remainingTime !== null ? remainingTime % 60 : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(fileData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-200 break-all">
          {fileData.file.name}
        </h3>
        <p className="text-sm text-gray-400">{formatBytes(fileData.file.size)}</p>
      </div>

      <div className="w-full">
        <label htmlFor="file-link" className="block text-sm font-medium text-gray-400 mb-2">
          Temporary Direct Link:
        </label>
        <div className="flex items-center">
          <input
            id="file-link"
            type="text"
            readOnly
            value={fileData.url}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-l-md text-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm overflow-x-auto"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-r-md transition-colors duration-200 flex items-center justify-center"
            style={{minWidth: '60px'}}
          >
            {copied ? (
               <CheckIcon className="w-5 h-5 text-white" />
            ) : (
               <ClipboardIcon className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-400">This link will expire in:</p>
        <p className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 mt-2">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </p>
      </div>

       <button
        onClick={onFileExpired}
        className="px-6 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/40 hover:text-red-300 transition-all duration-300"
       >
        Delete Now
      </button>
    </div>
  );
};

export default FileDisplay;

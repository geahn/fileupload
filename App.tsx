import React from 'react';
import { useState, useCallback } from 'react';
import type { UploadedFile } from './types';
import FileUpload from './components/FileUpload';
import FileDisplay from './components/FileDisplay';

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const FILE_LIFETIME_MS = 1 * 60 * 1000; // 1 minute

  const handleFileUpload = (file: File) => {
    // If there's an old file, revoke its blobUrl first to prevent memory leaks
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.blobUrl);
    }

    const blobUrl = URL.createObjectURL(file);
    
    // Simulate the backend URL for display and copy purposes
    const extension = file.name.split('.').pop() ? `.${file.name.split('.').pop()}` : '';
    const uniqueSuffix = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const simulatedUrl = `http://localhost:3000/files/${uniqueSuffix}${extension}`;
    
    const expiryTimestamp = Date.now() + FILE_LIFETIME_MS;
    
    setUploadedFile({
      file,
      url: simulatedUrl, // Use the realistic, simulated URL for display
      blobUrl: blobUrl,   // Keep the real blob URL for memory management
      expiryTimestamp,
    });
  };

  const handleFileDeletion = useCallback(() => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.blobUrl);
      setUploadedFile(null);
    }
  }, [uploadedFile]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-blue-500/10 border border-gray-700 overflow-hidden">
        <header className="p-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            TempFileDrop
          </h1>
          <p className="text-center text-gray-400 mt-2">
            Upload a file to get a temporary, direct link. It will self-destruct in 1 minute.
          </p>
        </header>
        <main className="p-6 md:p-8">
          {!uploadedFile ? (
            <FileUpload onFileUpload={handleFileUpload} />
          ) : (
            <FileDisplay fileData={uploadedFile} onFileExpired={handleFileDeletion} />
          )}
        </main>
      </div>
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>This is a frontend simulation. No files are uploaded to a server.</p>
        <p className="mt-1">
          A full implementation requires a backend service, possibly containerized with Docker.
        </p>
      </footer>
    </div>
  );
};

export default App;

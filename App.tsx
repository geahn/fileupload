import React from 'react';
import { useState, useCallback } from 'react';
import type { UploadedFile } from './types';
import FileUpload from './components/FileUpload';
import FileDisplay from './components/FileDisplay';

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const FILE_LIFETIME_MS = 1 * 60 * 1000; // 1 minute

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setUploadedFile(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Use a relative path, as the API is served from the same origin
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file.');
      }

      const result = await response.json();
      const expiryTimestamp = Date.now() + FILE_LIFETIME_MS;

      setUploadedFile({
        file,
        url: result.url,
        expiryTimestamp,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileDeletion = useCallback(() => {
    setUploadedFile(null);
  }, []);

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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
              <p className="mt-4 text-gray-300">Uploading...</p>
            </div>
          ) : error ? (
             <div className="text-center h-64 flex flex-col justify-center items-center">
                <p className="text-red-400">{error}</p>
                <button
                    onClick={() => setError(null)}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                    Try Again
                </button>
            </div>
          ) : !uploadedFile ? (
            <FileUpload onFileUpload={handleFileUpload} />
          ) : (
            <FileDisplay fileData={uploadedFile} onFileExpired={handleFileDeletion} />
          )}
        </main>
      </div>
       <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Powered by Docker.</p>
      </footer>
    </div>
  );
};

export default App;

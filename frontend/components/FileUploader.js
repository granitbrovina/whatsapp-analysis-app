'use client';

import { useDropzone } from 'react-dropzone';
import { UploadCloud, XCircle } from 'lucide-react';

export default function FileUploader({ onFileUpload, error, language }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onFileUpload(acceptedFiles[0]),
    accept: { 'text/plain': ['.txt'] },
    multiple: false,
  });

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg text-center">
      <h1 className="text-3xl font-bold text-gray-800">WhatsApp Chat Analyzer</h1>
      <p className="mt-2 text-gray-600">Get instant insights from your chat history.</p>
      
      <div
        {...getRootProps()}
        className={`mt-6 p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragActive ? 'border-brand-medium bg-brand-background' : 'border-gray-300 hover:border-brand-medium'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-gray-500">
          <UploadCloud className="w-12 h-12 mb-4 text-gray-400" />
          {isDragActive ? (
            <p className="text-lg font-semibold text-brand-dark">Drop the file here...</p>
          ) : (
            <>
              <p className="text-lg font-semibold text-gray-700">Drag & drop your .txt file here</p>
              <p className="text-sm mt-1 text-gray-500">or click to select file</p>
            </>
          )}
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-500">
        <p>Your data is processed securely and is deleted after analysis.</p>
      </div>
      {error && (
        <div className="mt-4 flex items-center justify-center text-red-600 bg-red-100 p-3 rounded-md">
          <XCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import axios from 'axios';
import FileUploader from '@/components/FileUploader';
import Dashboard from '@/components/Dashboard';
import useTaskPolling from '@/hooks/useTaskPolling';
import { Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Home() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [taskId, setTaskId] = useState(null);

  const { task, isLoading, progress } = useTaskPolling(taskId, setTaskId);

  const handleFileUpload = async (acceptedFile) => {
    if (!acceptedFile) return;
    setFile(acceptedFile);
    setError('');
    setTaskId(null);

    const formData = new FormData();
    formData.append('file', acceptedFile);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setTaskId(response.data.task_id);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'An error occurred during upload.';
      setError(errorMsg);
      setFile(null);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError('');
    setTaskId(null);
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      {!task && !isLoading && (
        <FileUploader onFileUpload={handleFileUpload} error={error} />
      )}
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-lg shadow-md">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Processing your chat...</h2>
          <p className="text-gray-500 mt-2">{progress || 'Please wait, this may take a moment.'}</p>
        </div>
      )}

      {task && task.status === 'SUCCESS' && (
        <Dashboard data={task.result.result} onReset={handleReset} />
      )}

      {task && task.status === 'FAILURE' && (
         <div className="text-center p-10 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-600">Analysis Failed</h2>
            <p className="text-gray-600 mt-2">{task.result.error || 'An unknown error occurred.'}</p>
            <button
                onClick={handleReset}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
                Try Again
            </button>
        </div>
      )}
    </div>
  );
}
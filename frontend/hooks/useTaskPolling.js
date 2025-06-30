import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const useTaskPolling = (taskId, setTaskId) => {
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');

  useEffect(() => {
    if (!taskId) {
      setTask(null);
      setIsLoading(false);
      setProgress('');
      return;
    }

    setIsLoading(true);
    setTask(null);

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_URL}/status/${taskId}`);
        const currentTask = response.data;
        
        if (currentTask.status === 'SUCCESS' || currentTask.status === 'FAILURE') {
          setTask(currentTask);
          setIsLoading(false);
          setProgress('');
          clearInterval(interval);
          // setTaskId(null); // <-- REMOVE THIS LINE. This was the bug.
        } else if (currentTask.status === 'PROGRESS') {
          setProgress(currentTask.result?.status || 'Processing...');
        } else {
          setTask(currentTask);
        }
      } catch (error) {
        console.error("Polling error:", error);
        setIsLoading(false);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [taskId, setTaskId]);

  return { task, isLoading, progress };
};

export default useTaskPolling;
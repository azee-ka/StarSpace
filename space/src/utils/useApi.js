import { useState, useEffect } from 'react';
import apiCall from './api'; // Import the generalized API call function

// Custom hook to fetch data via API
const useApi = (endpoint, method = 'GET', data = null, contentType = "application/json") => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await apiCall(endpoint, method, data, contentType);
        setResponse(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, method, data, contentType]); // Dependencies for the hook

  return { response, loading, error };
};

export default useApi;

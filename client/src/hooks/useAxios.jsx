import { useState, useEffect } from 'react';
import axios from 'axios';

const useAxios = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData  = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url, {
          signal: controller.signal,
          ...options,
        });
        setData(response.data);
        setError(null);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort(); // Cleanup on unmount or URL change
  }, [url, options]);

  return { data, loading, error };
};

export default useAxios;
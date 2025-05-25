import { useState } from 'react';
import axios from 'axios';

const useAxiosSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const sendRequest = async ({ method, url, data = {}, config = {} }) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axios({ method, url, data, ...config });
      setResponse(res.data);
      return res;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendRequest, loading, response, error };
};

export default useAxiosSubmit;
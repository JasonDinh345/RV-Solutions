import axios from "axios";
import { useEffect, useState } from "react";

export default function useGet(url, sendCredentials = false) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; 
    const fetchData = async()=>{
        setIsLoading(true);

    await axios
      .get(url, { withCredentials: sendCredentials })
      .then((res) => {
        if (isMounted) setData(res.data);
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          console.error(err);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    }
    fetchData()
    return () => {
      isMounted = false;
    };
  }, [url, sendCredentials]);

  return { data, isLoading, error };
}
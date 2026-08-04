import { useState, useEffect, useCallback } from "react";

export function useFetch(fetchFn, autoFetch = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchFn(...args);
        setData(res.data);
        return res.data;
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchFn]
  );

  useEffect(() => {
    let isCancelled = false;
    if (autoFetch) {
      Promise.resolve().then(() => {
        if (!isCancelled) {
          execute().catch(() => {});
        }
      });
    }
    return () => {
      isCancelled = true;
    };
  }, [autoFetch, execute]);

  return { data, loading, error, refetch: execute };
}

export default useFetch;


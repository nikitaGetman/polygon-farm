import { useCallback, useEffect, useState } from 'react';

export const REFERRER_SEARCH_PARAMS_KEY = 'r';
const REFERRER_STORAGE_KEY = 'ref';

export const useLocalReferrer = () => {
  const [localReferrer, setReferrer] = useState<string>();

  useEffect(() => {
    const localRef = localStorage.getItem(REFERRER_STORAGE_KEY);
    setReferrer(localRef ?? undefined);
  }, []);

  const setLocalReferrer = useCallback((ref: string) => {
    localStorage.setItem(REFERRER_STORAGE_KEY, ref);
    setReferrer(ref);
  }, []);

  return {
    localReferrer,
    setLocalReferrer,
  };
};

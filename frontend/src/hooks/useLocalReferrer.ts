import { useCallback, useState } from 'react';

export const REFERRER_SEARCH_PARAMS_KEY = 'r';
const REFERRER_STORAGE_KEY = 'ref';

export const useLocalReferrer = () => {
  const localRef = localStorage.getItem(REFERRER_STORAGE_KEY);
  const [localReferrer, setReferrer] = useState(localRef ?? undefined);

  const setLocalReferrer = useCallback((ref: string) => {
    localStorage.setItem(REFERRER_STORAGE_KEY, ref);
    setReferrer(ref);
  }, []);

  return {
    localReferrer,
    setLocalReferrer,
  };
};

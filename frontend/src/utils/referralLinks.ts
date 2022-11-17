import { REFERRER_SEARCH_PARAMS_KEY } from '@/hooks/useLocalReferrer';

export const createReferralLink = (address: string) => {
  return `${window.location.origin}?${REFERRER_SEARCH_PARAMS_KEY}=${address}`;
};

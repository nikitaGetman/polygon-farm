export const createReferralLink = (address: string) => {
  return `${window.location.origin}?r=${address}`;
};

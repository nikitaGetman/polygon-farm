import { useQuery } from 'wagmi';

import { ContractsEnum } from './contracts/useContractAbi';
import { useTokenContract } from './contracts/useTokenContract';

const SAV_TOKEN_BURN_REQUEST = 'sav-token-burn-request';
export const useSavTokenBurn = () => {
  const savToken = useTokenContract(ContractsEnum.SAV);

  return useQuery([SAV_TOKEN_BURN_REQUEST], async () => {
    return await savToken.totalBurned();
  });
};

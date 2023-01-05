import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from 'wagmi';

import { ContractsEnum } from '../contracts/useContractAbi';
import { useTokenContract } from '../contracts/useTokenContract';
import { useNotification } from '../useNotification';

const IS_PAUSED = 'is-paused';

export const useTokenControl = (token: ContractsEnum.SAV | ContractsEnum.SAVR) => {
  const queryClient = useQueryClient();
  const contract = useTokenContract(token);

  const { success, handleError } = useNotification();

  const isPaused = useQuery([IS_PAUSED, token], () => contract.paused());

  const pause = useMutation(
    ['pause-token-mutation'],
    async () => {
      const txHash = await contract.pause();
      success({ title: 'Success', description: `${token} token has been paused`, txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([IS_PAUSED, token]);
      },
      onError: handleError,
    }
  );

  const unpause = useMutation(
    ['unpause-token-mutation'],
    async () => {
      const txHash = await contract.unpause();
      success({ title: 'Success', description: `${token} token has been unpaused`, txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([IS_PAUSED, token]);
      },
      onError: handleError,
    }
  );

  const addToBlacklist = useMutation(
    ['add-to-blacklist-mutation'],
    async (value: string) => {
      const addresses = value
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean);

      const txHash = await contract.addToBlacklist(addresses);
      success({
        title: 'Success',
        description: `${addresses.join(', ')} addresses added to blacklist`,
        txHash,
      });
    },
    {
      onError: handleError,
    }
  );

  const removeFromBlacklist = useMutation(
    ['remove-from-blacklist-mutation'],
    async (value: string) => {
      const addresses = value
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean);

      const txHash = await contract.removeFromBlacklist(addresses);
      success({
        title: 'Success',
        description: `${addresses.join(', ')} addresses removed from blacklist`,
        txHash,
      });
    },
    {
      onError: handleError,
    }
  );

  const addToWhitelist = useMutation(
    ['add-to-whitelist-mutation'],
    async (value: string) => {
      const addresses = value
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean);

      const txHash = await contract.addToWhitelist(addresses);
      success({
        title: 'Success',
        description: `${addresses.join(', ')} addresses added to whitelist`,
        txHash,
      });
    },
    {
      onError: handleError,
    }
  );

  const removeFromWhitelist = useMutation(
    ['remove-from-whitelist-mutation'],
    async (value: string) => {
      const addresses = value
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean);

      const txHash = await contract.removeFromWhitelist(addresses);
      success({
        title: 'Success',
        description: `${addresses.join(', ')} addresses removed from whitelist`,
        txHash,
      });
    },
    {
      onError: handleError,
    }
  );

  return {
    contract,
    isPaused,
    pause,
    unpause,
    addToBlacklist,
    removeFromBlacklist,
    addToWhitelist,
    removeFromWhitelist,
  };
};

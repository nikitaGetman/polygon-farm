import { useCallback } from 'react';

import { ContractsEnum, useContractAbi } from './contracts/useContractAbi';
// import savIcon from '@/assets/images/sav_icon.svg';
// import savrIcon from '@/assets/images/savr_icon.svg';

export const useAddTokens = () => {
  const { address: savAddress } = useContractAbi({ contract: ContractsEnum.SAV });
  const { address: savrAddress } = useContractAbi({ contract: ContractsEnum.SAVR });

  const addToWallet = useCallback(
    async (tokenName: string) => {
      const TOKEN_PARAMS: Record<string, any> = {
        SAV: {
          address: savAddress,
          symbol: 'SAV',
          decimals: 18,
          // image: savIcon,
        },
        SAVR: {
          address: savrAddress,
          symbol: 'SAVR',
          decimals: 18,
          // image: savrIcon,
        },
      };

      try {
        const tokenParams = TOKEN_PARAMS[tokenName];

        if (!tokenParams) return;

        const wasAdded = await window.ethereum?.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: tokenParams.address,
              symbol: tokenParams.symbol,
              decimals: tokenParams.decimals,
              image: tokenParams.image,
            },
          },
        });
        if (wasAdded) {
          console.log('Thanks for your interest!');
        } else {
          console.log('Your loss!');
        }
      } catch (error) {
        console.log(error);
      }
    },
    [savAddress, savrAddress]
  );

  const addSAV = useCallback(() => addToWallet('SAV'), [addToWallet]);
  const addSAVR = useCallback(() => addToWallet('SAVR'), [addToWallet]);

  return { addSAV, addSAVR };
};

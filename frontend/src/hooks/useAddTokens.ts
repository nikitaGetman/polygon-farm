import { useCallback } from 'react';
// import savIcon from '@/assets/images/sav_icon.svg';
// import savrIcon from '@/assets/images/savr_icon.svg';

export const useAddTokens = () => {
  const addToWallet = useCallback(async (tokenName: string) => {
    const TOKEN_PARAMS: Record<string, any> = {
      SAV: {
        address: '0xb971Bbda8043267e8047372A29A5bfA8B78A2D04',
        symbol: 'SAV',
        decimals: 18,
        // image: savIcon,
      },
      SAVR: {
        address: '0xbaD18847048E47f58f90B049A3C2b5A308Fb0E66',
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
  }, []);

  const addSAV = useCallback(() => addToWallet('SAV'), [addToWallet]);
  const addSAVR = useCallback(() => addToWallet('SAVR'), [addToWallet]);

  return { addSAV, addSAVR };
};

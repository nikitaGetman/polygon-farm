import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Center, Container } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { useHasRole } from '@/hooks/admin/useHasRole';
import { ContractsEnum } from '@/hooks/contracts/useContractAbi';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { CenteredSpinner } from '../ui/CenteredSpinner/CenteredSpinner';
import { ConnectWalletButton } from '../ui/ConnectWalletButton/ConnectWalletButton';

export const AdminPanel = () => {
  useDocumentTitle('iSaver | Admin panel');

  const navigate = useNavigate();
  const { isConnected } = useAccount();

  const isSavAdmin = useHasRole(ContractsEnum.SAV);
  const isSavRAdmin = useHasRole(ContractsEnum.SAVR);
  const isStakingAdmin = useHasRole(ContractsEnum.Staking);
  const isReferralAdmin = useHasRole(ContractsEnum.ReferralManager);
  const isSquadsAdmin = useHasRole(ContractsEnum.Squads);
  const isLotteryAdmin = useHasRole(ContractsEnum.Lottery);
  const isVestingAdmin = useHasRole(ContractsEnum.TokenVesting);
  const isVendorSellAdmin = useHasRole(ContractsEnum.VendorSell);

  const adminContracts = useMemo(
    () => [
      isSavAdmin,
      isSavRAdmin,
      isStakingAdmin,
      isReferralAdmin,
      isSquadsAdmin,
      isLotteryAdmin,
      isVestingAdmin,
      isVendorSellAdmin,
    ],
    [
      isSavAdmin,
      isSavRAdmin,
      isStakingAdmin,
      isReferralAdmin,
      isSquadsAdmin,
      isLotteryAdmin,
      isVestingAdmin,
      isVendorSellAdmin,
    ]
  );

  const isAuthLoaded = useMemo(
    () => adminContracts.every(({ isFetched }) => isFetched),
    [adminContracts]
  );
  const isAnyAdmin = useMemo(() => adminContracts.some(({ data }) => data), [adminContracts]);

  useEffect(() => {
    if (isConnected && isAuthLoaded && !isAnyAdmin) {
      navigate('/');
    }
  }, [isConnected, isAuthLoaded, isAnyAdmin, navigate]);

  if (!isAuthLoaded) {
    return (
      <Box height="95vh" position="relative">
        {isConnected ? (
          <CenteredSpinner />
        ) : (
          <Center height="100%">
            <ConnectWalletButton />
          </Center>
        )}
      </Box>
    );
  }

  return <Container variant="dashboard">Admin</Container>;
};

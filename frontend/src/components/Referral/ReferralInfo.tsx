import React, { FC, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useClipboard,
  useDisclosure,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { ReactComponent as CopyIcon } from '@/assets/images/icons/copy.svg';
import { ReactComponent as QRIcon } from '@/assets/images/icons/qr.svg';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { StatBlock } from '@/components/ui/StatBlock/StatBlock';
import { useLocalReferrer } from '@/hooks/useLocalReferrer';
import { useNotification } from '@/hooks/useNotification';
import { useReferralManager } from '@/hooks/useReferralManager';
import { trimAddress } from '@/utils/address';
import { getReadableAmount } from '@/utils/number';

import { WarningTip } from '../ui/WarningTip/WarningTip';

import { ReferralLinkQRModal } from './ReferralLinkQRModal';
import { ReferralSubscriptionModal } from './ReferralSubscriptionModal';
import { ReferralUpdateModal } from './ReferralUpdateModal';

type ReferralInfoProps = {
  isPageView?: boolean;
};
export const ReferralInfo: FC<ReferralInfoProps> = ({ isPageView }) => {
  const { isConnected, address } = useAccount();

  const {
    isOpen: isRefSubscribeOpen,
    onOpen: onRefSubscribeOpen,
    onClose: onRefSubscribeClose,
  } = useDisclosure();
  const {
    isOpen: isLeaderUpdateOpen,
    onOpen: onLeaderUpdateOpen,
    onClose: onLeaderUpdateClose,
  } = useDisclosure();
  const { isOpen: isQRCodeOpen, onOpen: onQRCodeOpen, onClose: onQRCodeClose } = useDisclosure();

  const { localReferrer } = useLocalReferrer();
  const {
    userReferralInfo,
    hasEndingReferralSubscription,
    subscribeToLevel,
    subscribeToAllLevels,
    fullSubscriptionCost,
    levelSubscriptionCost,
    fullSubscription,
    levelsSubscription,
    subscriptionDuration,
    referralLink,
    referrer,
    setMyReferrer,
  } = useReferralManager();

  const isRefSubscribeLoading =
    userReferralInfo.isFetching ||
    fullSubscriptionCost.isFetching ||
    levelSubscriptionCost.isFetching;

  const { success } = useNotification();
  const { onCopy, hasCopied, setValue } = useClipboard('');
  useEffect(() => {
    if (referralLink) setValue(referralLink);
  }, [referralLink, setValue]);
  useEffect(() => {
    if (hasCopied) success({ title: 'Copied!' });
  }, [hasCopied, success]);

  const handleLeaderUpdate = useCallback(
    async (leader: string) => {
      await setMyReferrer.mutateAsync(leader);
      onLeaderUpdateClose();
    },
    [setMyReferrer, onLeaderUpdateClose]
  );

  return (
    <Container variant="dashboard">
      <Flex direction={{ sm: 'column', xl: 'row' }} justifyContent="space-between" gap={5}>
        <Box width={{ sm: '100%', xl: '60%' }}>
          <Text textStyle="sectionHeading" mb="20px">
            Build a team
          </Text>

          <Text textStyle="text1">
            Invite your friends and maximize your iSaver Referral Rewards. Earn up to 100% in SAVR
            from your partners' earnings. And additional Rewards when six partners fulfill the
            specified conditions.
          </Text>
        </Box>

        <Flex
          gap={5}
          alignSelf={{ sm: 'stretch', xl: 'flex-start' }}
          alignItems={{ sm: 'flex-start', xl: 'center' }}
          direction={{ sm: 'column', xl: 'row' }}
        >
          {hasEndingReferralSubscription ? <WarningTip>Check your subscription!</WarningTip> : null}

          {isConnected ? (
            isPageView ? (
              <Button onClick={onRefSubscribeOpen} width={{ sm: '100%', lg: '50%', xl: 'unset' }}>
                Activation status
              </Button>
            ) : (
              <Button as={Link} to="/team" width={{ sm: '100%', lg: '50%', xl: 'unset' }}>
                My team
              </Button>
            )
          ) : (
            <ConnectWalletButton />
          )}
        </Flex>
      </Flex>

      <Flex
        justifyContent="space-between"
        alignItems="flex-start"
        mt={{ sm: '50px', lg: '40px', xl: '50px', '2xl': '100px' }}
        direction={{ sm: 'column-reverse', xl: 'row' }}
      >
        <Box
          mt={{ sm: '50px', xl: 'unset' }}
          width={{ sm: '100%', xl: 'unset' }}
          alignSelf={isPageView ? 'flex-start' : 'flex-end'}
        >
          {isPageView && isConnected ? (
            <>
              {!referrer ? (
                <Button
                  mb={{ sm: '30px', xl: '15px' }}
                  width={{ sm: '100%', lg: '50%', xl: 'unset' }}
                  onClick={onLeaderUpdateOpen}
                >
                  Add Leader
                </Button>
              ) : null}

              {referrer || (localReferrer && localReferrer !== address) ? (
                <YourLeaderText referrer={referrer} localReferrer={localReferrer} />
              ) : null}
            </>
          ) : null}

          <Text textStyle="button" color={referralLink ? 'green.400' : 'gray.200'} mb="10px">
            Your referral link:
          </Text>
          <ReferralLink link={referralLink} onCopy={onCopy} onOpenQR={onQRCodeOpen} />

          {isConnected && !referralLink ? (
            <Text
              color="error"
              textStyle="textBold"
              fontSize="14"
              mt="12px"
              whiteSpace={{ xl: 'nowrap' }}
            >
              You will get your ref link after subscribing at the 1st team level
            </Text>
          ) : null}
        </Box>

        <StatBlock
          containerWidth={{ sm: '100%', lg: '530px', xl: 'unset' }}
          leftWidth={{ sm: '50%', xl: '230px', '2xl': '260px' }}
          leftTitle="Your Partners"
          leftValue={BigNumber.from(userReferralInfo.data?.totalReferrals || 0).toNumber()}
          rightWidth={{ sm: '50%', xl: '230px', '2xl': '260px' }}
          rightTitle="Total Referral Rewards"
          rightValue={getReadableAmount(userReferralInfo.data?.totalDividends || 0)}
          rightCurrency="SAVR"
        />
      </Flex>

      <ReferralSubscriptionModal
        isOpen={isRefSubscribeOpen}
        fullSubscriptionCost={fullSubscriptionCost.data || 0}
        levelSubscriptionCost={levelSubscriptionCost.data || 0}
        subscriptionDuration={subscriptionDuration}
        fullSubscriptionTill={fullSubscription}
        levelsSubscriptionTill={levelsSubscription}
        isLoading={isRefSubscribeLoading}
        onClose={onRefSubscribeClose}
        onFullSubscribe={subscribeToAllLevels.mutateAsync}
        onLevelSubscribe={subscribeToLevel.mutateAsync}
      />

      {isLeaderUpdateOpen ? (
        <ReferralUpdateModal
          leader={localReferrer}
          onClose={onLeaderUpdateClose}
          onUpdate={handleLeaderUpdate}
          isLoading={setMyReferrer.isLoading}
        />
      ) : null}

      {isQRCodeOpen && referralLink ? (
        <ReferralLinkQRModal onClose={onQRCodeClose} link={referralLink} />
      ) : null}
    </Container>
  );
};

const YourLeaderText = ({
  referrer,
  localReferrer,
}: {
  referrer?: string;
  localReferrer?: string;
}) => {
  return (
    <Flex alignItems="center" mb="15px">
      <Text textStyle="button" mr="15px" color={referrer ? 'green.400' : 'gray.200'}>
        Your leader:
      </Text>
      <Text textStyle="button" color={referrer ? 'white' : 'gray.200'}>
        {trimAddress(referrer || localReferrer)}
      </Text>
    </Flex>
  );
};

const ReferralLink = ({
  link = '',
  onCopy,
  onOpenQR,
}: {
  link?: string;
  onCopy: () => void;
  onOpenQR: () => void;
}) => {
  return (
    <Flex maxWidth={{ sm: '100%', lg: '460px' }}>
      <InputGroup variant="primary" size="md" minWidth={{ lg: '320px' }} mr="10px">
        <Input value={link} placeholder="https://**************" readOnly pr="40px" />
        <InputRightElement>
          <IconButton
            variant="inputTransparent"
            aria-label="copy"
            size="md"
            disabled={!link}
            onClick={onCopy}
          >
            <CopyIcon width="24px" height="24px" />
          </IconButton>
        </InputRightElement>
      </InputGroup>
      <IconButton
        variant="primaryShadowed"
        size="md"
        icon={<QRIcon height="24px" />}
        aria-label="qr-code"
        disabled={!link}
        onClick={onOpenQR}
      />
    </Flex>
  );
};

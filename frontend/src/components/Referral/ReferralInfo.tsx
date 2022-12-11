import React, { FC, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WarningTwoIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
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
      <Flex alignItems="center" gap="2">
        <Heading textStyle="h1">Build a team</Heading>
        <Spacer />
        <Box>
          {isConnected ? (
            <Box display="flex" alignItems="center">
              {hasEndingReferralSubscription ? (
                <Text
                  textStyle="textBold"
                  color="error"
                  mr="30px"
                  display="flex"
                  alignItems="center"
                >
                  <>
                    <WarningTwoIcon mr="10px" />
                    Check your levels!
                  </>
                </Text>
              ) : null}
              {isPageView ? (
                <Button onClick={onRefSubscribeOpen}>Activation status</Button>
              ) : (
                <Button as={Link} to="/team">
                  My team
                </Button>
              )}
            </Box>
          ) : (
            <ConnectWalletButton />
          )}
        </Box>
      </Flex>

      <Box maxWidth="640px" mt={5}>
        <Text textStyle="text1">
          Invite your friends and maximize your iSaver Referral Rewards. Earn up to 100% in SAVR
          from your partners' earnings. And additional Rewards when six partners fulfill the
          specified conditions.
        </Text>
      </Box>

      <Flex
        justifyContent="space-between"
        alignItems="flex-start"
        mt={isPageView ? '80px' : '50px'}
      >
        <Box alignSelf={isPageView ? 'flex-start' : 'flex-end'}>
          {isPageView && isConnected ? (
            <>
              {!referrer ? (
                <Button mb="15px" onClick={onLeaderUpdateOpen}>
                  Add Leader
                </Button>
              ) : null}

              {referrer || (localReferrer && localReferrer !== address) ? (
                <Flex alignItems="center" mb="15px">
                  <Text textStyle="button" mr="15px" color={referrer ? 'green.400' : 'gray.200'}>
                    Your leader:
                  </Text>
                  <Text textStyle="button" color={referrer ? 'white' : 'gray.200'}>
                    {trimAddress(referrer || localReferrer)}
                  </Text>
                </Flex>
              ) : null}
            </>
          ) : null}

          <Text textStyle="button" color={referralLink ? 'green.400' : 'gray.200'} mb="10px">
            Your referral link:
          </Text>
          <Flex>
            <InputGroup variant="primary" size="md" minWidth="320px" mr="10px">
              <Input
                value={referralLink || ''}
                placeholder="https://**************"
                readOnly
                pr="40px"
              />
              <InputRightElement>
                <IconButton
                  variant="inputTransparent"
                  aria-label="copy"
                  size="md"
                  disabled={!referralLink}
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
              disabled={!referralLink}
              onClick={onQRCodeOpen}
            />
          </Flex>

          {isConnected && !referralLink ? (
            <Text color="error" textStyle="textBold" fontSize="14" mt="8px">
              You will get your ref link after subscribing at the 1st team level
            </Text>
          ) : null}
        </Box>

        <Flex justifyContent="flex-end">
          <StatBlock width="260px">
            <Box textStyle="text1" mb="10px">
              Your Partners
            </Box>
            <Box textStyle="textSansBold" fontSize="26px" mr="6px">
              {BigNumber.from(userReferralInfo.data?.totalReferrals || 0).toNumber()}
            </Box>
          </StatBlock>
          <StatBlock width="260px">
            <Box textStyle="text1" mb="10px">
              Total Referral Reward
            </Box>
            <Box textStyle="text1">
              <Box as="span" textStyle="textSansBold" fontSize="26px" mr="6px">
                {getReadableAmount(userReferralInfo.data?.totalDividends || 0)}
              </Box>
              SAVR
            </Box>
          </StatBlock>
        </Flex>
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

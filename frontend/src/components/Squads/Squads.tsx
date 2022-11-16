import React, { FC, useCallback, useEffect } from 'react';
import { useConnectWallet } from '@/hooks/useConnectWallet';
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
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { StatBlock } from '@/components/ui/StatBlock/StatBlock';
import { ReactComponent as QRIcon } from '@/assets/images/icons/qr.svg';
import { ReactComponent as CopyIcon } from '@/assets/images/icons/copy.svg';
import { useNotification } from '@/hooks/useNotification';
import { trimAddress } from '@/utils/address';
import { useReferralManager } from '@/hooks/useReferralManager';
import { BigNumber } from 'ethers';
import { getReadableAmount } from '@/utils/number';
import { ReferralSubscriptionModal } from './ReferralSubscriptionModal';

type SquadsProps = {
  isPageView?: boolean;
};
export const Squads: FC<SquadsProps> = ({ isPageView }) => {
  const { isConnected } = useAccount();
  //   const { connect } = useConnectWallet();
  const {
    isOpen: isRefSubscribeOpen,
    onOpen: onRefSubscribeOpen,
    onClose: onRefSubscribeClose,
  } = useDisclosure(); //
  //   const navigate = useNavigate();

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
  } = useReferralManager();

  const isRefSubscribeLoading =
    subscribeToLevel.isLoading ||
    subscribeToAllLevels.isLoading ||
    fullSubscriptionCost.isLoading ||
    levelSubscriptionCost.isLoading;

  const { success } = useNotification();
  const { onCopy, hasCopied, setValue } = useClipboard('');
  useEffect(() => {
    if (referralLink) setValue(referralLink);
  }, [referralLink, setValue]);
  useEffect(() => {
    if (hasCopied) success('Copied');
  }, [hasCopied, success]);

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
          Invite your friends and maximize your rewards. Earn up to 100% in SAVR from your partners'
          earnings. And additional rewards when six partners fulfill the specified conditions.
        </Text>
      </Box>

      <Flex
        justifyContent="space-between"
        alignItems="flex-start"
        mt={isPageView ? '100px' : '50px'}
      >
        <Box alignSelf={isPageView ? 'flex-start' : 'flex-end'}>
          {isPageView && isConnected && !referrer ? <Button mb="15px">Add leader</Button> : null}

          {isPageView && referrer ? (
            <Flex alignItems="center" mb="15px">
              <Text textStyle="button" mr="15px" color="green.400">
                Your leader:
              </Text>
              <Text textStyle="button" color="white">
                {trimAddress(referrer)}
              </Text>
            </Flex>
          ) : null}
          {!referralLink && isConnected ? (
            <Text color="error" textStyle="textBold" mb="15px">
              You will get your ref link after subscribing at the 1st team level
            </Text>
          ) : null}
          <Text textStyle="button" color={referralLink ? 'green.400' : 'grey.200'} mb="10px">
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
            />
          </Flex>
        </Box>

        <Flex justifyContent="flex-end">
          <StatBlock width="260px">
            <Box textStyle="text1" mb="10px">
              Your partners
            </Box>
            <Box textStyle="textSansBold" fontSize="26px" mr="6px">
              {BigNumber.from(userReferralInfo.data?.totalReferrals || 0).toNumber()}
            </Box>
          </StatBlock>
          <StatBlock width="260px">
            <Box textStyle="text1" mb="10px">
              Total referral reward
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

      {isRefSubscribeOpen ? (
        <ReferralSubscriptionModal
          fullSubscriptionCost={fullSubscriptionCost.data || 0}
          levelSubscriptionCost={levelSubscriptionCost.data || 0}
          subscriptionDuration={subscriptionDuration}
          fullSubscriptionTill={fullSubscription}
          levelsSubscriptionTill={levelsSubscription}
          isLoading={isRefSubscribeLoading}
          onClose={onRefSubscribeClose}
          onFullSubscribe={subscribeToAllLevels.mutate}
          onLevelSubscribe={subscribeToLevel.mutate}
        />
      ) : null}
    </Container>
  );
};

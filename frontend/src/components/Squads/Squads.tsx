import React, { FC, useEffect } from 'react';
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

type SquadsProps = {
  isPageView?: boolean;
};
export const Squads: FC<SquadsProps> = ({ isPageView }) => {
  const { isConnected } = useAccount();
  //   const { connect } = useConnectWallet();
  //   const { isOpen, onOpen, onClose } = useDisclosure();
  //   const [selectedPlan, setSelectedPlan] = useState<number>();
  //   const navigate = useNavigate();

  const { userReferralInfo, hasEndingReferralSubscription } = useReferralManager();

  const referralLink = 'as'; //'https://some.link.com';
  //   const leader = '0x123asd123';
  const leader = null;

  const { success } = useNotification();
  const { onCopy, hasCopied } = useClipboard(referralLink);
  useEffect(() => {
    if (hasCopied) {
      success('Copied');
    }
  }, [hasCopied, success]);

  return (
    <Container variant="dashboard">
      <Flex alignItems="center" gap="2">
        <Heading textStyle="h1">Build a team</Heading>
        <Spacer />
        <Box>
          {isConnected ? (
            <Box display="flex" alignItems="center">
              {hasEndingReferralSubscription && (
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
              )}
              {isPageView ? (
                <Button>Activation status</Button>
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
          {isPageView && !leader ? <Button mb="15px">Add leader</Button> : null}

          {isPageView && leader ? (
            <Flex alignItems="center" mb="15px">
              <Text textStyle="button" mr="15px" color="green.400">
                Your leader:
              </Text>
              <Text textStyle="button" color="white">
                {trimAddress(leader)}
              </Text>
            </Flex>
          ) : null}
          <Text textStyle="button" color={referralLink ? 'green.400' : 'grey.200'} mb="10px">
            Your referral link:
          </Text>
          <Flex>
            <InputGroup variant="primary" size="md" width="320px" mr="10px">
              <Input value={referralLink} placeholder="https://**************" readOnly />
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
    </Container>
  );
};

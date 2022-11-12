import React, { FC } from 'react';
import { Box, Text, Flex, Button } from '@chakra-ui/react';

import { BigNumber, BigNumberish } from 'ethers';
import { getReadableDuration } from '@/utils/time';
import { bigNumberToString, getReadableAmount } from '@/utils/number';

type StakingPlanProps = {
  isSubscribed?: boolean;
  isSubscriptionEnding?: boolean;
  subscribedTill?: BigNumberish;
  subscriptionCost: BigNumberish;
  subscriptionDuration: BigNumberish;
  stakingDuration: BigNumberish;
  poolSize: BigNumberish;
  apr: number | string;
  userStakeSav: BigNumberish;
  userStakeSavR: BigNumberish;
  userReward?: BigNumber;
  isClaimAvailable?: boolean;
  isSubscribeLoading?: boolean;

  onSubscribe: () => void;
  onDeposit: () => void;
  onClaim: () => void;
};
export const StakingPlan: FC<StakingPlanProps> = ({
  isSubscribed,
  isSubscriptionEnding,
  subscribedTill,
  subscriptionCost,
  subscriptionDuration,
  stakingDuration,
  poolSize,
  apr,
  userStakeSav,
  userStakeSavR,
  userReward,
  isClaimAvailable,
  isSubscribeLoading,
  onSubscribe,
  onDeposit,
  onClaim,
}) => {
  const untilSubscriptionDate =
    subscribedTill &&
    new Date(BigNumber.from(subscribedTill).toNumber() * 1000).toLocaleDateString();

  return (
    <Box borderRadius="md" overflow="hidden" filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))">
      <Flex
        bgColor={isSubscribed ? 'green.10050' : 'grey.200'}
        p="10px 20px"
        justifyContent="flex-end"
        height="60px"
        alignItems="center"
      >
        {isSubscribed ? (
          isSubscriptionEnding ? (
            <>
              <Text textStyle="textSansBold">
                <>Until {untilSubscriptionDate}</>
              </Text>
              <Button
                variant="outlined-white"
                onClick={onSubscribe}
                isLoading={isSubscribeLoading}
                size="md"
                ml={5}
                w="140px"
              >
                Prolong
              </Button>
            </>
          ) : (
            <Text textStyle="textSansBold" px="44px">
              Active
            </Text>
          )
        ) : (
          <>
            <Text textStyle="textSansBold">
              {bigNumberToString(subscriptionCost, 18, 0)} SAV /{' '}
              {getReadableDuration(subscriptionDuration)}
            </Text>
            <Button onClick={onSubscribe} isLoading={isSubscribeLoading} size="md" ml={5}>
              Activate
            </Button>
          </>
        )}
      </Flex>

      <Box bgColor="rgba(38, 71, 55, 0.5)" boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)" p="20px">
        <Flex alignItems="center" gap={5}>
          <Box flexGrow={1}>
            <Flex justifyContent="space-between" gap={2} mb={7}>
              <StakingParameter title="Locking period">
                {getReadableDuration(stakingDuration)}
              </StakingParameter>
              <StakingParameter title="Pool size">{getReadableAmount(poolSize)}</StakingParameter>
              <StakingParameter title="APR">{apr}%</StakingParameter>
            </Flex>
            <Flex justifyContent="space-between">
              <StakingParameter title="Your Stake">
                <Box as="span" ml={3} mr={6}>
                  {getReadableAmount(userStakeSav)} SAV
                </Box>
                <Box as="span">{getReadableAmount(userStakeSavR)} SAVR</Box>
              </StakingParameter>
              <StakingParameter title="Your rewards">
                {getReadableAmount(userReward || 0)} SAV
              </StakingParameter>
            </Flex>
          </Box>

          <Flex direction="column" flex="0 0 140px" gap={4}>
            <Button onClick={onDeposit} variant="outlined" disabled={!isSubscribed}>
              Deposit
            </Button>
            <Button onClick={onClaim} variant="outlined" disabled={!isClaimAvailable}>
              Claim
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

const StakingParameter = ({ title, children }: { title: string; children: any }) => {
  return (
    <Flex alignItems="center">
      <Text textStyle="textSansSmall" mr="10px">{`${title}`}</Text>
      <Text textStyle="textSansBold">{children}</Text>
    </Flex>
  );
};
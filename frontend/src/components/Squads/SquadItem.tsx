import React, { FC, useCallback, useMemo, useState } from 'react';
import { BigNumber, BigNumberish } from 'ethers';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { getLocalDateString, getReadableDuration } from '@/utils/time';
import { bigNumberToString } from '@/utils/number';
import { ReactComponent as SquadSectionIcon } from '@/assets/images/icons/squad-section.svg';
import { ReactComponent as SquadSectionFilledIcon } from '@/assets/images/icons/squad-section-filled.svg';

type SquadItemProps = {
  subscription?: BigNumber;
  squadsFilled?: BigNumber;
  subscriptionCost: BigNumber;
  subscriptionDuration: BigNumberish;
  isSubscriptionEnding: boolean;
  stakingDuration: BigNumberish;
  reward: BigNumberish;
  squadSize: BigNumber;
  userHasStake: boolean;
  members?: string[];
  onSubscribe: () => Promise<void>;
};
export const SquadItem: FC<SquadItemProps> = ({
  subscription,
  squadsFilled,
  subscriptionCost,
  subscriptionDuration,
  isSubscriptionEnding,
  stakingDuration,
  reward,
  squadSize,
  userHasStake,
  members,
  onSubscribe,
}) => {
  const isSubscribed = useMemo(
    () => (subscription ? subscription.toNumber() > Date.now() / 1000 : false),
    [subscription]
  );

  const squad = useMemo(
    () =>
      Array.from({ length: BigNumber.from(squadSize).toNumber() }).map((_, index) => ({
        member: members?.[index],
      })),
    [members, squadSize]
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = useCallback(() => {
    setIsLoading(true);
    onSubscribe().finally(() => {
      setIsLoading(false);
    });
  }, [onSubscribe, setIsLoading]);

  return (
    <Box
      flex="1 0 420px"
      background="rgba(38, 71, 55, 0.5)"
      boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
      borderRadius="md"
      padding="40px 40px 52px"
      position="relative"
    >
      <Flex alignItems="center" justifyContent="space-between" height="50px" mb="50px">
        <Box>
          {!isSubscribed ? (
            <Button isLoading={isLoading} onClick={handleSubscribe} padding="15px 20px">
              Activate
            </Button>
          ) : null}
          {isSubscriptionEnding ? (
            <Button variant="outlinedWhite" isLoading={isLoading} onClick={handleSubscribe}>
              Prolong
            </Button>
          ) : null}
          {isSubscribed && !isSubscriptionEnding ? (
            <Text textStyle="textSansBold" fontSize="26px">
              Filling
            </Text>
          ) : null}
        </Box>
        <Box>
          {isSubscribed ? (
            <Text textStyle="textSansBold">
              <>until {getLocalDateString(BigNumber.from(subscription).toNumber())}</>
            </Text>
          ) : (
            <Text textStyle="textSansBold">
              {bigNumberToString(subscriptionCost, { precision: 0 })} SAV / 1 Team
            </Text>
          )}
        </Box>
      </Flex>

      <Box position="relative" height="300px" px="20px">
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
        >
          <Text textStyle="text1" fontSize="44px" lineHeight="40px" whiteSpace="nowrap">
            {bigNumberToString(reward, { precision: 0 })}
            <Text as="span" fontSize="24px" ml="5px">
              SAV
            </Text>
          </Text>

          <Text textStyle="text1" fontSize="44px" textTransform="uppercase" whiteSpace="nowrap">
            {getReadableDuration(stakingDuration)}
          </Text>

          <Text
            color={userHasStake ? 'green.400' : 'error'}
            textStyle="textRegular"
            textTransform="uppercase"
            whiteSpace="nowrap"
          >
            {userHasStake ? 'Stake active' : 'No your stake'}
          </Text>
        </Box>

        {squad.map(({ member }, index) => (
          <Box
            key={index}
            position="absolute"
            transformOrigin="150px 125px"
            transform={`translate(0, 25px) rotate(${60 * index}deg) `}
            color={member ? 'green.400' : 'turquoise.200'}
          >
            {member ? <SquadSectionFilledIcon /> : <SquadSectionIcon />}
          </Box>
        ))}
      </Box>

      <Text position="absolute" bottom="40px" right="60px" textAlign="center" opacity="0.3">
        {squadsFilled?.toNumber() || 0} fills
      </Text>
    </Box>
  );
};

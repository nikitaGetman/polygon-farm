import React from 'react';
import { useSquads } from '@/hooks/useSquads';
import { Flex, Skeleton } from '@chakra-ui/react';
import { SquadItem } from './SquadItem';
import { useHelperUserSquadsFullInfo } from '@/hooks/useHelper';
import { useAccount } from 'wagmi';

export const SquadsList = () => {
  const { address } = useAccount();
  const { subscriptionPeriodDays, subscribe } = useSquads();
  const { userSquadsInfo } = useHelperUserSquadsFullInfo(address);

  return (
    <Flex gap="20px">
      {!userSquadsInfo.length
        ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              height="490px"
              flexBasis="32%"
              borderRadius="md"
              startColor="gray.200"
              endColor="bgGreen.200"
            />
          ))
        : null}

      {userSquadsInfo.map(
        (
          {
            squadStatus,
            members,
            plan,
            userHasSufficientStaking,
            stakingPlan,
            isSubscriptionEnding,
          },
          index
        ) => (
          <SquadItem
            key={index}
            subscription={squadStatus.subscription}
            squadsFilled={squadStatus.squadsFilled}
            subscriptionCost={plan.subscriptionCost}
            squadSize={plan.squadSize}
            subscriptionDuration={subscriptionPeriodDays}
            isSubscriptionEnding={isSubscriptionEnding}
            stakingDuration={stakingPlan?.stakingDuration || 0}
            userHasStake={userHasSufficientStaking}
            members={members}
            reward={plan.reward}
            onSubscribe={() => subscribe.mutateAsync(index)}
          />
        )
      )}
    </Flex>
  );
};

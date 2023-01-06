import React from 'react';
import { Flex, Skeleton, useBreakpoint } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { useHelperUserSquadsFullInfo } from '@/hooks/useHelper';
import { useSquads } from '@/hooks/useSquads';

import { SquadItem } from './SquadItem';

export const SquadsList = () => {
  const { address } = useAccount();
  const { subscribe } = useSquads();
  const { userSquadsInfo } = useHelperUserSquadsFullInfo(address);

  const bp = useBreakpoint({ ssr: false });
  const isSm = ['sm', 'lg', 'xl'].includes(bp);

  return (
    <Flex
      justifyContent="center"
      gap={{ sm: '20px', md: '30px', lg: '10px', xl: '20px' }}
      flexWrap="wrap"
      marginX={{ lg: '-5px', base: 'unset' }}
    >
      {!userSquadsInfo.length
        ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              height={isSm ? '350px' : '490px'}
              width={isSm ? '300px' : '420px'}
              borderRadius="md"
              startColor="gray.200"
              endColor="bgGreen.200"
            />
          ))
        : null}

      {userSquadsInfo.map(
        ({
          squadStatus,
          members,
          plan,
          userHasSufficientStaking,
          stakingPlan,
          isSubscriptionEnding,
        }) => (
          <SquadItem
            key={plan.squadPlanId.toNumber()}
            isSmallSize={isSm}
            subscription={squadStatus.subscription}
            squadsFilled={squadStatus.squadsFilled}
            subscriptionCost={plan.subscriptionCost}
            squadSize={plan.squadSize}
            isSubscriptionEnding={isSubscriptionEnding}
            stakingDuration={stakingPlan?.stakingDuration || 0}
            userHasStake={userHasSufficientStaking}
            members={members}
            reward={plan.reward}
            onSubscribe={() => subscribe.mutateAsync(plan.squadPlanId.toNumber())}
          />
        )
      )}
    </Flex>
  );
};

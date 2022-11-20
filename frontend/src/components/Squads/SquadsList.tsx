import React, { useCallback, useState } from 'react';
import { useSquads } from '@/hooks/useSquads';
import { Flex, Skeleton } from '@chakra-ui/react';
import { SquadItem } from './SquadItem';

export const SquadsList = () => {
  const [selectedSquadPlanId, setSelectedSquadPlanId] = useState<number>();
  const { userSquadsInfoRequest, subscriptionPeriodDays, subscribe } = useSquads();

  const handleSubscribe = useCallback(
    (planId: number) => {
      setSelectedSquadPlanId(planId);
      subscribe.mutate(planId);
    },
    [setSelectedSquadPlanId, subscribe]
  );

  return (
    <Flex overflow="auto" gap="20px">
      {!userSquadsInfoRequest.data?.length
        ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              height="490px"
              flexBasis="33%"
              borderRadius="md"
              startColor="gray.200"
              endColor="bgGreen.200"
            />
          ))
        : null}

      {userSquadsInfoRequest.data?.map(({ squadStatus, members, plan }, index) => (
        <SquadItem
          key={index}
          subscription={squadStatus.subscription}
          squadsFilled={squadStatus.squadsFilled}
          subscriptionCost={plan.subscriptionCost}
          squadSize={plan.squadSize}
          subscriptionDuration={subscriptionPeriodDays}
          members={members}
          reward={plan.reward}
          isLoading={selectedSquadPlanId === index && subscribe.isLoading}
          onSubscribe={() => handleSubscribe(index)}
        />
      ))}
    </Flex>
  );
};

import { FC, useCallback, useState } from 'react';
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';

import { useStakingPlans } from '@/hooks/useStaking';
import { bigNumberToString } from '@/utils/number';
import { getReadableDuration } from '@/utils/time';

import { AddStakingModal } from '../common/AddStakingModal';
import { AdminSection } from '../common/AdminSection';

export const StakingControl = () => {
  const { stakingPlansRequest, addStakingPlan, updatePlanActivity } = useStakingPlans();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <AdminSection title="Staking">
      <>
        <Button size="sm" onClick={onOpen}>
          Add staking plan
        </Button>

        {stakingPlansRequest.data?.map((plan, index) => (
          <StakingPlanInfo
            key={index}
            index={index}
            duration={plan.stakingDuration}
            subscriptionCost={plan.subscriptionCost}
            apr={plan.apr.toString()}
            isActive={plan.isActive}
            onActivate={() => updatePlanActivity.mutateAsync({ planId: index, isActive: true })}
            onDeactivate={() => updatePlanActivity.mutateAsync({ planId: index, isActive: false })}
          />
        ))}

        {isOpen ? (
          <AddStakingModal onClose={onClose} onSubmit={addStakingPlan.mutateAsync} />
        ) : null}
      </>
    </AdminSection>
  );
};

type StakingPlanInfoProps = {
  index: number;
  duration: BigNumberish;
  subscriptionCost: BigNumber;
  apr: string | number;
  isActive: boolean;
  onActivate: () => Promise<void>;
  onDeactivate: () => Promise<void>;
};
const StakingPlanInfo: FC<StakingPlanInfoProps> = ({
  index,
  duration,
  subscriptionCost,
  apr,
  isActive,
  onActivate,
  onDeactivate,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = useCallback(() => {
    const action = isActive ? onDeactivate : onActivate;
    setIsLoading(true);
    action().finally(() => setIsLoading(false));
  }, [isActive, onDeactivate, onActivate, setIsLoading]);

  const Label = (props: any) => <Text opacity="0.5" {...props}></Text>;
  const Value = (props: any) => <Text {...props}></Text>;

  return (
    <Box
      textStyle="text1"
      mt="16px"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="sm"
      padding="8px"
    >
      <Flex alignItems="center" mb="8px">
        <Text mr="12px">id:{index} Staking plan</Text>
        <Text color={isActive ? 'green.400' : 'red'}>{isActive ? 'Active' : 'Disabled'}</Text>
      </Flex>
      <Flex alignItems="center">
        <Flex>
          <Label width="90px">Duration:</Label>
          <Value width="100px">{getReadableDuration(duration)}</Value>
        </Flex>
        <Flex>
          <Label width="160px">Subscription cost:</Label>
          <Value width="140px">{bigNumberToString(subscriptionCost)} SAV</Value>
        </Flex>
        <Flex>
          <Label width="50px">APR:</Label>
          <Value>{apr} %</Value>
        </Flex>

        <Button
          variant={isActive ? 'filledRed' : undefined}
          width="120px"
          ml="auto"
          size="sm"
          borderRadius="sm"
          isLoading={isLoading}
          onClick={handleAction}
        >
          {isActive ? 'Deactivate' : 'Activate'}
        </Button>
      </Flex>
    </Box>
  );
};

import { FC, useCallback, useState } from 'react';
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';

import { useStakingPlans } from '@/hooks/useStaking';
import { useStakingHistory } from '@/hooks/useStakingHistory';
import { bigNumberToString } from '@/utils/number';
import { getReadableDuration } from '@/utils/time';

import { AddStakingModal } from '../common/AddStakingModal';
import { AdminSection } from '../common/AdminSection';
import { StakeUnlockChart } from '../common/StakeUnlockChart';

export const StakingControl = () => {
  const { stakingPlansRequest, addStakingPlan, updatePlanActivity } = useStakingPlans();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const data = useStakingHistory();

  return (
    <AdminSection title="Staking" isLoading={stakingPlansRequest.isLoading}>
      <>
        <Text textStyle="text1" mb="12px">
          Staking unlock chart:
        </Text>
        <Box height="300px" mb="24px" pr="30px">
          <StakeUnlockChart data={data} />
        </Box>

        <Button size="sm" onClick={onOpen}>
          Add staking plan
        </Button>

        <Box mt="16px" maxHeight="400px" overflowY="auto">
          {stakingPlansRequest.data?.map((plan) => (
            <StakingPlanInfo
              key={plan.stakingPlanId}
              stakingPlanId={plan.stakingPlanId}
              duration={plan.stakingDuration}
              subscriptionCost={plan.subscriptionCost}
              apr={plan.apr.toString()}
              isActive={plan.isActive}
              onActivate={() =>
                updatePlanActivity.mutateAsync({
                  planId: plan.stakingPlanId,
                  isActive: true,
                })
              }
              onDeactivate={() =>
                updatePlanActivity.mutateAsync({
                  planId: plan.stakingPlanId,
                  isActive: false,
                })
              }
            />
          ))}
        </Box>

        {isOpen ? (
          <AddStakingModal onClose={onClose} onSubmit={addStakingPlan.mutateAsync} />
        ) : null}
      </>
    </AdminSection>
  );
};

type StakingPlanInfoProps = {
  stakingPlanId: number;
  duration: BigNumberish;
  subscriptionCost: BigNumber;
  apr: string | number;
  isActive: boolean;
  onActivate: () => Promise<void>;
  onDeactivate: () => Promise<void>;
};
const StakingPlanInfo: FC<StakingPlanInfoProps> = ({
  stakingPlanId,
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
      _notFirst={{ mt: '16px' }}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="sm"
      padding="8px"
    >
      <Flex alignItems="center" mb="8px">
        <Text mr="12px">Staking (id: {stakingPlanId})</Text>
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

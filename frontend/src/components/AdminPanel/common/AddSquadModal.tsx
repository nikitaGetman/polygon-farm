import { FC, useCallback, useState } from 'react';
import {
  Box,
  Button,
  CloseButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

type AddSquadModalProps = {
  onClose: () => void;
  onSubmit: ({
    subscriptionCost,
    reward,
    stakingPlanId,
  }: {
    subscriptionCost: BigNumber;
    reward: BigNumber;
    stakingPlanId: number;
  }) => Promise<void>;
};
export const AddSquadModal: FC<AddSquadModalProps> = ({ onClose, onSubmit }) => {
  const [subscriptionCost, setSubscriptionCost] = useState<string>();
  const [reward, setReward] = useState<string>();
  const [stakingPlanId, setStakingPlanID] = useState<string>();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(() => {
    if (subscriptionCost && reward && stakingPlanId) {
      const subscriptionCostBN = parseEther(subscriptionCost);
      const rewardBN = parseEther(reward);
      const stakingPlan = parseInt(stakingPlanId);

      setIsLoading(true);
      onSubmit({
        subscriptionCost: subscriptionCostBN,
        reward: rewardBN,
        stakingPlanId: stakingPlan,
      }).finally(() => setIsLoading(false));
    }
  }, [subscriptionCost, reward, stakingPlanId, setIsLoading, onSubmit]);

  const isDataValid = Boolean(subscriptionCost && reward && stakingPlanId);

  return (
    <Modal isCentered isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          Create new Squad plan
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              Subscription cost:
            </Text>
            <Input
              type="number"
              placeholder="SAV"
              onChange={(e) => setSubscriptionCost(e.target.value)}
            />
          </Box>

          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              Reward:
            </Text>
            <Input type="number" placeholder="SAV" onChange={(e) => setReward(e.target.value)} />
          </Box>

          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              Staking plan ID:
            </Text>
            <Input
              type="number"
              placeholder="0"
              onChange={(e) => setStakingPlanID(e.target.value)}
            />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            width="100%"
            variant="outlined"
            onClick={handleSubmit}
            disabled={!isDataValid || isLoading}
            isLoading={isLoading}
          >
            Create squad plan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

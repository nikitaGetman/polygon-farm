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

type AddStakingModalProps = {
  onClose: () => void;
  onSubmit: ({
    subscriptionCost,
    stakingDuration,
    apr,
  }: {
    subscriptionCost: BigNumber;
    stakingDuration: number;
    apr: number;
  }) => Promise<void>;
};
export const AddStakingModal: FC<AddStakingModalProps> = ({ onClose, onSubmit }) => {
  const [subscriptionCost, setSubscriptionCost] = useState<string>();
  const [duration, setDuration] = useState<string>();
  const [apr, setApr] = useState<string>();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(() => {
    if (subscriptionCost && duration && apr) {
      const subscriptionCostBN = parseEther(subscriptionCost);
      const durationDays = parseInt(duration);
      const formattedAPR = Math.floor(parseFloat(apr || '0') * 10);

      setIsLoading(true);
      onSubmit({
        subscriptionCost: subscriptionCostBN,
        stakingDuration: durationDays,
        apr: formattedAPR,
      }).finally(() => setIsLoading(false));
    }
  }, [subscriptionCost, duration, apr, setIsLoading, onSubmit]);

  const isDataValid = Boolean(subscriptionCost && duration && apr);

  return (
    <Modal isCentered isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          Create new Staking plan
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
              Staking duration:
            </Text>
            <Input type="number" placeholder="Days" onChange={(e) => setDuration(e.target.value)} />
          </Box>

          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              APR:
            </Text>
            <Input type="number" placeholder="%" onChange={(e) => setApr(e.target.value)} />
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
            Create staking plan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

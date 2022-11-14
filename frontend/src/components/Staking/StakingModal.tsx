import React, { FC, useCallback, useState } from 'react';
import { TOKENS } from '@/hooks/useTokens';
import {
  Box,
  Button,
  Checkbox,
  CloseButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { BigNumberish } from 'ethers';
import { Link as RouterLink } from 'react-router-dom';
import { ReactComponent as ChevronDownIcon } from '@/assets/images/icons/chevron-down.svg';
import { getReadableDuration } from '@/utils/time';
import { InputAmount } from '../ui/InputAmount/InputAmount';
import { useSavBalance, useSavRBalance } from '@/hooks/useTokenBalance';
import { bigNumberToString } from '@/utils/number';

const MIN_STAKE_LIMIT = 0.1;

const boxCommonStyles = {
  bgColor: 'grey.200',
  borderRadius: 'sm',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 20px',
  textStyle: 'textSansBold',
};

type StakingModalProps = {
  lockPeriodDays: BigNumberish;
  apr: number | string;
  isLoading?: boolean;
  onStake: (token: TOKENS, amount: number) => void;
  onClose: () => void;
};
export const StakingModal: FC<StakingModalProps> = ({
  lockPeriodDays,
  isLoading,
  apr,
  onStake,
  onClose,
}) => {
  const [token, setToken] = useState<TOKENS>(TOKENS.SAV);
  const [amount, setAmount] = useState<number>();
  const [isAgreed, setIsAgreed] = useState(false);
  const { data: savBalance } = useSavBalance();
  const { data: savrBalance } = useSavRBalance();

  const isStakeDisabled = !amount || amount < MIN_STAKE_LIMIT || !isAgreed;

  const handleStake = useCallback(() => {
    if (amount && amount >= MIN_STAKE_LIMIT) {
      onStake(token, amount);
    }
  }, [token, amount, onStake]);

  const balance = token === TOKENS.SAV ? savBalance : savrBalance;

  return (
    <Modal isCentered isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          <Menu variant="dark-transparent">
            <MenuButton
              as={Button}
              variant="transparent"
              rightIcon={<ChevronDownIcon />}
              padding={0}
              fontStyle="textBold"
              fontSize={26}
            >
              Stake {token}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setToken(TOKENS.SAV)}>Stake SAV</MenuItem>
              <MenuItem onClick={() => setToken(TOKENS.SAVR)}>Stake SAVR</MenuItem>
            </MenuList>
          </Menu>
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Box mb={5}>
            <InputAmount
              placeholder={`Min ${MIN_STAKE_LIMIT}`}
              total={balance ? bigNumberToString(balance, 18, 2) : undefined}
              onChange={setAmount}
              value={amount}
            />
          </Box>

          <Box {...boxCommonStyles} mb={5}>
            Locking period
            <Spacer />
            {getReadableDuration(lockPeriodDays)}
          </Box>
          <Box {...boxCommonStyles} mb={10}>
            APR
            <Spacer />
            {apr}%
          </Box>

          <Box {...boxCommonStyles} p={5}>
            <Checkbox isChecked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)}>
              <Text fontSize="18px" ml={2}>
                I have read, understand, and agree to the{' '}
                <Link as={RouterLink} color="yellow.200" to="#">
                  Terms of Service
                </Link>
              </Text>
            </Checkbox>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            width="100%"
            variant="outlined"
            onClick={handleStake}
            disabled={isStakeDisabled}
            isLoading={isLoading}
          >
            Stake funds
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

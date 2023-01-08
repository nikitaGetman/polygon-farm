import { FC, useCallback, useState } from 'react';
import DatePicker from 'react-datepicker';
import {
  Box,
  Button,
  Checkbox,
  CloseButton,
  Flex,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { parseEther } from 'ethers/lib/utils';

import { VestingScheduleProps } from '@/hooks/contracts/useVestingContract';

import { DateTimeInput } from './DateTimeInput';

type CreateVestingScheduleProps = {
  onClose: () => void;
  onSubmit: (props: VestingScheduleProps) => Promise<void>;
};
export const CreateVestingSchedule: FC<CreateVestingScheduleProps> = ({ onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() + 900_000));
  const [cliff, setCliff] = useState<number>();
  const [duration, setDuration] = useState<number>();
  const [slicePeriod, setSlicePeriod] = useState<number>();

  const [revocable, setRevocable] = useState(false);

  const [amount, setAmount] = useState<string>();

  const [beneficiaries, setBeneficiaries] = useState<string[]>(['']);

  const onChangeBeneficiary = useCallback(
    (index: number, e: any) => {
      const localBen = beneficiaries.slice();
      localBen[index] = e.target.value;
      setBeneficiaries(localBen);
    },
    [beneficiaries]
  );
  const addBeneficiary = useCallback(() => {
    const localBen = beneficiaries.slice();
    localBen.push('');
    setBeneficiaries(localBen);
  }, [beneficiaries]);

  const handleSubmit = useCallback(() => {
    if (!startDate || cliff === undefined || !duration || !slicePeriod || !amount) return;

    setIsLoading(true);
    onSubmit({
      start: Math.floor(startDate.getTime() / 1000),
      cliff,
      duration,
      slicePeriodSeconds: slicePeriod,
      revocable,
      amount: parseEther(amount),
      beneficiaries: beneficiaries.filter(Boolean),
    }).finally(() => setIsLoading(false));
  }, [startDate, cliff, duration, slicePeriod, revocable, amount, beneficiaries, onSubmit]);

  const isDataValid = cliff !== undefined && duration && slicePeriod && amount;

  return (
    <Modal isCentered isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          Create new Vesting Schedule
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Flex alignItems="center" mb="20px">
            <Text textStyle="text1" whiteSpace="nowrap" mr="12px">
              Start time:
            </Text>
            <DatePicker
              className="date-picker-element"
              selected={startDate}
              placeholderText="Select vesting start date"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={5}
              timeCaption="Time"
              dateFormat="yyyy-MM-dd HH:mm"
              onChange={(date: any) => setStartDate(date)}
            />
          </Flex>

          <Box mb="20px">
            <Text textStyle="text1" whiteSpace="nowrap" mb="4px">
              Cliff period (time before the release of tokens):
            </Text>
            <DateTimeInput onChange={setCliff} />
          </Box>

          <Box mb="20px">
            <Text textStyle="text1" whiteSpace="nowrap" mb="4px">
              Duration:
            </Text>
            <DateTimeInput onChange={setDuration} />
          </Box>

          <Box mb="20px">
            <Text textStyle="text1" whiteSpace="nowrap" mb="4px">
              Slice period:
            </Text>
            <DateTimeInput onChange={setSlicePeriod} />
          </Box>

          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              Total release amount:
            </Text>
            <Input
              size="md"
              type="number"
              placeholder="SAV"
              onChange={(e) => setAmount(e.target.value)}
            />
          </Box>

          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              Beneficiaries:
            </Text>
            <Box>
              {beneficiaries.map((beneficiary, index) => (
                <Input
                  key={index}
                  size="md"
                  mb="8px"
                  value={beneficiary}
                  placeholder="0x..."
                  onChange={onChangeBeneficiary.bind(this, index)}
                />
              ))}

              <Link onClick={addBeneficiary}>+ Add address</Link>
            </Box>
          </Box>

          <Box>
            <Checkbox
              colorScheme="green"
              isChecked={revocable}
              onChange={(e) => setRevocable(e.target.checked)}
            >
              <Text textStyle="text1">Revokable</Text>
            </Checkbox>
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
            Create vesting schedule
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

import { FC, useCallback, useState } from 'react';
import DatePicker from 'react-datepicker';
import {
  Box,
  Button,
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

import { CreateLotteryProps } from '@/hooks/contracts/useLotteryContract';

import 'react-datepicker/dist/react-datepicker.css';

type Level = {
  winners: string;
  prize: string;
};
type AddLotteryRoundProps = {
  onClose: () => void;
  onSubmit: (props: CreateLotteryProps) => Promise<void>;
};
export const AddLotteryRound: FC<AddLotteryRoundProps> = ({ onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() + 900_000));
  const [days, setDays] = useState<string>();
  const [hours, setHours] = useState<string>();
  const [mins, setMins] = useState<string>();
  const [secs, setSecs] = useState<string>();
  const [initialPrize, setInitialPrize] = useState<string>();
  const [tokensForOneTicket, setTokensForOneTicket] = useState<string>();
  const [maxTicketsFromOneMember, setMaxTicketsFromOneMember] = useState<string>();
  const [levels, setLevels] = useState<Level[]>([{ winners: '', prize: '' }]);

  const addLevel = useCallback(() => {
    const l = levels.slice();
    l.push({ winners: '', prize: '' });
    setLevels(l);
  }, [levels, setLevels]);

  const handleLevelChange = useCallback(
    (index: number, key: keyof Level, e: any) => {
      const l = levels.slice();
      l[index][key] = e.target.value;
      setLevels(l);
    },
    [levels]
  );

  const handleSubmit = useCallback(() => {
    if (!startDate) return;

    setIsLoading(true);

    const duration =
      parseFloat(days || '0') * (60 * 60 * 24) +
      parseFloat(hours || '0') * (60 * 60) +
      parseFloat(mins || '0') * 60 +
      parseFloat(secs || '0');

    const initialPrizeBN = parseEther(initialPrize || '0');
    const tokensForOneTicketBN = parseEther(tokensForOneTicket || '0');
    const maxTicketsFromOneMemberN = parseInt(maxTicketsFromOneMember || '0');
    const winnersForLevel = levels.map(({ winners }) => parseInt(winners));
    const prizeForLevel = levels.map(({ prize }) => parseInt(prize));

    onSubmit({
      startTime: Math.floor(startDate.getTime() / 1000),
      duration,
      initialPrize: initialPrizeBN,
      tokensForOneTicket: tokensForOneTicketBN,
      maxTicketsFromOneMember: maxTicketsFromOneMemberN,
      winnersForLevel,
      prizeForLevel,
    }).finally(() => setIsLoading(false));
  }, [
    startDate,
    days,
    hours,
    mins,
    secs,
    initialPrize,
    tokensForOneTicket,
    maxTicketsFromOneMember,
    levels,
    onSubmit,
  ]);

  const filterPassedTime = (time: Date | number) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() + 900_000 < selectedDate.getTime();
  };

  const isSubmitEnabled =
    (initialPrize || tokensForOneTicket) &&
    maxTicketsFromOneMember &&
    startDate &&
    (days || hours || mins || secs);

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          Create Raffle round
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
              minDate={new Date(Date.now() + 900_000)}
              filterTime={filterPassedTime}
              placeholderText="Select raffle start date"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="yyyy-MM-dd hh:mm"
              onChange={(date: any) => setStartDate(date)}
            />
          </Flex>

          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              Duration:
            </Text>
            <Flex alignItems="center" gap="8px">
              <Input
                size="md"
                type="number"
                fontSize="16px"
                placeholder="Days"
                onChange={(e) => setDays(e.target.value)}
              />
              -
              <Input
                size="md"
                type="number"
                fontSize="16px"
                placeholder="Hours"
                onChange={(e) => setHours(e.target.value)}
              />
              -
              <Input
                size="md"
                type="number"
                fontSize="16px"
                placeholder="Mins"
                onChange={(e) => setMins(e.target.value)}
              />
              -
              <Input
                size="md"
                type="number"
                fontSize="16px"
                placeholder="Secs"
                onChange={(e) => setSecs(e.target.value)}
              />
            </Flex>
          </Box>

          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              Initial prize:
            </Text>
            <Input
              type="number"
              placeholder="SAVR"
              onChange={(e) => setInitialPrize(e.target.value)}
            />
          </Box>

          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              Tokens for one Ticket:
            </Text>
            <Input
              type="number"
              placeholder="SAVR"
              onChange={(e) => setTokensForOneTicket(e.target.value)}
            />
          </Box>

          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              Max Tickets from one member:
            </Text>
            <Input
              type="number"
              placeholder="Amount of tickets"
              onChange={(e) => setMaxTicketsFromOneMember(e.target.value)}
            />
          </Box>

          <Box>
            <Text textStyle="text1" mb="4px">
              Levels:
            </Text>

            <Flex mb="4px">
              <Text width="51%" textStyle="text1" fontSize="14px">
                Winners:
              </Text>
              <Text textStyle="text1" fontSize="14px">
                Prize:
              </Text>
            </Flex>

            {levels.map((level, index) => (
              <Flex gap="8px" mb="8px" key={index}>
                <Input
                  fontSize="16px"
                  size="md"
                  value={level.winners}
                  placeholder="Winners"
                  onChange={handleLevelChange.bind(this, index, 'winners')}
                />
                <Input
                  fontSize="16px"
                  size="md"
                  value={level.prize}
                  placeholder="Prize %"
                  onChange={handleLevelChange.bind(this, index, 'prize')}
                />
              </Flex>
            ))}

            <Link onClick={() => addLevel()}>+ Add level</Link>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            width="100%"
            variant="outlined"
            isLoading={isLoading}
            isDisabled={!isSubmitEnabled || isLoading}
            onClick={handleSubmit}
          >
            Create Raffle round
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

import { FC, useCallback, useMemo, useState } from 'react';
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';

import { LotteryStatus } from '@/components/Lottery/LotteryStatus';
import { useLotteryControl } from '@/hooks/useLottery';
import { LotteryStatusEnum } from '@/lib/lottery';
import { getLocalDateTimeString, getStampsFromDuration } from '@/utils/time';

import { AddLotteryRound } from '../common/AddLotteryRound';
import { AdminSection } from '../common/AdminSection';
import { CloseLotteryRound } from '../common/CloseLotteryRound';

export const LotteryControl = () => {
  const {
    ticketPriceRequest,
    roundsRequest,
    finishLotteryRound,
    manuallyGetWinners,
    createLotteryRound,
  } = useLotteryControl();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <AdminSection
      title="Raffle"
      isLoading={ticketPriceRequest.isLoading || roundsRequest.isLoading}
    >
      <>
        <Button size="sm" onClick={onOpen}>
          Create lottery round
        </Button>

        <Box mt="16px" maxHeight="400px" overflowY="auto">
          {roundsRequest.data?.map((round) => (
            <LotteryRoundInfo
              key={round.id}
              {...round}
              onCloseRound={(pk: string[][]) =>
                finishLotteryRound.mutateAsync({ roundId: round.id, pk })
              }
              onFinishRound={() => manuallyGetWinners.mutateAsync(round.id)}
            />
          ))}
        </Box>

        {isOpen ? (
          <AddLotteryRound onClose={onClose} onSubmit={createLotteryRound.mutateAsync} />
        ) : null}
      </>
    </AdminSection>
  );
};

type LotteryRoundInfoProps = {
  id: number;
  startTime: number;
  duration: number;
  isClosed: boolean;
  isOracleFulfilled: boolean;
  isFinished: boolean;
  winnersForLevel: number[];
  prizeForLevel: number[];
  status: LotteryStatusEnum;
  totalTickets: number;
  onCloseRound: (pk: string[][]) => Promise<void>;
  onFinishRound: () => Promise<void>;
};
const LotteryRoundInfo: FC<LotteryRoundInfoProps> = ({
  id,
  startTime,
  duration,
  isClosed,
  isOracleFulfilled,
  isFinished,
  winnersForLevel,
  prizeForLevel,
  status,
  totalTickets,
  onCloseRound,
  onFinishRound,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFinishRound = useCallback(() => {
    setIsLoading(true);
    onFinishRound().finally(() => setIsLoading(false));
  }, [onFinishRound, setIsLoading]);

  const levels = winnersForLevel.length;

  const roundStatus = useMemo(() => {
    if (isClosed && !isFinished) return LotteryStatusEnum.closed;
    return status;
  }, [isClosed, status, isFinished]);

  const durationStampsString = useMemo(() => {
    const stamps = getStampsFromDuration(duration * 1000);
    const daysString = stamps.days.toString().padStart(2, '0');
    const hoursString = stamps.hours.toString().padStart(2, '0');
    const minsString = stamps.minutes.toString().padStart(2, '0');
    const secString = stamps.seconds.toString().padStart(2, '0');
    return `${daysString}d-${hoursString}h-${minsString}m-${secString}s`;
  }, [duration]);

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
      <Flex alignItems="center" mb="16px">
        <Text mr="12px">{id + 1} Raffle round</Text>
        <LotteryStatus status={roundStatus} noBorder />

        {roundStatus === LotteryStatusEnum.soldOut ? (
          <Button variant="filledRed" size="sm" ml="20px" padding="2px 8px" onClick={onOpen}>
            Close
          </Button>
        ) : null}

        {roundStatus === LotteryStatusEnum.closed && isOracleFulfilled ? (
          <Button
            variant="filledRed"
            size="sm"
            ml="20px"
            padding="2px 8px"
            isLoading={isLoading}
            onClick={handleFinishRound}
          >
            Finish
          </Button>
        ) : null}
      </Flex>

      <Flex mb="8px">
        <Flex>
          <Label width="75px">Start at:</Label>
          <Value width="200px">{getLocalDateTimeString(startTime)}</Value>
        </Flex>

        <Flex>
          <Label width="85px">Duration:</Label>
          <Value width="200px">{durationStampsString}</Value>
        </Flex>

        <Flex>
          <Label width="60px">Levels:</Label>
          <Value width="80px">{levels}</Value>
        </Flex>
      </Flex>

      <Flex>
        <Flex>
          <Flex>
            <Label width="110px">Total Tickets:</Label>
            <Value width="100px">{totalTickets}</Value>
          </Flex>

          <Flex>
            <Label width="150px">Winners for level:</Label>
            <Value width="200px">{winnersForLevel.join(', ')}</Value>
          </Flex>

          <Flex>
            <Label width="120px">Prize for level:</Label>
            <Value width="200px">{prizeForLevel.map((p) => `${p}%`).join(', ')}</Value>
          </Flex>
        </Flex>
      </Flex>

      {isOpen ? (
        <CloseLotteryRound
          winnersForLevel={winnersForLevel}
          onClose={onClose}
          onSubmit={onCloseRound}
        />
      ) : null}
    </Box>
  );
};

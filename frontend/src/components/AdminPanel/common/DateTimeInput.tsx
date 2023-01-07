import { FC, useEffect, useState } from 'react';
import { Flex, Input } from '@chakra-ui/react';

type DateTimeInputProps = {
  onChange: (timestamp: number) => void;
};
export const DateTimeInput: FC<DateTimeInputProps> = ({ onChange }) => {
  const [days, setDays] = useState<number>();
  const [hours, setHours] = useState<number>();
  const [mins, setMins] = useState<number>();
  const [secs, setSecs] = useState<number>();

  useEffect(() => {
    const duration =
      (days || 0) * (60 * 60 * 24) + (hours || 0) * (60 * 60) + (mins || 0) * 60 + (secs || 0);

    onChange(duration);
  }, [days, hours, mins, secs, onChange]);

  return (
    <Flex alignItems="center" gap="8px">
      <Input
        size="md"
        type="number"
        fontSize="16px"
        placeholder="Days"
        onChange={(e) => setDays(parseInt(e.target.value))}
      />
      -
      <Input
        size="md"
        type="number"
        fontSize="16px"
        placeholder="Hours"
        onChange={(e) => setHours(parseInt(e.target.value))}
      />
      -
      <Input
        size="md"
        type="number"
        fontSize="16px"
        placeholder="Mins"
        onChange={(e) => setMins(parseInt(e.target.value))}
      />
      -
      <Input
        size="md"
        type="number"
        fontSize="16px"
        placeholder="Secs"
        onChange={(e) => setSecs(parseInt(e.target.value))}
      />
    </Flex>
  );
};

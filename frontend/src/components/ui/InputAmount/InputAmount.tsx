import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Button, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import { BigNumberish } from 'ethers';

type InputAmountProps = {
  total?: BigNumberish;
  placeholder?: string;
  value?: number;
  onChange: (value?: number) => void;
};

export const InputAmount: FC<InputAmountProps> = ({ placeholder, value, total, onChange }) => {
  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    onChange(localValue ? parseFloat(localValue) : undefined);
  }, [localValue, onChange]);

  const handleChange = useCallback(
    (e: any) => {
      setLocalValue(e.target.value);
    },
    [setLocalValue]
  );

  return (
    <Box>
      <InputGroup variant="secondary" mb="8px">
        <Input type="number" placeholder={placeholder} value={localValue} onChange={handleChange} />
        <InputRightElement>
          {!!total && (
            <Button
              variant="transparent"
              color="white"
              _hover={{ opacity: 0.7 }}
              onClick={() => setLocalValue(total.toString())}
            >
              MAX
            </Button>
          )}
        </InputRightElement>
      </InputGroup>
      {total !== undefined ? (
        <Text textStyle="textSansSmall" textAlign="right" m="4px">
          <>You have: {total || 0}</>
        </Text>
      ) : null}
    </Box>
  );
};

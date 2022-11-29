import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
} from '@chakra-ui/react';

type InputAmountProps = {
  total?: string | null;
  placeholder?: string;
  value?: string | number;

  tokenTicker?: string;
  tokenIcon?: any;

  onChange: (value?: string) => void;
};

export const InputAmount: FC<InputAmountProps> = ({
  placeholder,
  value,
  tokenIcon,
  tokenTicker,
  total,
  onChange,
}) => {
  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    setLocalValue(value ? value.toString() : '');
  }, [value, setLocalValue]);

  const handleChange = useCallback(
    (val: string) => {
      setLocalValue(val);
      onChange(val);
    },
    [setLocalValue, onChange]
  );

  const inputPaddingRight = tokenTicker ? '150px' : undefined;

  return (
    <Box>
      <InputGroup variant="secondary">
        {tokenTicker ? (
          <InputLeftElement width="130px" padding="0 0 0 20px">
            <Flex
              alignItems="center"
              justifyContent="flex-start"
              width="100%"
              borderRight="1px solid white"
            >
              {tokenIcon}
              <Text textStyle="textSansBold">{tokenTicker}</Text>
            </Flex>
          </InputLeftElement>
        ) : null}

        <Input
          type="number"
          placeholder={placeholder}
          value={localValue}
          paddingLeft={inputPaddingRight}
          paddingRight="64px"
          textOverflow="ellipsis"
          onChange={(e) => handleChange(e.target.value)}
        />

        <InputRightElement mr="12px">
          {!!total && (
            <Button
              variant="transparent"
              color="white"
              _hover={{ opacity: 0.7 }}
              onClick={() => handleChange(total)}
            >
              MAX
            </Button>
          )}
        </InputRightElement>
      </InputGroup>
      <Text textStyle="textSansSmall" textAlign="right" mt="8px" height="16px">
        {total ? <>You have: {total}</> : null}
      </Text>
    </Box>
  );
};

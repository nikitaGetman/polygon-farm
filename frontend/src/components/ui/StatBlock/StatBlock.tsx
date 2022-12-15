import React from 'react';
import { Box, Center } from '@chakra-ui/react';

type StatBlockProps = {
  title: string;
  value: string | number;
  currency?: string;
  width?: any;
};
export const StatBlock = ({ title, value, currency, width }: StatBlockProps) => {
  return (
    <Box
      bg="linear-gradient(95.56deg, rgba(35, 157, 113, 0.54) -9.07%, rgba(35, 54, 72, 0.54) 110.38%)"
      boxShadow="0px 6px 20px rgba(0, 0, 0, 0.25)"
      borderRadius="sm"
      padding="16px 0"
      minW={{ sm: '160px', md: '200px' }}
      w={width}
    >
      <Center flexDir="column">
        <Box
          textStyle="text1"
          fontSize={{ sm: '12px', md: '18px' }}
          fontWeight={{ sm: '400', md: '500' }}
        >
          <Box mb={{ sm: '5px', md: '10px' }}>{title}</Box>
          <Box textAlign="center">
            <Box as="span" textStyle="textSansBold" fontSize={{ sm: '18px', md: '26px' }} mr="6px">
              {value}
            </Box>
            {currency}
          </Box>
        </Box>
      </Center>
    </Box>
  );
};

import React from 'react';
import { Box, Center } from '@chakra-ui/react';

export const StatBlock = ({ children, width }: { width?: any; children: any }) => {
  return (
    <Box
      bg="linear-gradient(95.56deg, rgba(35, 157, 113, 0.54) -9.07%, rgba(35, 54, 72, 0.54) 110.38%)"
      boxShadow="0px 6px 20px rgba(0, 0, 0, 0.25)"
      borderRadius="sm"
      padding="16px 0"
      minW={{ sm: '160px', md: '200px' }}
      w={width}
    >
      <Center flexDir="column">{children}</Center>
    </Box>
  );
};

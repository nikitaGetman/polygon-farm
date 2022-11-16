import React from 'react';
import { Box, Center, Spinner } from '@chakra-ui/react';

export const CenteredSpinner = () => {
  return (
    <Box
      position="absolute"
      left="0"
      top="0"
      width="100%"
      height="100%"
      background="rgba(13, 35, 16, 0.3)"
      zIndex="30"
    >
      <Center height="100%">
        <Spinner size="xl" color="green.400" thickness="4px" />
      </Center>
    </Box>
  );
};

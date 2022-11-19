import React from 'react';
import { Box, Container, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { ReferralInfo } from '../Referral/ReferralInfo';
import { ReferralsList } from '../Referral/ReferralsList';

export const SquadsPage = () => {
  return (
    <Container variant="dashboard" pt="60px">
      <Link as={RouterLink} to="/" textStyle="button" alignSelf="flex-start" mb="40px">
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        Back
      </Link>

      <Box mb="35px">
        <ReferralInfo isPageView />
      </Box>

      <Box mb="120px">
        <ReferralsList />
      </Box>
    </Container>
  );
};

import React from 'react';
import { Box, Button, Container, Flex, Heading, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowBackIcon, DownloadIcon, SearchIcon } from '@chakra-ui/icons';
import { Squads } from './Squads';

export const SquadsPage = () => {
  return (
    <Container variant="dashboard" pt="60px">
      <Link as={RouterLink} to="/" textStyle="button" alignSelf="flex-start" mb="40px">
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        Back
      </Link>

      <Box mb="80px">
        <Squads isPageView />
      </Box>

      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Heading textStyle="h3" textTransform="uppercase" id="referral-list">
          Your level
        </Heading>

        <Flex alignItems="center">
          <Button variant="link">
            Search wallet
            <SearchIcon ml="12px" />
          </Button>
          <Button variant="link" display="none">
            Export
            <DownloadIcon ml="12px" />
          </Button>
        </Flex>
      </Flex>

      <Box mb="120px">{/* <StakingTable stakes={stakesList} onClaim={onClaim} /> */}</Box>
    </Container>
  );
};

import React from 'react';
import { Container, Text, Box } from '@chakra-ui/react';
import { Staking } from '@/components/Staking/Staking';
import './Dashboard.scss';

export const Dashboard = () => {
  return (
    <Container variant="dashboard">
      <Box
        mt="50px"
        w="100%"
        p="50px 40px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        background="linear-gradient(96.85deg, #20735B -8.44%, #1A3435 102.66%)"
        boxShadow="0px 6px 20px rgba(0, 0, 0, 0.25)"
        backdropFilter="blur(22.5px)"
        borderRadius="10px"
      >
        <Box flex="1 1 600px">
          <Text textStyle="h1">
            Project for smart
            <br />
            investors
          </Text>
          <Text textStyle="text1" mt={5}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy.
          </Text>
        </Box>

        <Box background="rgba(0, 0, 0, 0.2)" borderRadius="10px" flex="1 1 510px">
          Wallet portfolio
        </Box>
      </Box>

      <Staking />
    </Container>
  );
};

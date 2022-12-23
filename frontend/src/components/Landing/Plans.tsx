import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

import './Landing.scss';

export const Plans = () => {
  return (
    <Flex justifyContent="center" flexWrap="wrap" className="plans">
      <Flex w="100%" justifyContent="center" mb={{ sm: '30px', xl: '40px', '2xl': '50px' }}>
        <h4 className="heading">Our plans</h4>
      </Flex>
      <Flex className="plans-container" flexWrap="wrap" justifyContent="space-between">
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">
            Customizable
            <br />
            User Profile
          </Text>
          <Text className="plans-item__text">
            It will give more opportunities for communication between users to buld teams
          </Text>
        </Flex>
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">GameFI</Text>
          <Text className="plans-item__text">
            Launching an exciting P2E game based on NFT and using our tokens
          </Text>
        </Flex>
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">
            NFT
            <br />
            marketplace
          </Text>
          <Text className="plans-item__text">
            It will be focused on in-game assets and allows players to trade NFT as they wish
          </Text>
        </Flex>
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">Pawnshop</Text>
          <Text className="plans-item__text">Borrow crypto using your NFT’s as collateral</Text>
        </Flex>
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">Audits</Text>
          <Text className="plans-item__text">
            A comprehensive security assessment of our smart contracts
          </Text>
        </Flex>
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">
            Governance
            <br />
            DAO
          </Text>
          <Text className="plans-item__text">
            All holders SAV will be able to participate in the activities and development of the
            platform
          </Text>
        </Flex>
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">DEX</Text>
          <Text className="plans-item__text">
            Listing on major exchanges and provide sufficient liquidity pools for SAV sustainability
          </Text>
        </Flex>
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">Airdrops</Text>
          <Text className="plans-item__text">
            We will be distributing retroactive rewards for early users
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

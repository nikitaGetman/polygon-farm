import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

import './Landing.scss';

export const Plans = () => {
  return (
    <Flex justifyContent="center" flexWrap="wrap" className="plans">
      <Flex w="100%" justifyContent="center" mb="50px">
        <h4 className="heading">Our plans</h4>
      </Flex>
      <Flex className="plans-container" flexWrap="wrap" justifyContent="space-between">
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">
            Customizable <br /> User Profile
          </Text>
          <Text className="plans-item__text">
            It will give more <br /> opportunities for <br /> communication between <br /> users to
            buld teams
          </Text>
        </Flex>
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">GameFI</Text>
          <Text className="plans-item__text">
            Launching an exciting <br /> P2E game based on <br /> NFT and using our <br /> tokens
          </Text>
        </Flex>
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">
            NFT <br /> marketplace
          </Text>
          <Text className="plans-item__text">
            It will be focused on in
            <br />
            -game assets and allows <br /> players to trade NFT as <br /> they wish
          </Text>
        </Flex>
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">Pawnshop</Text>
          <Text className="plans-item__text">
            Borrow crypto using <br /> your NFT’s as collateral
          </Text>
        </Flex>
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">Audits</Text>
          <Text className="plans-item__text">
            A comprehensive security <br /> assessment of our smart <br /> contracts
          </Text>
        </Flex>
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">
            Governance <br /> DAO
          </Text>
          <Text className="plans-item__text">
            All holders SAV will be able <br /> to participate in the <br /> activities and <br />{' '}
            development of the <br />
            platform
          </Text>
        </Flex>
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">DEX</Text>
          <Text className="plans-item__text">
            Listing on major <br /> exchanges and provide <br /> sufficient liquidity pools <br />{' '}
            for SAV sustainability
          </Text>
        </Flex>
        <Flex flexDirection="column" className="plans-item card--shadow">
          <Text className="color-blue plans-item__heading">Airdrops</Text>
          <Text className="plans-item__text">
            We will be distributing <br /> retroactive rewards for <br /> early users
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

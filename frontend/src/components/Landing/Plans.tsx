import React from 'react';
import { Flex, Text, useBreakpoint } from '@chakra-ui/react';

import './Landing.scss';

const PLANS_DATA = [
  {
    title: 'Customizable<br />User Profile',
    description: 'It will give more opportunities for communication between users to build teams',
  },
  {
    title: 'GameFI',
    description: 'Launching an exciting P2E game based on NFT and using our tokens',
  },
  {
    title: 'NFT<br />marketplace',
    description:
      'It will be focused on in-game assets and allows players to trade NFT as they wish',
  },
  { title: 'Pawnshop', description: 'Borrow crypto using your NFT’s as collateral' },
  { title: 'Audits', description: 'A comprehensive security assessment of our smart contracts' },
  {
    title: 'Governance<br />DAO',
    description:
      'All holders SAV will be able to participate in the activities and development of the platform',
  },
  {
    title: 'DEX',
    description:
      'Listing on major exchanges and provide sufficient liquidity pools for SAV sustainability',
  },
  { title: 'Airdrops', description: 'We will be distributing retroactive rewards for early users' },
];

export const Plans = () => {
  const bp = useBreakpoint({ ssr: false });
  const isSmall = ['md', 'xl'].includes(bp);

  return (
    <Flex justifyContent="center" flexWrap="wrap" className="plans">
      <Flex w="100%" justifyContent="center" mb={{ sm: '30px', xl: '40px', '2xl': '50px' }}>
        <h4 className="heading">Our plans</h4>
      </Flex>
      <Flex className="plans-container" flexWrap="wrap" justifyContent="center">
        {PLANS_DATA.map(({ title, description }) => (
          <PlanItem title={title} description={description} size={isSmall ? 'small' : 'medium'} />
        ))}
      </Flex>
    </Flex>
  );
};

const PlanItem = ({
  title,
  description,
  size,
}: {
  title: string;
  description: string;
  size: string;
}) => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="flex-start"
      className={`plans-item card--shadow plans-item--size-${size}`}
    >
      <Text
        className="color-blue plans-item__heading"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <Text className="plans-item__text">{description}</Text>
    </Flex>
  );
};

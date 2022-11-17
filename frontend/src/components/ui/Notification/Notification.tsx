import React, { FC, useMemo } from 'react';
import { Box, Link, Text } from '@chakra-ui/react';
import { useNetwork, chain } from 'wagmi';

export type NotificationProps = {
  type: 'success' | 'error' | 'info';
  title: string;
  description?: any;
  txHash?: string;
};
export const Notification: FC<NotificationProps> = ({ type, title, description, txHash }) => {
  const titleColor = useMemo(() => {
    if (type === 'error') return 'error';
    if (type === 'success') return 'green.400';
    return 'white';
  }, [type]);

  const { chain: currentChain } = useNetwork();

  const scanLink = useMemo(() => {
    if (currentChain?.id === chain.polygon.id) {
      return `https://polygonscan.com/tx/${txHash}`;
    }

    return `https://mumbai.polygonscan.com/tx/${txHash}`;
  }, [txHash, currentChain]);

  return (
    <Box bgColor="bgGreen.800" borderRadius="13px" padding="20px 30px" maxWidth="340px">
      <Text textStyle="textSansBold" fontSize="24px" color={titleColor}>
        {title}
      </Text>
      {description ? (
        <Box textStyle="text1" mt="10px">
          {description}
        </Box>
      ) : null}
      {txHash && scanLink ? (
        <Link href={scanLink} target="_blank" color="green.400" display="block" mt="10px">
          View in Polygonscan
        </Link>
      ) : null}
    </Box>
  );
};

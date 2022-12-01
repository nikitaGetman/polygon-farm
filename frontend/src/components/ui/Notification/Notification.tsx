import React, { FC, useMemo } from 'react';
import { Box, CloseButton, Flex, Link, Text } from '@chakra-ui/react';
import { useNetwork, chain } from 'wagmi';

export type NotificationProps = {
  type: 'success' | 'error' | 'info';
  title: string;
  description?: any;
  txHash?: string;
  onClose: () => void;
};
export const Notification: FC<NotificationProps> = ({
  type,
  title,
  description,
  txHash,
  onClose,
}) => {
  const { chain: currentChain } = useNetwork();

  const textColor = useMemo(() => {
    if (type === 'error') return 'error';
    return 'white';
  }, [type]);
  const borderColor = useMemo(() => {
    if (type === 'error') return 'error';
    return 'green.400';
  }, [type]);

  const scanLink = useMemo(() => {
    if (currentChain?.id === chain.polygon.id) {
      return `https://polygonscan.com/tx/${txHash}`;
    }
    return `https://mumbai.polygonscan.com/tx/${txHash}`;
  }, [txHash, currentChain]);

  return (
    <Box
      bgColor="bgGreen.200"
      borderRadius="13px"
      p="20px 20px 20px 30px"
      width="380px"
      borderLeft="10px solid"
      borderColor={borderColor}
    >
      <Flex justifyContent="space-between">
        <Text textStyle="textSansBold" fontSize="24px" color="white">
          {title}
        </Text>
        <CloseButton onClick={onClose} />
      </Flex>
      {description ? (
        <Box textStyle="text1" mt="10px" color={textColor}>
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

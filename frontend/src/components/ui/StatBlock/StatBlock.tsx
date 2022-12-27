import React from 'react';
import { Box, Center, Flex } from '@chakra-ui/react';

type StatBlockProps = {
  leftTitle: string;
  leftValue: string | number;
  leftCurrency?: string;
  leftWidth?: any;

  rightTitle?: string;
  rightValue?: string | number;
  rightCurrency?: string;
  rightWidth?: any;

  containerWidth?: any;
};
export const StatBlock = ({
  containerWidth,
  leftTitle,
  leftValue,
  leftCurrency,
  leftWidth,
  rightTitle,
  rightValue,
  rightCurrency,
  rightWidth,
}: StatBlockProps) => {
  const hasRight = Boolean(rightTitle);

  return (
    <Flex
      bg="linear-gradient(95.56deg, rgba(35, 157, 113, 0.54) -9.07%, rgba(35, 54, 72, 0.54) 110.38%)"
      boxShadow="0px 6px 20px rgba(0, 0, 0, 0.25)"
      borderRadius="sm"
      padding="10px 0"
      minW={containerWidth || { sm: '100%', lg: '200px' }}
    >
      <Box w={leftWidth} py="6px">
        <Center flexDir="column">
          <Box
            textStyle="text1"
            fontSize={{ sm: '12px', md: '18px' }}
            fontWeight={{ sm: '400', md: '500' }}
          >
            <Box mb={{ sm: '5px', md: '10px' }}>{leftTitle}</Box>
            <Box textAlign="center">
              <Box
                as="span"
                textStyle="textSansBold"
                fontSize={{ sm: '18px', md: '26px' }}
                mr="6px"
              >
                {leftValue}
              </Box>
              {leftCurrency}
            </Box>
          </Box>
        </Center>
      </Box>

      {hasRight ? (
        <>
          <Box width="1px" bgColor="white" />

          <Box w={rightWidth} py="6px">
            <Center flexDir="column">
              <Box
                textStyle="text1"
                fontSize={{ sm: '12px', md: '18px' }}
                fontWeight={{ sm: '400', md: '500' }}
              >
                <Box mb={{ sm: '5px', md: '10px' }}>{rightTitle}</Box>
                <Box textAlign="center">
                  <Box
                    as="span"
                    textStyle="textSansBold"
                    fontSize={{ sm: '18px', md: '26px' }}
                    mr="6px"
                  >
                    {rightValue}
                  </Box>
                  {rightCurrency}
                </Box>
              </Box>
            </Center>
          </Box>
        </>
      ) : null}
    </Flex>
  );
};

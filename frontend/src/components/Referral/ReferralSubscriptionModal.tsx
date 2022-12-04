import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CloseButton,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { BigNumberish } from 'ethers';
import { ReactComponent as CheckIcon } from '@/assets/images/icons/check.svg';
import { getReadableAmount } from '@/utils/number';
import { getLocalDateString, getReadableDuration } from '@/utils/time';
import { CenteredSpinner } from '../ui/CenteredSpinner/CenteredSpinner';
import { REFERRAL_SUBSCRIPTION_ENDING_NOTIFICATION } from '@/hooks/useReferralManager';

type ReferralSubscriptionModalProps = {
  fullSubscriptionCost: BigNumberish;
  levelSubscriptionCost: BigNumberish;
  subscriptionDuration: number;
  fullSubscriptionTill: number;
  levelsSubscriptionTill: number[];
  isLoading: boolean;
  onLevelSubscribe: (level: number) => Promise<void>;
  onFullSubscribe: () => Promise<void>;
  onClose: () => void;
};
export const ReferralSubscriptionModal: FC<ReferralSubscriptionModalProps> = ({
  fullSubscriptionCost,
  levelSubscriptionCost,
  subscriptionDuration,
  fullSubscriptionTill,
  levelsSubscriptionTill,
  isLoading,
  onLevelSubscribe,
  onFullSubscribe,
  onClose,
}) => {
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [isLevelLoading, setIsLevelLoading] = useState(false);

  const handleSubscribeToFull = useCallback(async () => {
    setIsFullLoading(true);
    return onFullSubscribe().finally(() => {
      setIsFullLoading(false);
    });
  }, [setIsFullLoading, onFullSubscribe]);

  const handleSubscribeToLevel = useCallback(
    async (level: number) => {
      setIsLevelLoading(true);
      return onLevelSubscribe(level).finally(() => {
        setIsLevelLoading(false);
      });
    },
    [onLevelSubscribe, setIsLevelLoading]
  );

  return (
    <Modal isCentered isOpen={true} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent position="relative">
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          <Text textStyle="textSansBold" fontSize="26px">
            Activation Build A Team
          </Text>
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody display="flex" flexDirection="column" mr="-16px" pr="16px">
          {isLoading ? <CenteredSpinner /> : null}

          <Box mt="6px">
            <SubscriptionLevel
              title="All levels"
              price={fullSubscriptionCost}
              duration={subscriptionDuration}
              subscriptionTill={fullSubscriptionTill}
              disabled={isLevelLoading}
              onSubscribe={handleSubscribeToFull}
            />
          </Box>
          <Divider mt="30px" />

          <Box overflow="auto" className="with-custom-scroll" mr="-16px" pr="16px">
            <Box>
              {levelsSubscriptionTill.map((subTill, index) => (
                <Box key={index} mt="30px">
                  <SubscriptionLevel
                    title={`${index + 1} Level`}
                    price={levelSubscriptionCost}
                    duration={subscriptionDuration}
                    subscriptionTill={subTill}
                    disabled={isFullLoading || isLevelLoading}
                    onSubscribe={() => handleSubscribeToLevel(index + 1)}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

type SubscriptionLevelProps = {
  title: string;
  price: BigNumberish;
  duration: number;
  subscriptionTill: number;
  disabled: boolean;
  onSubscribe: () => Promise<void>;
};
const SubscriptionLevel: FC<SubscriptionLevelProps> = ({
  price,
  duration,
  title,
  subscriptionTill,
  disabled,
  onSubscribe,
}) => {
  const currentTime = Date.now() / 1000;
  const isActive = subscriptionTill > currentTime;
  const isEnding =
    isActive && subscriptionTill - currentTime < REFERRAL_SUBSCRIPTION_ENDING_NOTIFICATION;

  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = useCallback(async () => {
    setIsLoading(true);
    onSubscribe().finally(() => {
      setIsLoading(false);
    });
  }, [onSubscribe, setIsLoading]);

  return (
    <Box>
      <Flex alignItems="center" mb="10px">
        <Text textStyle="textSansBold">{title}</Text>
        {isActive ? (
          <Box color="green.400" width="16px" ml="5px">
            <CheckIcon />
          </Box>
        ) : null}
      </Flex>

      <Flex>
        <Flex
          bgColor="bgGreen.800"
          p="13px 20px"
          borderRadius="sm"
          mr={isActive ? '0px' : '10px'}
          flexGrow="1"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text textStyle="textSansBold" textOverflow="ellipsis">
            {getReadableAmount(price, { precision: 0 })} SAV / {getReadableDuration(duration)}
          </Text>
          {isActive ? (
            <>
              <Divider orientation="vertical" ml="auto" mr="15px" />
              <Text textStyle="textSansSmall">
                {isEnding ? '' : 'to '}
                {getLocalDateString(subscriptionTill)}
              </Text>
            </>
          ) : null}
        </Flex>
        {!isActive ? (
          <Button onClick={handleSubscribe} isLoading={isLoading} disabled={disabled || isLoading}>
            Activate
          </Button>
        ) : null}
        {isEnding ? (
          <Button
            variant="outlinedWhite"
            onClick={handleSubscribe}
            isLoading={isLoading}
            disabled={disabled || isLoading}
          >
            Prolong
          </Button>
        ) : null}
      </Flex>
    </Box>
  );
};

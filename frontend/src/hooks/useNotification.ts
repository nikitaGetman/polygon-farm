import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';

const commonProps = {
  position: 'bottom-left' as const,
  isClosable: true,
};

export const useNotification = () => {
  const toast = useToast();

  const success = useCallback(
    (title: string, description?: string) => {
      toast({
        ...commonProps,
        title,
        description,
        status: 'success',
      });
    },
    [toast]
  );
  const error = useCallback(
    (title: string, description?: string) => {
      toast({
        ...commonProps,
        title,
        description,
        status: 'error',
        containerStyle: {
          bgColor: 'error',
          borderRadius: 'md',
        },
      });
    },
    [toast]
  );
  const warning = useCallback(
    (title: string, description?: string) => {
      toast({
        ...commonProps,
        title,
        description,
        status: 'warning',
      });
    },
    [toast]
  );

  return {
    success,
    error,
    warning,
  };
};

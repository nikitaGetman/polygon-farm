import { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

import { Notification, NotificationProps } from '@/components/ui/Notification/Notification';
import { tryToGetErrorData } from '@/utils/error';

const commonProps = {
  position: 'bottom-left' as const,
  isClosable: true,
  duration: 30000,
};
type ToastProps = Omit<NotificationProps, 'type' | 'onClose'>;

export const useNotification = () => {
  const toast = useToast();

  const success = useCallback(
    (props: ToastProps) => {
      toast({
        ...commonProps,
        render: ({ onClose }) => <Notification type="success" onClose={onClose} {...props} />,
      });
    },
    [toast]
  );
  const error = useCallback(
    (props: ToastProps) => {
      toast({
        ...commonProps,
        render: ({ onClose }) => <Notification type="error" onClose={onClose} {...props} />,
      });
    },
    [toast]
  );
  const info = useCallback(
    (props: ToastProps) => {
      toast({
        ...commonProps,
        render: ({ onClose }) => <Notification type="info" onClose={onClose} {...props} />,
      });
    },
    [toast]
  );

  const handleError = useCallback(
    (err: any) => {
      const errData = tryToGetErrorData(err);
      error({ title: errData.title, description: errData.description });

      return errData;
    },
    [error]
  );

  return {
    success,
    error,
    info,
    handleError,
  };
};

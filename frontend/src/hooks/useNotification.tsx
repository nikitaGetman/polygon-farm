import { Notification, NotificationProps } from '@/components/ui/Notification/Notification';
import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';

const commonProps = {
  position: 'bottom-left' as const,

  isClosable: true,
};
type ToastProps = Omit<NotificationProps, 'type'>;

export const useNotification = () => {
  const toast = useToast();

  const success = useCallback(
    (props: ToastProps) => {
      toast({
        ...commonProps,
        render: () => <Notification type="success" {...props} />,
      });
    },
    [toast]
  );
  const error = useCallback(
    (props: ToastProps) => {
      toast({
        ...commonProps,
        render: () => <Notification type="error" {...props} />,
      });
    },
    [toast]
  );
  const info = useCallback(
    (props: ToastProps) => {
      toast({
        ...commonProps,
        render: () => <Notification type="info" {...props} />,
      });
    },
    [toast]
  );

  return {
    success,
    error,
    info,
  };
};

import { Notification, NotificationProps } from '@/components/ui/Notification/Notification';
import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';

const commonProps = {
  position: 'bottom-left' as const,
  isClosable: true,
  duration: 15000,
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

  return {
    success,
    error,
    info,
  };
};
